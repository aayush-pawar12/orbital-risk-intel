'use client';

import { PredictResponse } from '@/lib/api';
import { TrendingDown, Clock } from 'lucide-react';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';

interface Props {
    prediction: PredictResponse | null;
    loading: boolean;
}

export default function TimelineChart({ prediction, loading }: Props) {
    if (loading) {
        return (
            <div className="card">
                <SectionHeader />
                <div className="skeleton" style={{ height: '280px', marginTop: '1rem' }} />
            </div>
        );
    }

    if (!prediction) {
        return (
            <div className="card">
                <SectionHeader />
                <div style={{
                    textAlign: 'center',
                    padding: '2.5rem 2rem',
                    color: 'var(--text-muted)',
                }}>
                    <TrendingDown size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
                    <p style={{ fontSize: '0.8rem', margin: '0 0 0.75rem', color: 'var(--text-secondary)' }}>
                        Distance timeline not available
                    </p>
                    <p style={{ fontSize: '0.68rem', margin: 0, lineHeight: 1.5 }}>
                        After running a <strong style={{ color: '#8b5cf6' }}>PREDICT TCA</strong>, this chart will display how
                        the separation distance between the two objects changes over time — with
                        <span style={{ color: 'var(--risk-critical)' }}> critical</span> and
                        <span style={{ color: 'var(--risk-warning)' }}> warning</span> threshold lines marked.
                    </p>
                </div>
            </div>
        );
    }

    const chartData = prediction.timeline.map((point, idx) => ({
        time: new Date(point.time_utc).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        distance: point.distance_km,
        risk: point.risk_level,
        fullTime: point.time_utc,
        index: idx,
    }));

    const minDist = prediction.min_distance_km;

    return (
        <div className="card animate-fade-in">
            <SectionHeader />

            <div style={{
                display: 'flex', gap: '1rem', marginTop: '0.75rem', marginBottom: '0.5rem',
            }}>
                <ChipInfo label="WINDOW" value={`${prediction.window_hours}h`} />
                <ChipInfo label="STEP" value={`${prediction.step_minutes}min`} />
                <ChipInfo label="POINTS" value={String(prediction.total_steps)} />
                <ChipInfo label="MODEL" value={prediction.propagation_model} />
            </div>

            <div style={{ height: '260px', marginTop: '0.5rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="distGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
                        <XAxis
                            dataKey="time"
                            tick={{ fill: '#5a6478', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                            axisLine={{ stroke: '#1e2d4a' }}
                            tickLine={{ stroke: '#1e2d4a' }}
                            interval={Math.floor(chartData.length / 6)}
                        />
                        <YAxis
                            tick={{ fill: '#5a6478', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                            axisLine={{ stroke: '#1e2d4a' }}
                            tickLine={{ stroke: '#1e2d4a' }}
                            label={{
                                value: 'Distance (km)',
                                angle: -90,
                                position: 'insideLeft',
                                fill: '#5a6478',
                                fontSize: 10,
                            }}
                        />
                        <Tooltip
                            contentStyle={{
                                background: '#0f1729',
                                border: '1px solid #1e2d4a',
                                borderRadius: '8px',
                                fontFamily: 'JetBrains Mono',
                                fontSize: '0.7rem',
                            }}
                            labelStyle={{ color: '#8b95a8' }}
                            itemStyle={{ color: '#e8ecf4' }}
                            formatter={(value: number) => [`${value.toFixed(2)} km`, 'Distance']}
                        />
                        <ReferenceLine
                            y={1}
                            stroke="#ff2d55"
                            strokeDasharray="4 4"
                            strokeWidth={1}
                            label={{ value: 'CRITICAL 1km', fill: '#ff2d55', fontSize: 9, position: 'right' }}
                        />
                        <ReferenceLine
                            y={5}
                            stroke="#ff9500"
                            strokeDasharray="4 4"
                            strokeWidth={1}
                            label={{ value: 'WARNING 5km', fill: '#ff9500', fontSize: 9, position: 'right' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="distance"
                            stroke="#00d4ff"
                            strokeWidth={2}
                            fill="url(#distGradient)"
                            dot={false}
                            activeDot={{ r: 4, fill: '#00d4ff', stroke: '#0f1729', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function SectionHeader() {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid var(--border-primary)',
        }}>
            <TrendingDown size={14} color="var(--accent-cyan)" />
            <h2 style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                margin: 0,
                color: 'var(--text-secondary)',
            }}>
                DISTANCE TIMELINE — PROPAGATION WINDOW
            </h2>
        </div>
    );
}

function ChipInfo({ label, value }: { label: string; value: string }) {
    return (
        <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: '4px',
            padding: '2px 8px',
            display: 'flex',
            gap: '6px',
            alignItems: 'center',
        }}>
            <span className="label" style={{ fontSize: '0.5rem' }}>{label}</span>
            <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)' }}>{value}</span>
        </div>
    );
}
