'use client';

import { AssessResponse } from '@/lib/api';
import { ShieldCheck, ShieldAlert, Activity } from 'lucide-react';

interface Props {
    assessment: AssessResponse | null;
    loading: boolean;
}

export default function RiskPanel({ assessment, loading }: Props) {
    if (loading) {
        return (
            <div className="bg-neutral-950/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-neutral-100 mb-6">Real-Time Risk Assessment</h3>
                <div className="flex flex-col gap-4">
                    <div className="bg-neutral-800/50 animate-pulse rounded-lg h-[80px] border border-neutral-700/50" />
                    <div className="bg-neutral-800/50 animate-pulse rounded-lg h-[60px] border border-neutral-700/50" />
                </div>
            </div>
        );
    }

    if (!assessment) {
        return (
            <div className="bg-neutral-950/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full flex flex-col">
                <h3 className="text-sm font-semibold text-neutral-100 mb-6">Real-Time Risk Assessment</h3>
                <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 py-10">
                    <Activity size={24} className="mb-4 text-neutral-600" />
                    <p className="text-sm text-center">
                        No assessment running.<br />
                        Select two objects and click <strong>Run Assessment</strong>.
                    </p>
                </div>
            </div>
        );
    }

    const { risk } = assessment;
    
    // Map risk levels
    const isCritical = risk.risk_level === 'CRITICAL';
    const isWarning = risk.risk_level === 'WARNING';
    
    const riskBorder = isCritical ? 'border-rose-900' : (isWarning ? 'border-amber-900/50' : 'border-emerald-900/50');
    const riskBg = isCritical ? 'bg-rose-950/30' : (isWarning ? 'bg-amber-950/20' : 'bg-emerald-950/20');
    const riskText = isCritical ? 'text-rose-500' : (isWarning ? 'text-amber-500' : 'text-emerald-500');
    const RiskIcon = risk.risk_level === 'SAFE' ? ShieldCheck : ShieldAlert;

    return (
        <div className="bg-neutral-950/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full flex flex-col">
            <h3 className="text-sm font-semibold text-neutral-100 mb-6">Real-Time Risk Assessment</h3>

            {/* Big risk display */}
            <div className={`mt-2 mb-6 p-6 rounded-xl border ${riskBg} ${riskBorder} flex items-center gap-6`}>
                <div className="shrink-0">
                    <RiskIcon size={40} className={riskText} />
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`w-2 h-2 rounded-full ${isCritical ? 'bg-rose-500' : (isWarning ? 'bg-amber-500' : 'bg-emerald-500')} ${isCritical ? 'animate-pulse' : ''}`} />
                        <span className={`text-xs font-semibold tracking-widest uppercase ${riskText}`}>
                            {risk.risk_level}
                        </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <div className={`text-5xl font-mono tracking-tighter ${riskText}`}>
                            {risk.distance_km.toFixed(2)}
                        </div>
                        <span className="text-sm font-medium text-neutral-400">km</span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-2 font-medium">
                        Euclidean Separation Distance
                    </p>
                </div>
            </div>

            {/* Metadata Table */}
            <div className="mt-auto grid grid-cols-2 gap-px bg-neutral-800 rounded-lg overflow-hidden border border-white/10">
                <MetaItem label="Timestamp" value={new Date(assessment.timestamp).toISOString().slice(11, 23) + 'Z'} />
                <MetaItem label="Threshold" value={`${risk.threshold_used} km`} />
                <MetaItem label="Model" value={assessment.propagation_model} />
                <MetaItem label="Frame" value={assessment.coordinate_frame} />
            </div>
        </div>
    );
}

function MetaItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-neutral-950/40 backdrop-blur-xl p-3 flex flex-col justify-center">
            <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold mb-1">{label}</span>
            <span className="text-xs font-mono text-neutral-300">{value}</span>
        </div>
    );
}
