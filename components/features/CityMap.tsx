import React from 'react';
import {
    Zap,
    MapPin,
    ZapOff
} from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { CityState, Hotspot } from '../../types';

interface CityMapProps {
    currentCityId: string;
    cityState: CityState;
    selectedHotspot: Hotspot | null;
    brokenLinks: Set<string>;
    onSelectHotspot: (hotspot: Hotspot) => void;
}

const GOOGLE_MAPS_API_KEY = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY';

// NYC center coordinates
const NYC_CENTER = { lat: 40.7128, lng: -74.0060 };

const getStatusColor = (status: string, isBroken: boolean): string => {
    if (isBroken) return '#ef4444'; // red
    if (status === 'Critical') return '#ef4444'; // red
    if (status === 'Warning') return '#f59e0b'; // amber
    return '#10b981'; // emerald
};

const CityMap: React.FC<CityMapProps> = ({
    currentCityId,
    cityState,
    selectedHotspot,
    brokenLinks,
    onSelectHotspot
}) => {
    const [infoWindowHotspot, setInfoWindowHotspot] = React.useState<Hotspot | null>(null);

    const handleMarkerClick = (hotspot: Hotspot) => {
        onSelectHotspot(hotspot);
        setInfoWindowHotspot(hotspot);
    };

    return (
        <div className="col-span-8 row-span-3 bg-slate-900/40 rounded-xl border border-slate-800 relative overflow-hidden group">
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                <Map
                    defaultCenter={NYC_CENTER}
                    defaultZoom={11}
                    mapId="civicos-nyc-map"
                    style={{ width: '100%', height: '100%' }}
                    disableDefaultUI={true}
                    gestureHandling="cooperative"
                    colorScheme="DARK"
                >
                    {cityState.hotspots.map((h) => {
                        const isBroken = brokenLinks.has(h.id);
                        const color = getStatusColor(h.status, isBroken);

                        return (
                            <AdvancedMarker
                                key={h.id}
                                position={{ lat: h.location[0], lng: h.location[1] }}
                                onClick={() => handleMarkerClick(h)}
                            >
                                <Pin
                                    background={color}
                                    borderColor={color}
                                    glyphColor="#ffffff"
                                />
                            </AdvancedMarker>
                        );
                    })}

                    {infoWindowHotspot && (
                        <InfoWindow
                            position={{
                                lat: infoWindowHotspot.location[0],
                                lng: infoWindowHotspot.location[1]
                            }}
                            onCloseClick={() => setInfoWindowHotspot(null)}
                        >
                            <div className="p-2 min-w-[200px]">
                                <h3 className="font-bold text-slate-900 text-sm mb-1">
                                    {infoWindowHotspot.name}
                                </h3>
                                <div className={`text-xs font-semibold mb-1 ${infoWindowHotspot.status === 'Critical' ? 'text-red-600' :
                                        infoWindowHotspot.status === 'Warning' ? 'text-amber-600' :
                                            'text-emerald-600'
                                    }`}>
                                    Status: {infoWindowHotspot.status}
                                </div>
                                <p className="text-xs text-slate-600">
                                    {infoWindowHotspot.reason}
                                </p>
                            </div>
                        </InfoWindow>
                    )}
                </Map>
            </APIProvider>

            {/* Network Topology Overlay */}
            <div className="absolute top-4 left-4 p-3 bg-slate-950/80 backdrop-blur rounded-lg border border-slate-800 max-w-xs z-10">
                <h3 className="text-xs font-bold text-slate-300 uppercase mb-2">NYC Network Topology</h3>
                <div className="space-y-1.5 overflow-y-auto max-h-32 custom-scrollbar">
                    {cityState.hotspots.map(h => (
                        <div key={h.id} className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${brokenLinks.has(h.id) || h.status === 'Critical' ? 'bg-rose-500' : h.status === 'Warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                            <span className={`text-[10px] truncate ${brokenLinks.has(h.id) ? 'text-rose-400 italic' : 'text-slate-400'}`}>
                                {h.name} {brokenLinks.has(h.id) ? '(SIGNAL LOST)' : ''}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="absolute bottom-4 inset-x-4 flex justify-between items-end z-10">
                <div className="flex gap-2">
                    <div className="px-2 py-1 rounded bg-slate-950/80 border border-slate-800 text-[10px] font-mono">MAP_MODE: INFRASTRUCTURE</div>
                    <div className="px-2 py-1 rounded bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-emerald-400 uppercase tracking-tighter">DATASET: NYC_LIVE</div>
                </div>
            </div>
        </div>
    );
};

export default CityMap;
