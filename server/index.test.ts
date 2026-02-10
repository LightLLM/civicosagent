import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from './index';

// Mock GoogleGenAI
vi.mock('@google/genai', () => {
    return {
        GoogleGenAI: vi.fn().mockImplementation(() => ({
            models: {
                generateContent: vi.fn().mockResolvedValue({
                    text: JSON.stringify({
                        cycle: 1,
                        time: "2024-01-01T00:00:00Z",
                        situationSummary: ["Test Summary"],
                        causalHypotheses: ["Test Hypothesis"],
                        forecast: "Test Forecast",
                        actionsChosen: [],
                        metricsToWatch: [],
                        learningNotes: "Test Notes"
                    })
                })
            }
        })),
        Type: {
            OBJECT: 'object',
            STRING: 'string',
            INTEGER: 'integer',
            ARRAY: 'array'
        }
    };
});

describe('POST /api/cycle', () => {
    it('should return a valid decision packet', async () => {
        const response = await request(app)
            .post('/api/cycle')
            .send({
                cycleNumber: 1,
                cityState: {},
                lastPacket: null
            });

        expect(response.status).toBe(200);
        expect(response.body.cycle).toBe(1);
        expect(response.body.situationSummary).toContain("Test Summary");
    });
});
