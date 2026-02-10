import { DecisionPacket, CityState } from "../types";

export async function runDecisionCycle(
  cycleNumber: number,
  cityState: CityState,
  lastPacket?: DecisionPacket
): Promise<DecisionPacket> {
  try {
    const response = await fetch('/api/cycle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cycleNumber,
        cityState,
        lastPacket
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    return data as DecisionPacket;

  } catch (e) {
    console.error("Agent Decision Cycle Failed:", e);
    // Return a fallback packet to prevent crash
    return {
      cycle: cycleNumber,
      time: new Date().toISOString(),
      situationSummary: ["Agent system offline or unresponsive.", "Manual control recommended."],
      causalHypotheses: ["Backend Connectivity Issue", "Model Overload"],
      forecast: "Uncertain",
      actionsChosen: [],
      metricsToWatch: [],
      learningNotes: "System error logged.",
      toolCalls: []
    };
  }
}
