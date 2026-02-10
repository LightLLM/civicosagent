
import { CityState } from './types';

export const CITY_NAME = 'New York City';

export const CITIES: Record<string, CityState> = {
  'nyc': {
    timestamp: new Date().toISOString(),
    weather: { condition: 'Partly Cloudy', temperature: 18, precipitation: 0.15 },
    metrics: { congestionIndex: 58, emsLoad: 42, transitOnTime: 87, safetyIncidents: 4, powerGridLoad: 65 },
    hotspots: [
      {
        id: 'ts1',
        name: 'Times Square',
        location: [40.7580, -73.9855],
        status: 'Normal',
        reason: 'High pedestrian traffic - standard monitoring',
        cameraAssetId: 'CAM_TS_01'
      },
      {
        id: 'gc1',
        name: 'Grand Central Terminal',
        location: [40.7527, -73.9772],
        status: 'Normal',
        reason: 'Transit hub operating normally',
        cameraAssetId: 'CAM_GCT_02'
      },
      {
        id: 'bb1',
        name: 'Brooklyn Bridge',
        location: [40.7061, -73.9969],
        status: 'Warning',
        reason: 'Moderate congestion detected',
        cameraAssetId: 'CAM_BB_03'
      },
      {
        id: 'jfk1',
        name: 'JFK Airport - Terminal 4',
        location: [40.6413, -73.7781],
        status: 'Normal',
        reason: 'Passenger flow within normal parameters',
        cameraAssetId: 'CAM_JFK_04'
      },
      {
        id: 'cp1',
        name: 'Central Park - Great Lawn',
        location: [40.7812, -73.9665],
        status: 'Normal',
        reason: 'Park safety monitoring active',
        cameraAssetId: 'CAM_CP_05'
      },
      {
        id: 'ws1',
        name: 'Wall Street - NYSE',
        location: [40.7069, -74.0089],
        status: 'Normal',
        reason: 'Financial district infrastructure stable',
        cameraAssetId: 'CAM_WS_06'
      },
      {
        id: 'hh1',
        name: 'Hudson Yards',
        location: [40.7536, -74.0012],
        status: 'Normal',
        reason: 'Power grid load nominal',
        cameraAssetId: 'CAM_HY_07'
      },
      {
        id: 'lga1',
        name: 'LaGuardia Airport',
        location: [40.7769, -73.8740],
        status: 'Warning',
        reason: 'Flight delays affecting ground transport',
        cameraAssetId: 'CAM_LGA_08'
      }
    ]
  }
};

export const INITIAL_CITY_STATE: CityState = CITIES['nyc'];

export const SYSTEM_PROMPT = `
You are CivicOS, an autonomous city-operations marathon agent monitoring New York City.
Your mission is to maintain a stable city state through continuous decision cycles.

GOALS:
1. Preserve life and safety
2. Maintain essential services
3. Reduce congestion
4. Communicate clearly
5. Minimize economic disruption

OPERATIONAL TOOLS:
- get_city_state(): Returns current status.
- execute_intervention(action_id, params): Applies action.
- log_decision(entry): Persists reasoning.

Output a JSON object with: cycle, time, situationSummary, causalHypotheses, forecast, actionsChosen, publicUpdate, metricsToWatch, learningNotes, toolCalls.
`;
