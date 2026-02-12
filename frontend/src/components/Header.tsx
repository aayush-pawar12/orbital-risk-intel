'use client';

import { Satellite as SatIcon, Shield } from 'lucide-react';

export default function Header() {
    return (
        <header style={{
            background: 'linear-gradient(180deg, rgba(10, 14, 23, 0.98) 0%, rgba(12, 18, 32, 0.95) 100%)',
            borderBottom: '1px solid var(--border-primary)',
            padding: '1rem 1.5rem',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            backdropFilter: 'blur(12px)',
        }}>
            <div style={{
                maxWidth: '1600px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Shield size={22} color="#fff" />
                    </div>
                    <div>
                        <h1 style={{
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            margin: 0,
                            letterSpacing: '0.03em',
                            color: 'var(--text-primary)',
                        }}>
                            ORIS
                        </h1>
                        <p style={{
                            fontSize: '0.6rem',
                            fontWeight: 600,
                            margin: 0,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'var(--text-muted)',
                        }}>
                            Orbital Risk Intelligence System
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ textAlign: 'right' }}>
                        <p className="label" style={{ margin: 0, marginBottom: '2px' }}>PROPAGATION MODEL</p>
                        <p className="mono" style={{ margin: 0, fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                            SGP4 / SDP4 — Skyfield
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p className="label" style={{ margin: 0, marginBottom: '2px' }}>COORDINATE FRAME</p>
                        <p className="mono" style={{ margin: 0, fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                            GCRS (ECI)
                        </p>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'var(--risk-safe-bg)',
                        border: '1px solid rgba(48, 209, 88, 0.3)',
                    }}>
                        <SatIcon size={14} color="var(--risk-safe)" />
                        <span style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            color: 'var(--risk-safe)',
                        }}>
                            LIVE
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
