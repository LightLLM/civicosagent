import React from 'react';
import {
    ShieldCheck,
    Activity,
    Info,
    Zap
} from 'lucide-react';
import { DecisionPacket } from '../../types';

interface PacketViewerProps {
    latestPacket: DecisionPacket | undefined;
    currentCityId: string;
}

const PacketViewer: React.FC<PacketViewerProps> = ({ latestPacket, currentCityId }) => {
    return (
        <div className="flex-1 bg-slate-900/40 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-400" />
                    <h2 className="font-bold text-sm text-white">Latest Decision Packet</h2>
                </div>
                {latestPacket && (
                    <span className="text-[10px] font-mono text-slate-500">C{latestPacket.cycle} @ {new Date(latestPacket.time).toLocaleTimeString()}</span>
                )}
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
                {!latestPacket ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-4">
                        <Activity className="text-slate-700 animate-pulse" size={48} />
                        <p className="text-slate-500 text-sm italic">System is monitoring {currentCityId === 'veridia' ? 'Veridia' : 'Aether'}... Start agent for interventions.</p>
                    </div>
                ) : (
                    <>
                        <section>
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <Info size={12} className="text-sky-400" /> Situation Summary
                            </h3>
                            <ul className="space-y-1.5">
                                {latestPacket.situationSummary.map((s, i) => (
                                    <li key={i} className="text-xs text-slate-300 leading-relaxed pl-3 border-l border-sky-500/30">{s}</li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <Activity size={12} className="text-amber-400" /> Hypotheses
                            </h3>
                            <ul className="space-y-1.5">
                                {latestPacket.causalHypotheses.map((h, i) => (
                                    <li key={i} className="text-xs text-slate-400 bg-slate-800/30 p-2 rounded italic">"{h}"</li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <Zap size={12} className="text-emerald-400" /> Interventions
                            </h3>
                            <div className="space-y-3">
                                {latestPacket.actionsChosen.map((a, i) => (
                                    <div key={i} className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 group hover:bg-emerald-500/10 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-bold text-emerald-400">{a.actionName}</span>
                                            <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 rounded font-bold">ACT_0{i + 1}</span>
                                        </div>
                                        <p className="text-[11px] text-slate-400 mb-2 leading-snug">Target: {a.target}</p>
                                        <p className="text-[11px] text-slate-300 mb-2">{a.why}</p>
                                        <div className="text-[10px] text-slate-500 italic mt-2 border-t border-slate-800 pt-2">
                                            Rollback: {a.rollback}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
};

export default PacketViewer;
