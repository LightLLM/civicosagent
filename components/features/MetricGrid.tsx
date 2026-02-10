import React from 'react';
import {
    Activity,
    ShieldCheck,
    Zap,
    AlertTriangle
} from 'lucide-react';
import { CityState } from '../../types';
import MetricCard from '../MetricCard';

interface MetricGridProps {
    metrics: CityState['metrics'];
}

const MetricGrid: React.FC<MetricGridProps> = ({ metrics }) => {
    return (
        <div className="col-span-12 row-span-1 grid grid-cols-5 gap-6">
            <MetricCard
                label="Congestion Index"
                value={metrics.congestionIndex}
                icon={<Activity size={16} />}
                color={metrics.congestionIndex > 70 ? 'rose' : metrics.congestionIndex > 40 ? 'amber' : 'emerald'}
            />
            <MetricCard
                label="EMS / 911 Load"
                value={metrics.emsLoad}
                icon={<ShieldCheck size={16} />}
                color={metrics.emsLoad > 80 ? 'rose' : 'emerald'}
            />
            <MetricCard
                label="Transit On-Time"
                value={metrics.transitOnTime}
                icon={<Zap size={16} />}
                color={metrics.transitOnTime < 80 ? 'rose' : 'emerald'}
            />
            <MetricCard
                label="Incidents"
                value={metrics.safetyIncidents}
                unit="Active"
                icon={<AlertTriangle size={16} />}
                color={metrics.safetyIncidents > 5 ? 'rose' : 'amber'}
            />
            <MetricCard
                label="Grid Load"
                value={metrics.powerGridLoad}
                icon={<Zap size={16} />}
                color={metrics.powerGridLoad > 90 ? 'rose' : 'emerald'}
            />
        </div>
    );
};

export default MetricGrid;
