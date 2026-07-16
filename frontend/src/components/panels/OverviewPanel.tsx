'use client';

import { Satellite, DebrisObj } from '@/lib/api';
import { Satellite as SatIcon, Trash2, Radio, Globe2 } from 'lucide-react';

interface Props {
    satellite: Satellite | null;
    debris: DebrisObj | null;
    loading: boolean;
}

export default function OverviewPanel({ satellite, debris, loading }: Props) {
    if (loading) {
        return (
            <div className="card">
                <PanelHeader title="OBJECT OVERVIEW" icon="overview" />
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <div className="skeleton" style={{ height: '140px', flex: 1 }} />
                    <div className="skeleton" style={{ height: '140px', flex: 1 }} />
                </div>
            </div>
        );
    }

    return (
        <div className="card animate-fade-in">
            <PanelHeader title="OBJECT OVERVIEW" icon="overview" />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                {/* Satellite Card */}
                <div style={{
                    flex: 1,
                    background: 'var(--bg-secondary)',
                    borderRadius: '10px',
                    padding: '1rem',
                    border: '1px solid var(--border-primary)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                        <SatIcon size={16} color="var(--accent-cyan)" />
                        <span className="label" style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)' }}>
                            SATELLITE
                        </span>
                    </div>
                    {satellite ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <InfoRow label="NAME" value={satellite.name} />
                            <InfoRow label="NORAD ID" value={String(satellite.norad_id)} highlight />
                            <InfoRow label="OPERATOR" value={satellite.operator} />
                            <InfoRow label="ORBIT" value={satellite.orbit_type} />
                            <InfoRow label="TLE EPOCH" value={
                                satellite.latest_tle_epoch
                                    ? new Date(satellite.latest_tle_epoch).toISOString().slice(0, 19) + 'Z'
                                    : 'NO TLE'
                            } />
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No satellite selected</p>
                    )}
                </div>

                {/* Debris Card */}
                <div style={{
                    flex: 1,
                    background: 'var(--bg-secondary)',
                    borderRadius: '10px',
                    padding: '1rem',
                    border: '1px solid var(--border-primary)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                        <Trash2 size={16} color="var(--risk-warning)" />
                        <span className="label" style={{ fontSize: '0.65rem', color: 'var(--risk-warning)' }}>
                            DEBRIS
                        </span>
                    </div>
                    {debris ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <InfoRow label="NAME" value={debris.name} />
                            <InfoRow label="NORAD ID" value={String(debris.norad_id)} highlight />
                            <InfoRow label="SOURCE" value={debris.source} />
                            <InfoRow label="ORBIT" value={debris.orbit_type} />
                            <InfoRow label="TLE EPOCH" value={
                                debris.latest_tle_epoch
                                    ? new Date(debris.latest_tle_epoch).toISOString().slice(0, 19) + 'Z'
                                    : 'NO TLE'
                            } />
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No debris selected</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function PanelHeader({ title, icon }: { title: string; icon: string }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid var(--border-primary)',
        }}>
            <Globe2 size={14} color="var(--accent-cyan)" />
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

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="label" style={{ fontSize: '0.6rem' }}>{label}</span>
            <span className="mono" style={{
                fontSize: '0.72rem',
                color: highlight ? 'var(--accent-cyan)' : 'var(--text-primary)',
            }}>
                {value}
            </span>
        </div>
    );
}
