'use client';

import { AutoResponse } from '@/lib/api';
import {
    AlertTriangle, Shield, Link2, FileCheck, Zap,
    Hash, Clock, DollarSign, Fuel, ChevronRight,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    autoResponse: AutoResponse | null;
}

export default function EmergencyResponsePanel({ autoResponse }: Props) {
    const [visible, setVisible] = useState(false);
    const [flash, setFlash] = useState(true);

    useEffect(() => {
        if (autoResponse?.auto_response_triggered) {
            setVisible(true);
            setFlash(true);
            const timer = setTimeout(() => setFlash(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [autoResponse]);

    if (!autoResponse || !autoResponse.auto_response_triggered) return null;

    const { blockchain_proof, mitigation, audit_trail } = autoResponse;

    return (
        <div
            className="animate-fade-in"
            style={{
                gridColumn: '1 / -1',
                borderRadius: '12px',
                border: '2px solid var(--risk-critical)',
                background: flash
                    ? 'linear-gradient(135deg, rgba(255,45,85,0.15), rgba(255,45,85,0.05))'
                    : 'var(--risk-critical-bg)',
                padding: '1.25rem',
                position: 'relative',
                overflow: 'hidden',
                animation: flash ? 'pulse-critical 0.5s ease-in-out 3' : undefined,
            }}
        >
            {/* Animated scan line */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, var(--risk-critical), transparent)',
                animation: 'scanline 2s linear infinite',
            }} />

            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '1rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid rgba(255,45,85,0.3)',
            }}>
                <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(255,45,85,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: flash ? 'pulse-critical 1s ease-in-out infinite' : undefined,
                }}>
                    <AlertTriangle size={20} color="var(--risk-critical)" />
                </div>
                <div style={{ flex: 1 }}>
                    <h2 style={{
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        color: 'var(--risk-critical)',
                        margin: 0,
                    }}>
                        🚨 CRITICAL THRESHOLD — AUTOMATED RESPONSE EXECUTED
                    </h2>
                    <p style={{
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        margin: '2px 0 0',
                    }}>
                        Distance &lt; 1 km detected — autonomous response triggered without human intervention
                    </p>
                </div>
                <div style={{
                    padding: '4px 12px',
                    borderRadius: '4px',
                    background: 'rgba(48,209,88,0.15)',
                    border: '1px solid rgba(48,209,88,0.4)',
                    color: '#30d158',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                }}>
                    {autoResponse.response_status}
                </div>
            </div>

            {/* Response Details Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '0.75rem',
            }}>

                {/* Incident Card */}
                <ResponseCard
                    icon={<Zap size={16} />}
                    title="INCIDENT RECORD"
                    color="#ff2d55"
                >
                    <DataRow label="Incident ID" value={autoResponse.incident_id.slice(0, 8) + '...'} mono />
                    <DataRow label="Triggered At" value={new Date(autoResponse.triggered_at).toISOString().replace('T', ' ').slice(0, 19) + ' UTC'} />
                    <DataRow label="Response" value="AUTONOMOUS — NO MANUAL INPUT" highlight />
                </ResponseCard>

                {/* Blockchain Proof Card */}
                <ResponseCard
                    icon={<Link2 size={16} />}
                    title="BLOCKCHAIN AUDIT PROOF"
                    color="#00d4ff"
                >
                    <DataRow label="Block Index" value={`#${blockchain_proof.block_index}`} />
                    <DataRow label="Block Hash" value={blockchain_proof.block_hash.slice(0, 16) + '...'} mono />
                    <DataRow label="Tx Hash" value={blockchain_proof.tx_hash.slice(0, 18) + '...'} mono />
                    <DataRow label="Prev Hash" value={blockchain_proof.prev_hash.slice(0, 16) + '...'} mono />
                    <DataRow
                        label="Verification"
                        value={blockchain_proof.verification}
                        highlight
                        highlightColor="#30d158"
                    />
                </ResponseCard>

                {/* Mitigation Contract Card */}
                <ResponseCard
                    icon={<FileCheck size={16} />}
                    title="MITIGATION CONTRACT"
                    color="#ff9500"
                >
                    <DataRow label="Contract ID" value={mitigation.contract_id} mono />
                    <DataRow label="Type" value={mitigation.type.replace(/_/g, ' ')} />
                    <DataRow label="Status" value={mitigation.status} highlight highlightColor="#30d158" />
                    <DataRow label="Δv Required" value={`${mitigation.parameters.delta_v_required_m_s} m/s`} />
                    <DataRow label="Maneuver Window" value={`${mitigation.parameters.maneuver_window_minutes} min`} />
                    <DataRow label="Fuel Cost" value={`${mitigation.parameters.fuel_cost_kg} kg`} />
                </ResponseCard>

                {/* Insurance + Audit Card */}
                <ResponseCard
                    icon={<Shield size={16} />}
                    title="INSURANCE & AUDIT TRAIL"
                    color="#8b5cf6"
                >
                    <DataRow label="Policy ID" value={mitigation.insurance_claim.policy_id} mono />
                    <DataRow
                        label="Coverage"
                        value={mitigation.insurance_claim.coverage_triggered ? 'TRIGGERED' : 'NOT TRIGGERED'}
                        highlight
                        highlightColor={mitigation.insurance_claim.coverage_triggered ? '#ff9500' : '#30d158'}
                    />
                    <DataRow
                        label="Est. Cost"
                        value={`$${mitigation.insurance_claim.estimated_cost_usd.toLocaleString()}`}
                    />
                    <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid var(--border-primary)' }}>
                        <DataRow label="Total Incidents" value={String(audit_trail.total_incidents)} />
                        <DataRow label="Audit Entries" value={String(audit_trail.total_audit_entries)} />
                        <DataRow
                            label="Chain Integrity"
                            value={audit_trail.chain_integrity}
                            highlight
                            highlightColor="#30d158"
                        />
                    </div>
                </ResponseCard>
            </div>

            {/* USP Footer */}
            <div style={{
                marginTop: '0.75rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                background: 'rgba(255,45,85,0.08)',
                border: '1px solid rgba(255,45,85,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
            }}>
                <ChevronRight size={14} color="var(--risk-critical)" />
                <p style={{
                    margin: 0,
                    fontSize: '0.65rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.4,
                }}>
                    <strong style={{ color: 'var(--risk-critical)' }}>CORE USP:</strong>{' '}
                    Existing systems <em>detect</em> threats. ORIS <em>detects and autonomously executes response</em> —
                    incident logging, blockchain audit recording, and mitigation workflow — all without human intervention.
                </p>
            </div>

            {/* CSS Animations */}
            <style>{`
        @keyframes pulse-critical {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes scanline {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
        </div>
    );
}

function ResponseCard({ icon, title, color, children }: {
    icon: React.ReactNode;
    title: string;
    color: string;
    children: React.ReactNode;
}) {
    return (
        <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: '8px',
            border: '1px solid var(--border-primary)',
            padding: '0.75rem',
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '0.5rem',
                paddingBottom: '0.4rem',
                borderBottom: '1px solid var(--border-primary)',
            }}>
                <div style={{ color }}>{icon}</div>
                <span style={{
                    fontSize: '0.58rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: 'var(--text-secondary)',
                }}>
                    {title}
                </span>
            </div>
            {children}
        </div>
    );
}

function DataRow({ label, value, mono, highlight, highlightColor }: {
    label: string;
    value: string;
    mono?: boolean;
    highlight?: boolean;
    highlightColor?: string;
}) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '2px 0',
        }}>
            <span style={{
                fontSize: '0.58rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
            }}>
                {label}
            </span>
            <span
                className={mono ? 'mono' : undefined}
                style={{
                    fontSize: '0.62rem',
                    color: highlight ? (highlightColor || '#30d158') : 'var(--text-primary)',
                    fontWeight: highlight ? 700 : 400,
                    ...(highlight ? {
                        padding: '1px 6px',
                        borderRadius: '3px',
                        background: `${highlightColor || '#30d158'}15`,
                    } : {}),
                }}
            >
                {value}
            </span>
        </div>
    );
}
