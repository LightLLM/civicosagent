
import React from 'react';

interface MetricCardProps {
  label: string;
  value: number;
  unit?: string;
  icon: React.ReactNode;
  color: 'emerald' | 'rose' | 'amber' | 'sky';
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit = '%', icon, color }) => {
  const colorClasses = {
    emerald: 'text-emerald-400 bg-emerald-400/10',
    rose: 'text-rose-400 bg-rose-400/10',
    amber: 'text-amber-400 bg-amber-400/10',
    sky: 'text-sky-400 bg-sky-400/10',
  };

  const borderClasses = {
    emerald: 'border-emerald-500/30',
    rose: 'border-rose-500/30',
    amber: 'border-amber-500/30',
    sky: 'border-sky-500/30',
  };

  return (
    <div className={`p-4 rounded-xl border ${borderClasses[color]} bg-slate-900/50 backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</span>
        <div className={`p-1.5 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-white tracking-tight">
          {typeof value === 'number' ? value.toFixed(1) : value}
        </span>
        <span className="text-slate-500 text-sm font-medium">{unit}</span>
      </div>
      <div className="mt-3 w-full bg-slate-800 rounded-full h-1 overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${color.includes('emerald') ? 'bg-emerald-500' : color.includes('rose') ? 'bg-rose-500' : color.includes('amber') ? 'bg-amber-500' : 'bg-sky-500'}`} 
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
};

export default MetricCard;
