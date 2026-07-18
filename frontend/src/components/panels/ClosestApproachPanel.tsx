'use client';

import { PredictResponse } from '@/lib/api';
import { Target, ShieldCheck, ShieldAlert } from 'lucide-react';

interface Props {
    prediction: PredictResponse | null;
    loading: boolean;
}

export default function ClosestApproachPanel({ prediction, loading }: Props) {
    if (loading) {
        return (
            <div className="bg-neutral-950/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-[400px]">
                <h3 className="text-sm font-semibold text-neutral-100 mb-6">Prediction Summary</h3>
                <div className="flex flex-col gap-4">
                    <div className="bg-neutral-800/50 animate-pulse rounded-lg h-[80px]" />
                    <div className="bg-neutral-800/50 animate-pulse rounded-lg h-[120px]" />
                </div>
            </div>
        );
    }

    if (!prediction) {
        return (
            <div className="bg-neutral-950/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-[400px] flex flex-col">
                <h3 className="text-sm font-semibold text-neutral-100 mb-6">Prediction Summary</h3>
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <Target size={24} className="mb-4 text-neutral-600" />
                    <p className="text-sm text-neutral-500">
                        No prediction computed.<br/>
                        Click <strong>Predict TCA</strong> to evaluate a 24-hour window.
                    </p>
                </div>
            </div>
        );
    }

    const { min_distance_km, predicted_risk: risk_level } = prediction;
    const isCritical = risk_level === 'CRITICAL';
    const isWarning = risk_level === 'WARNING';
    
    const riskBorder = isCritical ? 'border-rose-900' : (isWarning ? 'border-amber-900/50' : 'border-emerald-900/50');
    const riskBg = isCritical ? 'bg-rose-950/30' : (isWarning ? 'bg-amber-950/20' : 'bg-emerald-950/20');
    const riskText = isCritical ? 'text-rose-500' : (isWarning ? 'text-amber-500' : 'text-emerald-500');

    const tcaDate = new Date(prediction.tca_utc);
    const confidence = prediction.confidence_level;

    return (
        <div className="bg-neutral-950/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 min-h-[400px] h-full flex flex-col overflow-y-auto">
            <h3 className="text-sm font-semibold text-neutral-100 mb-6 shrink-0">Prediction Summary</h3>

            <div className={`rounded-xl p-5 border ${riskBorder} ${riskBg} flex flex-col items-center justify-center text-center mb-6 shrink-0`}>
                <p className="text-xs text-neutral-400 font-medium mb-1">
                    Closest Approach Distance
                </p>
                <div className={`text-4xl font-mono ${riskText} mb-3`}>
                    {min_distance_km.toFixed(2)}
                    <span className="text-sm text-neutral-500 ml-1 font-sans">km</span>
                </div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold uppercase ${riskText} bg-black/20`}>
                    {risk_level === 'SAFE' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                    {risk_level} RISK
                </div>
            </div>

            <div className="grid grid-cols-2 gap-px bg-neutral-800 rounded-lg overflow-hidden border border-white/10 shrink-0">
                <div className="col-span-2 bg-neutral-950/40 backdrop-blur-xl p-3 flex flex-col justify-center">
                    <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold mb-1">Time of Closest Approach (UTC)</span>
                    <span className="text-sm font-mono text-neutral-200">{tcaDate.toISOString().replace('T', ' ').slice(0, 19)}</span>
                </div>
                <MetricCard label="Confidence" value={confidence} />
                <MetricCard label="Window" value={`${prediction.window_hours}h / ${prediction.step_minutes}m`} />
                <MetricCard label="Total Steps" value={prediction.total_steps.toString()} />
                <MetricCard label="Model" value={prediction.propagation_model} />
            </div>
        </div>
    );
}

function MetricCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-neutral-950/40 backdrop-blur-xl p-3 flex flex-col justify-center">
            <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold mb-1">{label}</span>
            <span className="text-xs font-mono text-neutral-300">{value}</span>
        </div>
    );
}
