'use client';

import { PredictResponse, AssessResponse } from '@/lib/api';
import { Activity, Clock } from 'lucide-react';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';

interface Props {
    prediction: PredictResponse | null;
    assessment?: AssessResponse | null;
    loading: boolean;
}

const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (active && payload && payload.length) {
        const dist = payload[0].value;
        const time = formatTime(label || '');
        return (
            <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-3 shadow-xl">
                <p className="text-xs text-neutral-500 mb-2 font-mono uppercase">
                    {time} UTC
                </p>
                <div className="flex items-baseline gap-2">
                    <span className={`text-lg font-mono ${dist < 1 ? 'text-rose-500' : (dist < 5 ? 'text-amber-500' : 'text-emerald-500')}`}>
                        {dist.toFixed(2)}
                    </span>
                    <span className="text-xs text-neutral-500">km</span>
                </div>
            </div>
        );
    }
    return null;
};

export default function TimelineChart({ prediction, assessment, loading }: Props) {
    if (loading) {
        return (
            <div className="bg-neutral-950/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Activity size={24} className="text-neutral-600 animate-pulse" />
                    <p className="text-neutral-500 text-sm m-0">Computing 24-hour prediction...</p>
                </div>
            </div>
        );
    }

    if (!prediction && !assessment) {
        return (
            <div className="bg-neutral-950/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-[400px] flex flex-col">
                <h3 className="text-sm font-semibold text-neutral-100 mb-6">Distance Timeline</h3>
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <Activity size={24} className="mb-4 text-neutral-600" />
                    <p className="text-sm text-neutral-500">
                        Distance timeline not available.<br/>
                        Click <strong>Predict TCA</strong> to generate a 24-hour forecast.
                    </p>
                </div>
            </div>
        );
    }

    const data = prediction?.timeline.map(p => ({
        time: p.time_utc,
        distance_km: p.distance_km
    })) || (assessment ? [{
        time: assessment.timestamp,
        distance_km: assessment.risk.distance_km
    }] : []);

    return (
        <div className="bg-neutral-950/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Clock size={16} className="text-neutral-500" />
                    <h3 className="text-sm font-semibold text-neutral-100 m-0">
                        {prediction ? '24H Predicted Distance' : 'Real-Time Distance'}
                    </h3>
                </div>
                {prediction && (
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                        SGP4
                    </span>
                )}
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="distGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                        <XAxis
                            dataKey="time"
                            tickFormatter={formatTime}
                            stroke="#404040"
                            tick={{ fill: '#737373', fontSize: 11, fontFamily: 'monospace' }}
                            minTickGap={30}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#404040"
                            tick={{ fill: '#737373', fontSize: 11, fontFamily: 'monospace' }}
                            tickFormatter={(v) => `${v.toFixed(0)}`}
                            axisLine={false}
                            tickLine={false}
                            dx={-10}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={1} stroke="#ef4444" strokeDasharray="4 4" opacity={0.6} />
                        <ReferenceLine y={5} stroke="#f59e0b" strokeDasharray="4 4" opacity={0.4} />
                        <Area
                            type="monotone"
                            dataKey="distance_km"
                            stroke="#0ea5e9"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#distGradient)"
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
