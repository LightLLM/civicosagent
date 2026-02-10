
export interface CityState {
  timestamp: string;
  weather: {
    condition: string;
    temperature: number;
    precipitation: number;
  };
  metrics: {
    congestionIndex: number; // 0-100
    emsLoad: number; // 0-100
    transitOnTime: number; // 0-100
    safetyIncidents: number;
    powerGridLoad: number;
  };
  hotspots: Hotspot[];
}

export interface Hotspot {
  id: string;
  name: string;
  location: [number, number]; // [lat, lng]
  status: 'Normal' | 'Warning' | 'Critical';
  reason: string;
  cameraAssetId: string;
}

export interface DecisionPacket {
  cycle: number;
  time: string;
  situationSummary: string[];
  causalHypotheses: string[];
  forecast: string;
  actionsChosen: ActionEntry[];
  publicUpdate?: string;
  metricsToWatch: string[];
  learningNotes: string;
  toolCalls?: ToolCall[];
}

export interface ActionEntry {
  actionName: string;
  target: string;
  why: string;
  rollback: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'TOOL' | 'INFO' | 'ACTION' | 'PACKET';
  message: string;
  data?: any;
}

export enum AgentStatus {
  IDLE = 'IDLE',
  SENSING = 'SENSING',
  MODELING = 'MODELING',
  PLANNING = 'PLANNING',
  ACTING = 'ACTING',
  EVALUATING = 'EVALUATING',
  WAITING = 'WAITING'
}

export interface ToolCall {
  tool: string;
  params: Record<string, any>;
}

export interface SimulationEvent {
  type: 'WEATHER' | 'INCIDENT' | 'SYSTEM_FAILURE';
  severity: number; // 0-100
  description: string;
  location?: [number, number];
}
