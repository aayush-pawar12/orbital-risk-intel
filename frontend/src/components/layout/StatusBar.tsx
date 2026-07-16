'use client';

import { SystemStatus } from '@/lib/api';
import { Database, Clock, Cpu } from 'lucide-react';

interface Props {
    status: SystemStatus | null;
    apiOnline: boolean;
}

export default function StatusBar({ status, apiOnline }: Props) {
    return (
        <div style={{
            borderBottom: '1px solid var(--border-primary)',
            background: 'var(--bg-secondary)',
            padding: '0.5rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            flexWrap: 'wrap',
        }}>
            {/* Left: Status indicators */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <StatusItem
                    icon={<div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: apiOnline ? 'var(--risk-safe)' : 'var(--risk-critical)',
                    }} className={apiOnline ? 'pulse-dot' : ''} />}
                    label="API STATUS"
                    value={apiOnline ? 'CONNECTED' : 'OFFLINE'}
                    color={apiOnline ? 'var(--risk-safe)' : 'var(--risk-critical)'}
                />
                <StatusItem
                    icon={<Database size={12} color="var(--text-muted)" />}
                    label="OBJECTS TRACKED"
                    value={status ? `${status.satellite_count} SAT / ${status.debris_count} DEB` : '—'}
                />
                <StatusItem
                    icon={<Cpu size={12} color="var(--text-muted)" />}
                    label="TLE RECORDS"
                    value={status ? `${status.tle_record_count}` : '—'}
                />
            </div>

            {/* Right: Last TLE update */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <StatusItem
                    icon={<Clock size={12} color="var(--text-muted)" />}
                    label="LAST TLE UPDATE"
                    value={status?.last_tle_update
                        ? new Date(status.last_tle_update).toLocaleString('en-US', {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit',
                            hour12: false, timeZoneName: 'short',
                        })
                        : 'PENDING'
                    }
                />
            </div>
        </div>
    );
}

function StatusItem({ icon, label, value, color }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    color?: string;
}) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {icon}
            <div>
                <p className="label" style={{ margin: 0, fontSize: '0.55rem' }}>{label}</p>
                <p className="mono" style={{
                    margin: 0, fontSize: '0.7rem',
                    color: color || 'var(--text-secondary)',
                }}>
                    {value}
                </p>
            </div>
        </div>
    );
}
