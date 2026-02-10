
import { CityState, Hotspot, SimulationEvent } from '../types';
import { CITIES, INITIAL_CITY_STATE } from '../constants';

export class CitySimulation {
  private state: CityState;
  private interventions: Set<string> = new Set();
  private eventQueue: SimulationEvent[] = [];
  private activeScenario: string | null = null;

  constructor() {
    this.state = JSON.parse(JSON.stringify(INITIAL_CITY_STATE));
  }

  public getState(): CityState {
    return { ...this.state };
  }

  public loadCity(cityId: string) {
    const baseState = CITIES[cityId] || INITIAL_CITY_STATE;
    this.state = JSON.parse(JSON.stringify(baseState));
    this.interventions.clear();
    this.eventQueue = [];
    this.activeScenario = null;
  }

  public getCamera(assetId: string): string {
    const cacheBuster = Math.floor(Date.now() / 5000);
    return `https://picsum.photos/seed/${assetId}_${cacheBuster}/800/600?grayscale`;
  }

  public executeAction(actionId: string, params: any): string {
    this.interventions.add(actionId);

    // Simulate action effects
    if (actionId === 'dispatch_ems') {
      this.state.metrics.emsLoad = Math.max(0, this.state.metrics.emsLoad - 15);
      this.state.metrics.safetyIncidents = Math.max(0, this.state.metrics.safetyIncidents - 1);
      return `Units dispatched to ${params.target || 'target sector'}. EMS load reduced.`;
    }

    if (actionId === 'adjust_signals') {
      this.state.metrics.congestionIndex = Math.max(0, this.state.metrics.congestionIndex - 10);
      return `Signal timing adjusted for ${params.target || 'grid'}. Flow improved.`;
    }

    if (actionId === 'broadcast_alert') {
      return `Public alert broadcast: "${params.message || 'Caution advised'}".`;
    }

    return `Executed ${actionId} with ${JSON.stringify(params)}. Status: Success.`;
  }

  public advanceTime() {
    // Base fluctuation
    this.state.metrics.congestionIndex = this.clamp(this.state.metrics.congestionIndex + (Math.random() * 6 - 3));
    this.state.metrics.emsLoad = this.clamp(this.state.metrics.emsLoad + (Math.random() * 4 - 2));
    this.state.metrics.transitOnTime = this.clamp(this.state.metrics.transitOnTime + (Math.random() * 2 - 1));
    this.state.metrics.powerGridLoad = this.clamp(this.state.metrics.powerGridLoad + (Math.random() * 3 - 1.5));

    // Scenario bias
    if (this.activeScenario === 'Storm') {
      this.state.metrics.congestionIndex += 2;
      this.state.metrics.powerGridLoad += 1.5;
    }

    // Process events
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (event) this.applyEvent(event);
    }

    // Random incidents
    if (Math.random() > 0.85) {
      this.triggerRandomHotspotEvent();
    } else {
      this.resolveHotspots();
    }

    this.state.timestamp = new Date().toISOString();
  }

  public triggerExternalEvent(event: string | SimulationEvent) {
    if (typeof event === 'string') {
      // Legacy support or simple string triggers
      if (event.includes('Rain')) {
        this.eventQueue.push({
          type: 'WEATHER',
          severity: 80,
          description: 'Heavy Rain detected',
        });
      }
    } else {
      this.eventQueue.push(event);
    }
  }

  private applyEvent(event: SimulationEvent) {
    if (event.type === 'WEATHER') {
      this.state.weather.condition = event.description;
      this.state.metrics.congestionIndex += (event.severity / 10);
    }
  }

  private triggerRandomHotspotEvent() {
    const h = this.state.hotspots[Math.floor(Math.random() * this.state.hotspots.length)];
    h.status = Math.random() > 0.5 ? 'Warning' : 'Critical';
    h.reason = 'Unexpected surge in activity reported.';
    this.state.metrics.congestionIndex += 5;
    this.state.metrics.safetyIncidents += 1;
  }

  private resolveHotspots() {
    this.state.hotspots.forEach(h => {
      if (h.status !== 'Normal') {
        if (Math.random() > 0.6) {
          h.status = 'Normal';
          h.reason = 'Situation normalized';
        }
      }
    });
  }

  private clamp(num: number): number {
    return Math.max(0, Math.min(100, num));
  }
}

export const simulation = new CitySimulation();
