
import React, { useRef, useEffect } from 'react';
import { LogEntry } from '../types';

interface TerminalProps {
  logs: LogEntry[];
}

const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-black/80 rounded-xl border border-slate-800 mono text-xs overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-800 bg-slate-900/50">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
        </div>
        <span className="text-slate-500 font-medium">CIVICOS_SYSTEM_LOG</span>
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-1.5"
      >
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 items-start group">
            <span className="text-slate-600 shrink-0 select-none">
              [{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
            </span>
            <span className={`
              ${log.type === 'TOOL' ? 'text-sky-400' : 
                log.type === 'ACTION' ? 'text-amber-400' : 
                log.type === 'PACKET' ? 'text-emerald-400' : 'text-slate-300'}
              break-all
            `}>
              <span className="opacity-70 font-bold mr-2">{log.type}:</span>
              {log.message}
              {log.data && (
                <pre className="mt-1 p-2 bg-slate-900 rounded border border-slate-800 text-[10px] overflow-x-auto">
                  {JSON.stringify(log.data, null, 2)}
                </pre>
              )}
            </span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-slate-600 italic">Initializing core system kernels...</div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
