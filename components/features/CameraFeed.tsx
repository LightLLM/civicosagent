import React, { useState, useEffect } from 'react';
import {
    Camera,
    ZapOff,
    ZoomOut,
    ZoomIn,
    RotateCcw,
    Search,
    Activity,
    Link2Off,
    Navigation
} from 'lucide-react';
import { Hotspot } from '../../types';
import { simulation } from '../../services/simulation';

interface CameraFeedProps {
    selectedHotspot: Hotspot | null;
    brokenLinks: Set<string>;
    onToggleSignal: (hotspotId: string) => void;
    isSignalLost: boolean;
}

const CameraFeed: React.FC<CameraFeedProps> = ({
    selectedHotspot,
    brokenLinks,
    onToggleSignal,
    isSignalLost
}) => {
    const [cameraLoading, setCameraLoading] = useState(false);
    const [cameraUrl, setCameraUrl] = useState<string>('');
    const [zoomLevel, setZoomLevel] = useState<number>(1);

    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.5, 3));
    const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.5, 1));
    const handleResetZoom = () => setZoomLevel(1);

    useEffect(() => {
        if (selectedHotspot && selectedHotspot.cameraAssetId && !brokenLinks.has(selectedHotspot.id)) {
            setCameraLoading(true);
            setZoomLevel(1);
            const updateCamera = () => {
                setCameraUrl(simulation.getCamera(selectedHotspot.cameraAssetId!)); // Assert non-null as checked above
            };

            updateCamera();
            const loadTimer = setTimeout(() => setCameraLoading(false), 800);

            const interval = setInterval(updateCamera, 5000);
            return () => {
                clearInterval(interval);
                clearTimeout(loadTimer);
            };
        } else {
            setCameraUrl('');
            setCameraLoading(false);
            setZoomLevel(1);
        }
    }, [selectedHotspot, brokenLinks]);

    return (
        <div className="h-56 bg-slate-900/40 rounded-xl border border-slate-800 overflow-hidden flex flex-col relative group">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-10">
                <div className="flex items-center gap-2 text-white">
                    <Camera size={14} className="text-sky-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Visual Intel Feed</span>
                </div>
                {selectedHotspot && (
                    <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold px-1.5 rounded border ${!isSignalLost ? 'text-emerald-400 border-emerald-500/20' : 'text-rose-400 border-rose-500/20'}`}>
                            {!isSignalLost ? 'LINK_ACTIVE' : 'LINK_VACANT'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">{selectedHotspot.cameraAssetId || 'NULL'}</span>
                    </div>
                )}
            </div>

            <div className="flex-1 relative bg-black overflow-hidden flex items-center justify-center">
                {selectedHotspot && !isSignalLost ? (
                    <>
                        <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
                            <img
                                key={cameraUrl}
                                src={cameraUrl}
                                style={{ transform: `scale(${zoomLevel})` }}
                                className={`w-full h-full object-cover filter brightness-75 contrast-125 saturate-50 transition-all duration-1000 ease-in-out ${cameraLoading ? 'opacity-0' : 'opacity-100'}`}
                                alt="CCTV"
                            />
                        </div>

                        <div className="crt-overlay" />
                        <div className="scanline" />
                        <div className="noise" />

                        {/* OSD: Status & Bitrate */}
                        <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5 z-10">
                            <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded border border-white/10">
                                <div className={`w-1.5 h-1.5 rounded-full bg-rose-500 ${!cameraLoading ? 'animate-pulse' : ''}`} />
                                <span className="text-[9px] font-bold text-white uppercase tracking-tighter">LIVE FEED</span>
                            </div>
                            <button
                                onClick={() => selectedHotspot && onToggleSignal(selectedHotspot.id)}
                                className="flex items-center gap-1 text-[8px] font-bold text-rose-400 bg-rose-400/10 px-1 rounded border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-colors uppercase"
                            >
                                <ZapOff size={8} /> Kill Uplink
                            </button>
                        </div>

                        {/* Zoom Control Overlay */}
                        {!cameraLoading && (
                            <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-lg px-2 py-2 rounded-lg border border-white/10 shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                <button
                                    onClick={handleZoomOut}
                                    disabled={zoomLevel <= 1}
                                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-md disabled:opacity-20 transition-all"
                                >
                                    <ZoomOut size={14} />
                                </button>
                                <div className="w-px h-4 bg-white/10 mx-0.5" />
                                <div className="flex flex-col items-center justify-center min-w-[32px]">
                                    <span className="text-[8px] font-bold text-slate-500 uppercase leading-none mb-0.5 font-sans">Zoom</span>
                                    <span className="text-[10px] font-mono text-emerald-400 font-bold leading-none">{zoomLevel.toFixed(1)}x</span>
                                </div>
                                <div className="w-px h-4 bg-white/10 mx-0.5" />
                                <button onClick={handleZoomIn} disabled={zoomLevel >= 3} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-md disabled:opacity-20 transition-all">
                                    <ZoomIn size={14} />
                                </button>
                                <button onClick={handleResetZoom} className="p-1.5 ml-1 text-slate-300 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-md transition-all border border-transparent hover:border-emerald-500/20">
                                    <RotateCcw size={14} />
                                </button>
                            </div>
                        )}

                        <div className="absolute top-2 left-2 z-10 flex flex-col gap-0.5 pointer-events-none font-mono">
                            <span className="text-[10px] text-emerald-400 bg-black/40 px-1 rounded uppercase tracking-tighter">SRC: {selectedHotspot.cameraAssetId}</span>
                            <span className="text-[8px] text-white/60 bg-black/40 px-1 rounded">LAT: {selectedHotspot.location[0].toFixed(4)}</span>
                            <span className="text-[8px] text-white/60 bg-black/40 px-1 rounded">LON: {selectedHotspot.location[1].toFixed(4)}</span>
                            {zoomLevel > 1 && (
                                <div className="flex items-center gap-1 text-[8px] text-amber-400 bg-amber-400/10 px-1 rounded border border-amber-500/20 mt-1">
                                    <Search size={8} /> MAG_ACTIVE
                                </div>
                            )}
                        </div>

                        <div className="absolute bottom-2 right-2 z-10">
                            <span className="text-[10px] font-mono text-white/80 bg-black/40 px-2 py-0.5 rounded border border-white/10 uppercase tracking-tighter">
                                REC_{new Date().toLocaleTimeString([], { hour12: false })}
                            </span>
                        </div>

                        {cameraLoading && (
                            <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-3 z-30">
                                <Activity size={24} className="text-emerald-500 animate-spin" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">negotiating uplink...</span>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-950 overflow-hidden">
                        <div className="noise opacity-100" />
                        <div className="crt-overlay" />
                        {selectedHotspot ? (
                            <div className="relative z-10 flex flex-col items-center">
                                <Link2Off size={40} className="text-rose-500 mb-2 animate-pulse" />
                                {brokenLinks.has(selectedHotspot.id) && (
                                    <button
                                        onClick={() => onToggleSignal(selectedHotspot.id)}
                                        className="mb-4 px-3 py-1 bg-emerald-500 text-slate-950 text-[10px] font-bold rounded hover:bg-emerald-400 transition-colors uppercase tracking-widest shadow-lg"
                                    >
                                        Re-Establish Link
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="relative z-10 flex flex-col items-center gap-3">
                                <div className="p-4 rounded-full bg-slate-900 border border-slate-800 text-slate-700">
                                    <Navigation size={40} className="animate-bounce" />
                                </div>
                                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-600">Select Geo-Hotspot to Link</p>
                            </div>
                        )}
                        <div className="relative z-10 flex flex-col items-center gap-1 text-center px-6 mt-2">
                            {selectedHotspot && (
                                <>
                                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">Hardware Link Vacant</p>
                                    <p className="text-[8px] uppercase font-medium text-slate-600 leading-tight">ERROR: ERR_LINK_VACANT - Uplink handshake failed.</p>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CameraFeed;
