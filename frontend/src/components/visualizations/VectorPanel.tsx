'use client';

import { AssessResponse } from '@/lib/api';
import { Crosshair, ArrowUpRight } from 'lucide-react';

interface Props {
    assessment: AssessResponse | null;
}

export default function VectorPanel({ assessment }: Props) {
    if (!assessment) {
        return (
            <div className="card">
                <SectionHeader />
                <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                }}>
                    Run an assessment to view position &amp; velocity vectors
                </div>
            </div>
        );
    }

    const sp = assessment.satellite_position;
    const dp = assessment.debris_position;
    const sv = assessment.satellite_velocity;
    const dv = assessment.debris_velocity;

    return (
        <div className="card animate-fade-in">
            <SectionHeader />

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                {/* Satellite vectors */}
                <div style={{ flex: 1 }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        marginBottom: '0.5rem',
                    }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-cyan)' }} />
                        <span className="label" style={{ fontSize: '0.6rem', color: 'var(--accent-cyan)' }}>
                            SATELLITE — {assessment.satellite_name}
                        </span>
                    </div>

                    <VectorGroup title="POSITION (GCRS)" unit="km"
                        values={[
                            { axis: 'X', val: sp.x_km },
                            { axis: 'Y', val: sp.y_km },
                            { axis: 'Z', val: sp.z_km },
                        ]}
                    />
                    <VectorGroup title="VELOCITY" unit="km/s"
                        values={[
                            { axis: 'Vx', val: sv.vx_km_s },
                            { axis: 'Vy', val: sv.vy_km_s },
                            { axis: 'Vz', val: sv.vz_km_s },
                        ]}
                        extra={`|V| = ${sv.magnitude_km_s.toFixed(4)} km/s`}
                    />
                </div>

                {/* Debris vectors */}
                <div style={{ flex: 1 }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        marginBottom: '0.5rem',
                    }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--risk-warning)' }} />
                        <span className="label" style={{ fontSize: '0.6rem', color: 'var(--risk-warning)' }}>
                            DEBRIS — {assessment.debris_name}
                        </span>
                    </div>

                    <VectorGroup title="POSITION (GCRS)" unit="km"
                        values={[
                            { axis: 'X', val: dp.x_km },
                            { axis: 'Y', val: dp.y_km },
                            { axis: 'Z', val: dp.z_km },
                        ]}
                    />
                    <VectorGroup title="VELOCITY" unit="km/s"
                        values={[
                            { axis: 'Vx', val: dv.vx_km_s },
                            { axis: 'Vy', val: dv.vy_km_s },
                            { axis: 'Vz', val: dv.vz_km_s },
                        ]}
                        extra={`|V| = ${dv.magnitude_km_s.toFixed(4)} km/s`}
                    />
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
            <Crosshair size={14} color="var(--accent-cyan)" />
            <h2 style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                margin: 0,
                color: 'var(--text-secondary)',
            }}>
                STATE VECTORS
            </h2>
            <span className="mono" style={{
                marginLeft: 'auto',
                fontSize: '0.55rem',
                color: 'var(--text-muted)',
            }}>
                GCRS / ECI FRAME
            </span>
        </div>
    );
}

function VectorGroup({ title, unit, values, extra }: {
    title: string;
    unit: string;
    values: { axis: string; val: number }[];
    extra?: string;
}) {
    return (
        <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: '8px',
            padding: '0.6rem',
            marginBottom: '0.5rem',
            border: '1px solid var(--border-primary)',
        }}>
            <p className="label" style={{ margin: '0 0 0.35rem', fontSize: '0.55rem' }}>{title}</p>
            {values.map(v => (
                <div key={v.axis} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '2px 0',
                }}>
                    <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        {v.axis}
                    </span>
                    <span className="mono" style={{ fontSize: '0.72rem' }}>
                        {v.val >= 0 ? '+' : ''}{v.val.toFixed(4)} <span style={{ color: 'var(--text-muted)', fontSize: '0.55rem' }}>{unit}</span>
                    </span>
                </div>
            ))}
            {extra && (
                <div style={{
                    marginTop: '4px',
                    paddingTop: '4px',
                    borderTop: '1px solid var(--border-primary)',
                }}>
                    <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)' }}>
                        {extra}
                    </span>
                </div>
            )}
        </div>
    );
}
