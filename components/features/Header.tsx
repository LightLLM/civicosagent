import React from 'react';
import {
    ShieldCheck,
    AlertTriangle,
    Info,
    MapPin
} from 'lucide-react';
import { CityState } from '../../types';

interface HeaderProps {
    currentCityId: string;
    cityState: CityState;
    onCityChange: (cityId: string) => void;
}

const Header: React.FC<HeaderProps> = ({
    currentCityId,
    cityState,
    onCityChange
}) => {
    return (
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 shrink-0 bg-slate-900/20 backdrop-blur-md z-30">
            <div className="flex items-center gap-6">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                        <MapPin size={10} /> Location
                    </span>
                    <span className="text-sm font-semibold text-white flex items-center gap-2">
                        New York City
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </span>
                </div>

                <div className="h-8 w-px bg-slate-800" />
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Local Time</span>
                    <span className="text-sm font-mono text-emerald-400">
                        {new Date(cityState.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                    </span>
                </div>

                <div className="h-8 w-px bg-slate-800" />
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Weather</span>
                    <span className="text-sm text-slate-300">{cityState.weather.condition} • {cityState.weather.temperature}°C</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="px-3 py-1 rounded bg-amber-500/10 text-amber-500 text-xs border border-amber-500/20 flex items-center gap-2">
                    <AlertTriangle size={14} />
                    {cityState.metrics.safetyIncidents} Alerts Active
                </div>
                <button className="p-2 text-slate-400 hover:text-white transition-colors">
                    <Info size={20} />
                </button>
            </div>
        </header>
    );
};

export default Header;
