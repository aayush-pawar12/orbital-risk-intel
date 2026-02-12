'use client';

import { AssessResponse } from '@/lib/api';
import { AlertTriangle, ShieldCheck, ShieldAlert, Activity } from 'lucide-react';

interface Props {
    assessment: AssessResponse | null;
    loading: boolean;
}

export default function RiskPanel({ assessment, loading }: Props) {
    if (loading) {
        return (
            <div className="card">
                <SectionHeader title="REAL-TIME RISK ASSESSMENT" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                    <div className="skeleton" style={{ height: '80px' }} />
                    <div className="skeleton" style={{ height: '60px' }} />
                </div>
            </div>
        );
    }

    if (!assessment) {
        return (
            <div className="card">
                <SectionHeader title="REAL-TIME RISK ASSESSMENT" />
                <div style={{
                    marginTop: '1.5rem',
                    textAlign: 'center',
                    padding: '1.5rem',
                    color: 'var(--text-muted)',
                }}>
                    <Activity size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
                    <p style={{ fontSize: '0.8rem', margin: '0 0 0.75rem', color: 'var(--text-secondary)' }}>
                        No assessment running
                    </p>
                    <p style={{ fontSize: '0.68rem', margin: 0, lineHeight: 1.5 }}>
                        Click <strong style={{ color: 'var(--accent-cyan)' }}>RUN ASSESSMENT</strong> to compute the real-time
                        Euclidean separation distance between the selected satellite and debris using SGP4 orbital propagation.
                    </p>
                    <div style={{
                        marginTop: '0.75rem',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        fontSize: '0.6rem',
                    }}>
                        <span style={{ color: 'var(--risk-critical)' }}>● CRITICAL &lt; 1 km</span>
                        <span style={{ color: 'var(--risk-warning)' }}>● WARNING 1–5 km</span>
                        <span style={{ color: 'var(--risk-safe)' }}>● SAFE &gt; 5 km</span>
                    </div>
                </div>
            </div>
        );
    }

    const { risk } = assessment;
    const riskColor = risk.risk_level === 'CRITICAL' ? 'var(--risk-critical)'
        : risk.risk_level === 'WARNING' ? 'var(--risk-warning)' : 'var(--risk-safe)';
    const riskBg = risk.risk_level === 'CRITICAL' ? 'var(--risk-critical-bg)'
        : risk.risk_level === 'WARNING' ? 'var(--risk-warning-bg)' : 'var(--risk-safe-bg)';
    const RiskIcon = risk.risk_level === 'SAFE' ? ShieldCheck : ShieldAlert;

    return (
        <div className="card animate-fade-in" style={{
            borderColor: risk.risk_level === 'CRITICAL' ? 'rgba(255, 45, 85, 0.4)' : undefined,
        }}>
            <SectionHeader title="REAL-TIME RISK ASSESSMENT" />

            {/* Big risk display */}
            <div style={{
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '16px',
                    background: riskBg,
                    border: `2px solid ${riskColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }} className={risk.risk_level === 'CRITICAL' ? 'pulse-critical' : ''}>
                    <RiskIcon size={36} color={riskColor} />
                </div>

                <div style={{ flex: 1 }}>
                    <div className={`risk-badge risk-${risk.risk_level.toLowerCase()}`} style={{ marginBottom: '0.5rem' }}>
                        <span style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: riskColor, display: 'inline-block',
                        }} />
                        {risk.risk_level}
                    </div>
                    <div className="value-large" style={{ color: riskColor }}>
                        {risk.distance_km.toFixed(2)}
                        <span style={{ fontSize: '0.8rem', fontWeight: 400, marginLeft: '4px', color: 'var(--text-muted)' }}>km</span>
                    </div>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                        SEPARATION DISTANCE · EUCLIDEAN · GCRS
                    </p>
                </div>
            </div>

            {/* Metadata */}
            <div style={{
                marginTop: '1rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
            }}>
                <MetaItem label="TIMESTAMP" value={new Date(assessment.timestamp).toISOString().slice(11, 23) + 'Z'} />
                <MetaItem label="THRESHOLD" value={`${risk.threshold_used} km`} />
                <MetaItem label="MODEL" value={assessment.propagation_model} />
                <MetaItem label="FRAME" value={assessment.coordinate_frame} />
            </div>
        </div>
    );
}

function SectionHeader({ title }: { title: string }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid var(--border-primary)',
        }}>
            <AlertTriangle size={14} color="var(--accent-cyan)" />
            <h2 style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                margin: 0,
                color: 'var(--text-secondary)',
            }}>
                {title}
            </h2>
        </div>
    );
}

function MetaItem({ label, value }: { label: string; value: string }) {
    return (
        <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: '6px',
            padding: '0.4rem 0.6rem',
            border: '1px solid var(--border-primary)',
        }}>
            <p className="label" style={{ margin: 0, fontSize: '0.55rem' }}>{label}</p>
            <p className="mono" style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-primary)' }}>{value}</p>
        </div>
    );
}
