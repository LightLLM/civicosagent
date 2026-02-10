import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  CityState,
  DecisionPacket,
  LogEntry,
  AgentStatus,
  Hotspot
} from './types';
import { simulation } from './services/simulation';
import { runDecisionCycle } from './services/gemini';
import Terminal from './components/Terminal';

// Layout & Features
import MainLayout from './components/layout/MainLayout';
import Sidebar from './components/features/Sidebar';
import Header from './components/features/Header';
import MetricGrid from './components/features/MetricGrid';
import CityMap from './components/features/CityMap';
import CameraFeed from './components/features/CameraFeed';
import PacketViewer from './components/features/PacketViewer';

const App: React.FC = () => {
  const [currentCityId, setCurrentCityId] = useState<string>('nyc');
  const [cityState, setCityState] = useState<CityState>(simulation.getState());
  const [packets, setPackets] = useState<DecisionPacket[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<AgentStatus>(AgentStatus.IDLE);
  const [isRunning, setIsRunning] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [brokenLinks, setBrokenLinks] = useState<Set<string>>(new Set());

  const timerRef = useRef<number | null>(null);

  const addLog = useCallback((type: LogEntry['type'], message: string, data?: any) => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      type,
      message,
      data
    }]);
  }, []);

  const handleCityChange = (cityId: string) => {
    setIsRunning(false);
    setCurrentCityId(cityId);
    simulation.loadCity(cityId);
    setCityState(simulation.getState());
    setPackets([]);
    setLogs([]);
    setCycleCount(0);
    setSelectedHotspot(null);
    setBrokenLinks(new Set());
    setStatus(AgentStatus.IDLE);
    addLog('INFO', `Context Shift: Switched monitoring to New York City`);
  };

  const toggleSignal = (id: string) => {
    setBrokenLinks(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        addLog('INFO', `Manual override: Signal restored for asset ${id}`);
      } else {
        next.add(id);
        addLog('ACTION', `Manual override: Link severed for asset ${id}`);
      }
      return next;
    });
  };

  const handleCycle = async () => {
    if (status !== AgentStatus.IDLE && status !== AgentStatus.WAITING) return;

    setCycleCount(prev => prev + 1);
    setStatus(AgentStatus.SENSING);
    addLog('INFO', `Starting Cycle ${cycleCount + 1}...`);

    try {
      const currentState = simulation.getState();
      setCityState(currentState);
      addLog('TOOL', 'get_city_state() returned latest telemetry.', currentState);

      setStatus(AgentStatus.MODELING);
      const lastPacket = packets[packets.length - 1];
      const packet = await runDecisionCycle(cycleCount + 1, currentState, lastPacket);

      setStatus(AgentStatus.ACTING);
      addLog('PACKET', `Decision Packet Generated for Cycle ${packet.cycle}`);

      if (packet.toolCalls) {
        for (const call of packet.toolCalls) {
          const result = simulation.executeAction(call.tool, call.params);
          addLog('ACTION', result);
        }
      }

      setPackets(prev => [...prev, packet]);

      setStatus(AgentStatus.EVALUATING);
      simulation.advanceTime();
      setCityState(simulation.getState());

      addLog('INFO', 'Cycle complete. Entering holding pattern for 30s.');
      setStatus(AgentStatus.WAITING);

    } catch (error) {
      addLog('TOOL', `Cycle failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setStatus(AgentStatus.IDLE);
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (isRunning) {
      if (status === AgentStatus.IDLE || status === AgentStatus.WAITING) {
        const delay = status === AgentStatus.IDLE ? 1000 : 30000;
        timerRef.current = window.setTimeout(handleCycle, delay);
      }
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, status]);

  const isSignalLost = !selectedHotspot || brokenLinks.has(selectedHotspot.id) || !selectedHotspot.cameraAssetId;
  const latestPacket = packets[packets.length - 1];

  return (
    <MainLayout
      sidebar={
        <Sidebar
          status={status}
          cycleCount={cycleCount}
          isRunning={isRunning}
          onToggleRun={() => setIsRunning(!isRunning)}
        />
      }
      header={
        <Header
          currentCityId={currentCityId}
          cityState={cityState}
          onCityChange={handleCityChange}
        />
      }
    >
      <div className="flex-1 p-6 grid grid-cols-12 grid-rows-6 gap-6 overflow-hidden">

        {/* Top Metrics Row */}
        <MetricGrid metrics={cityState.metrics} />

        {/* Map / Visualization Area */}
        <CityMap
          currentCityId={currentCityId}
          cityState={cityState}
          selectedHotspot={selectedHotspot}
          brokenLinks={brokenLinks}
          onSelectHotspot={setSelectedHotspot}
        />

        <div className="col-span-4 row-span-5 flex flex-col gap-6">
          <PacketViewer
            latestPacket={latestPacket}
            currentCityId={currentCityId}
          />

          {/* Camera View Area */}
          <CameraFeed
            selectedHotspot={selectedHotspot}
            brokenLinks={brokenLinks}
            onToggleSignal={toggleSignal}
            isSignalLost={isSignalLost}
          />
        </div>

        <div className="col-span-8 row-span-2">
          <Terminal logs={logs} />
        </div>

      </div>
    </MainLayout>
  );
};

export default App;
