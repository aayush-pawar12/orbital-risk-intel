'use client';

import { PredictResponse } from '@/lib/api';
import { Target, Clock, TrendingDown, ShieldCheck, ShieldAlert } from 'lucide-react';

interface Props {
    prediction: PredictResponse | null;
    loading: boolean;
}

export default function ClosestApproachPanel({ prediction, loading }: Props) {
    if (loading) {
        return (
            <div className="card">
                <SectionHeader />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                    <div className="skeleton" style={{ height: '60px' }} />
                    <div className="skeleton" style={{ height: '100px' }} />
                </div>
            </div>
        );
    }

    if (!prediction) {
        return (
            <div className="card">
                <SectionHeader />
                <div style={{
                    textAlign: 'center',
                    padding: '1.5rem',
                    color: 'var(--text-muted)',
                }}>
                    <Target size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
                    <p style={{ fontSize: '0.8rem', margin: '0 0 0.75rem', color: 'var(--text-secondary)' }}>
                        No prediction computed
                    </p>
                    <p style={{ fontSize: '0.68rem', margin: 0, lineHeight: 1.5 }}>
                        Click <strong style={{ color: '#8b5cf6' }}>PREDICT TCA</strong> to propagate both orbits over a <strong>24-hour window</strong> at
                        5-minute intervals — the system finds the <em>minimum separation distance</em> and identifies the
                        exact Time of Closest Approach (TCA).
                    </p>
                </div>
            </div>
        );
    }

    const riskColor = prediction.predicted_risk === 'CRITICAL' ? 'var(--risk-critical)'
        : prediction.predicted_risk === 'WARNING' ? 'var(--risk-warning)' : 'var(--risk-safe)';
    const riskBg = prediction.predicted_risk === 'CRITICAL' ? 'var(--risk-critical-bg)'
        : prediction.predicted_risk === 'WARNING' ? 'var(--risk-warning-bg)' : 'var(--risk-safe-bg)';

    const tcaDate = new Date(prediction.tca_utc);
    const confidence = prediction.confidence_level;
    const confColor = confidence === 'HIGH' ? 'var(--risk-safe)'
        : confidence === 'MEDIUM' ? 'var(--risk-warning)' : 'var(--risk-critical)';

    return (
        <div className="card animate-fade-in">
            <SectionHeader />

            {/* TCA display */}
            <div style={{
                marginTop: '1rem',
                background: riskBg,
                border: `1px solid ${riskColor}40`,
                borderRadius: '10px',
                padding: '1rem',
                textAlign: 'center',
            }}>
                <p className="label" style={{ margin: '0 0 0.5rem', color: riskColor }}>
                    PREDICTED MINIMUM DISTANCE
                </p>
                <div className="value-large" style={{ color: riskColor, marginBottom: '0.5rem' }}>
                    {prediction.min_distance_km.toFixed(2)}
                    <span style={{ fontSize: '0.8rem', fontWeight: 400, marginLeft: '4px', color: 'var(--text-muted)' }}>km</span>
                </div>
                <div className={`risk-badge risk-${prediction.predicted_risk.toLowerCase()}`}>
                    {prediction.predicted_risk === 'SAFE' ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                    {prediction.predicted_risk}
                </div>
            </div>

            {/* Details grid */}
            <div style={{
                marginTop: '0.75rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
            }}>
                <DetailCard
                    icon={<Clock size={14} color="var(--accent-cyan)" />}
                    label="TIME OF CLOSEST APPROACH (TCA)"
                    value={tcaDate.toISOString().replace('T', ' ').slice(0, 19) + ' UTC'}
                    wide
                />
                <DetailCard
                    icon={<Target size={14} color="var(--accent-cyan)" />}
                    label="PROPAGATION WINDOW"
                    value={`${prediction.window_hours} hours / ${prediction.step_minutes}-min steps`}
                />
                <DetailCard
                    icon={<TrendingDown size={14} color={confColor} />}
                    label="CONFIDENCE LEVEL"
                    value={confidence}
                    valueColor={confColor}
                />
            </div>

            {/* Objects */}
            <div style={{
                marginTop: '0.75rem',
                background: 'var(--bg-secondary)',
                borderRadius: '8px',
                padding: '0.6rem',
                border: '1px solid var(--border-primary)',
                display: 'flex',
                justifyContent: 'space-between',
            }}>
                <div>
                    <p className="label" style={{ margin: 0, fontSize: '0.5rem' }}>PRIMARY</p>
                    <p className="mono" style={{ margin: 0, fontSize: '0.72rem' }}>{prediction.satellite_name}</p>
                </div>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    color: 'var(--text-muted)',
                    fontSize: '0.7rem',
                }}>→</div>
                <div style={{ textAlign: 'right' }}>
                    <p className="label" style={{ margin: 0, fontSize: '0.5rem' }}>SECONDARY</p>
                    <p className="mono" style={{ margin: 0, fontSize: '0.72rem' }}>{prediction.debris_name}</p>
                </div>
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
            <Target size={14} color="var(--accent-cyan)" />
            <h2 style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                margin: 0,
                color: 'var(--text-secondary)',
            }}>
                CLOSEST APPROACH PREDICTION
            </h2>
        </div>
    );
}

function DetailCard({ icon, label, value, valueColor, wide }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    valueColor?: string;
    wide?: boolean;
}) {
    return (
        <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: '8px',
            padding: '0.5rem 0.6rem',
            border: '1px solid var(--border-primary)',
            gridColumn: wide ? '1 / -1' : undefined,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                {icon}
                <span className="label" style={{ fontSize: '0.5rem' }}>{label}</span>
            </div>
            <p className="mono" style={{
                margin: 0, fontSize: '0.75rem',
                color: valueColor || 'var(--text-primary)',
            }}>
                {value}
            </p>
        </div>
    );
}
