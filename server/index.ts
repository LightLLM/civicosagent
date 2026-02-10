import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from "@google/genai";
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

export const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    console.error("ERROR: API Key not found or is placeholder in .env.local");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const SYSTEM_PROMPT = `
You are the AI core of "CivicOS", an autonomous city management system.
Your goal is to analyze city metrics, identify issues, and execute interventions.
Maintain a cool, logical, and efficient persona.
`;

app.post('/api/cycle', async (req: Request, res: Response) => {
    try {
        const { cycleNumber, cityState, lastPacket } = req.body;

        const prompt = `
      CURRENT CYCLE: ${cycleNumber}
      CITY STATE: ${JSON.stringify(cityState)}
      LAST DECISION PACKET: ${JSON.stringify(lastPacket || 'N/A')}

      Perform your cycle steps (Sense, Model, Plan, Act, Evaluate). 
      Identify risk hotspots and generate a decision packet.
    `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        cycle: { type: Type.INTEGER },
                        time: { type: Type.STRING },
                        situationSummary: { type: Type.ARRAY, items: { type: Type.STRING } },
                        causalHypotheses: { type: Type.ARRAY, items: { type: Type.STRING } },
                        forecast: { type: Type.STRING },
                        actionsChosen: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    actionName: { type: Type.STRING },
                                    target: { type: Type.STRING },
                                    why: { type: Type.STRING },
                                    rollback: { type: Type.STRING }
                                },
                                required: ["actionName", "target", "why", "rollback"]
                            }
                        },
                        publicUpdate: { type: Type.STRING },
                        metricsToWatch: { type: Type.ARRAY, items: { type: Type.STRING } },
                        learningNotes: { type: Type.STRING },
                        toolCalls: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    tool: { type: Type.STRING },
                                    params: {
                                        type: Type.OBJECT,
                                        description: "Tool parameters used for the intervention",
                                        properties: {
                                            id: { type: Type.STRING, description: "Identifier for target asset or area" },
                                            target: { type: Type.STRING, description: "Subject of the action" },
                                            value: { type: Type.NUMBER, description: "Numerical value if applicable (e.g., intensity, duration)" },
                                            message: { type: Type.STRING, description: "Descriptive message or broadcast content" }
                                        }
                                    }
                                },
                                required: ["tool", "params"]
                            }
                        }
                    },
                    required: ["cycle", "time", "situationSummary", "causalHypotheses", "forecast", "actionsChosen", "metricsToWatch", "learningNotes"]
                }
            }
        });

        if (!response.text) {
            throw new Error("Empty response from AI");
        }

        const data = JSON.parse(response.text);
        res.json(data);

    } catch (error) {
        console.error("Backend Decision Cycle Error:", error);
        res.status(500).json({
            error: "Internal Server Error",
            details: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`CivicOS Backend running at http://localhost:${port}`);
    });
}
