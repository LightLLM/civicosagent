import React from 'react';
import { CloudRain, ZapOff, ShieldAlert, Activity } from 'lucide-react';
import { simulation } from '../../services/simulation';

interface ScenarioSelectorProps {
    onScenarioTrigger: (scenario: string) => void;
}

const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ onScenarioTrigger }) => {
    const scenarios = [
        { id: 'Heavy Rain', label: 'Severe Storm', icon: <CloudRain size={16} />, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-500/20' },
        { id: 'Grid Failure', label: 'Power Grid Failure', icon: <ZapOff size={16} />, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-500/20' },
        { id: 'Cyberattack', label: 'Cyber Intrusion', icon: <ShieldAlert size={16} />, color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-500/20' },
        { id: 'Crowd Surge', label: 'Crowd Surge', icon: <Activity size={16} />, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-500/20' },
    ];

    const handleTrigger = (id: string) => {
        simulation.triggerExternalEvent(id);
        onScenarioTrigger(id);
    };

    return (
        <div className="space-y-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1 mb-2">Scenarios</div>
            <div className="grid grid-cols-1 gap-2">
                {scenarios.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => handleTrigger(s.id)}
                        className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg border transition-all hover:bg-slate-800 ${s.color} ${s.bg} ${s.border}`}
                    >
                        {s.icon}
                        <span className="text-xs font-medium">{s.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ScenarioSelector;
