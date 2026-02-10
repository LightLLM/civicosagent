
import React from 'react';
import {
  ShieldCheck,
  Globe,
  Layers,
  Activity,
  Play,
  Pause
} from 'lucide-react';
import { AgentStatus } from '../../types';
import ScenarioSelector from './ScenarioSelector';

interface SidebarProps {
  status: AgentStatus;
  cycleCount: number;
  isRunning: boolean;
  onToggleRun: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  status,
  cycleCount,
  isRunning,
  onToggleRun
}) => {
  return (
    <aside className="w-64 border-r border-slate-800 flex flex-col bg-slate-900/40 shrink-0">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950">
            <ShieldCheck size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">CivicOS</h1>
        </div>
        <p className="text-[10px] uppercase tracking-widest text-emerald-500 font-semibold">Marathon Agent v2.5</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Operations</div>
        <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium transition-all">
          <Globe size={18} /> Dashboard
        </button>
        <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-slate-800/50 text-slate-400 transition-colors">
          <Layers size={18} /> Systems Map
        </button>
        <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-slate-800/50 text-slate-400 transition-colors">
          <Activity size={18} /> Performance
        </button>

        <div className="pt-6">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Agent Control</div>
          <div className="space-y-3 px-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Simulation</span>
              <button
                onClick={onToggleRun}
                className={`p-1.5 rounded-full transition-all active:scale-95 ${isRunning ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}
              >
                {isRunning ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              </button>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 shadow-inner">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Status</span>
                <span className={`text-[10px] font-bold uppercase transition-all duration-300 ${status !== AgentStatus.IDLE ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`}>
                  {status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Cycles Run</span>
                <span className="text-xs font-mono text-white">{cycleCount}</span>
              </div>
            </div>

            <div className="pt-2">
              <ScenarioSelector onScenarioTrigger={(id) => console.log('Scenario Triggered:', id)} />
            </div>
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          System Secure: Encrypted
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
