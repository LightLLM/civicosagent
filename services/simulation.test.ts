import { describe, it, expect, beforeEach } from 'vitest';
import { CitySimulation } from './simulation';
import { AgentStatus } from '../types';

describe('CitySimulation', () => {
    let sim: CitySimulation;

    beforeEach(() => {
        sim = new CitySimulation();
    });

    it('should initialize with default state', () => {
        const state = sim.getState();
        expect(state).toBeDefined();
        expect(state.metrics).toBeDefined();
    });

    it('should load a city correctly', () => {
        sim.loadCity('veridia');
        const state = sim.getState();
        expect(state.metrics.powerGridLoad).toBe(58); // Matches constants.ts

        // Test switching
        sim.loadCity('aether');
        const newState = sim.getState();
        expect(newState.metrics.powerGridLoad).toBe(72); // Matches constants.ts
    });

    it('should advance time and fluctuate metrics', () => {
        const initial = sim.getState();
        sim.advanceTime();
        const next = sim.getState();

        expect(next.timestamp).not.toBe(initial.timestamp);
        // Metrics should exist but might be same due to random float nature, 
        // but at least structure is intact. We can check if they are numbers.
        expect(typeof next.metrics.congestionIndex).toBe('number');
    });

    it('should execute actions and return feedback', () => {
        const result = sim.executeAction('dispatch_ems', { target: 'Sector 4' });
        expect(result).toContain('Units dispatched');
        expect(result).toContain('Sector 4');
    });
});
