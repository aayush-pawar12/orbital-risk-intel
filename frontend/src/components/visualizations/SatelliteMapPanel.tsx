'use client';

import { Satellite as SatIcon, ExternalLink, Globe, Radio, Map } from 'lucide-react';

interface Props {
    noradId?: number;
}

export default function SatelliteMapPanel({ noradId }: Props) {
    return (
        <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--border-primary)',
                marginBottom: '0.75rem',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <SatIcon size={14} color="var(--accent-cyan)" />
                    <h2 style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        margin: 0,
                        color: 'var(--text-secondary)',
                    }}>
                        LIVE SATELLITE TRACKING — EXTERNAL RESOURCES
                    </h2>
                </div>
            </div>

            {/* Tracking resource cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '0.75rem',
                marginBottom: '0.75rem',
            }}>
                <TrackingCard
                    icon={<Globe size={24} />}
                    name="SatelliteMap.space"
                    desc="Real-time 3D WebGL satellite tracker — Starlink, GPS, and all constellations with orbital decay tracking"
                    url="https://satellitemap.space/"
                    color="#00d4ff"
                />
                <TrackingCard
                    icon={<Radio size={24} />}
                    name="N2YO Live Tracker"
                    desc="Track any satellite by NORAD ID — real-time ground track, pass predictions, and visibility windows"
                    url={noradId ? `https://www.n2yo.com/satellite/?s=${noradId}` : 'https://www.n2yo.com/'}
                    color="#30d158"
                    badge={noradId ? `NORAD ${noradId}` : undefined}
                />
                <TrackingCard
                    icon={<Map size={24} />}
                    name="Celestrak Orbit Viewer"
                    desc="Official NORAD/Celestrak orbit visualization — the same source our TLE data comes from"
                    url="https://celestrak.org/cesium/orbit-viz3d.php"
                    color="#ff9500"
                />
            </div>

            {/* Embedded N2YO widget — this one allows iframe embedding */}
            <div style={{
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1px solid var(--border-primary)',
                height: '380px',
                position: 'relative',
                background: '#000',
            }}>
                <iframe
                    src={`https://www.n2yo.com/widgets/widget-tracker.php?s=${noradId || 25544}&size=large&num=3&colors=000000,00d4ff,00d4ff,ff2d55,fff`}
                    title="Satellite Live Tracker"
                    width="100%"
                    height="100%"
                    style={{ border: 'none', display: 'block' }}
                    loading="lazy"
                    allow="accelerometer; gyroscope"
                />
            </div>

            <p style={{
                margin: '0.5rem 0 0',
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                textAlign: 'center',
            }}>
                Live ground track for {noradId ? `NORAD ${noradId}` : 'ISS (NORAD 25544)'} via N2YO.
                Select a different satellite above to update the tracking view.
            </p>
        </div>
    );
}

function TrackingCard({ icon, name, desc, url, color, badge }: {
    icon: React.ReactNode;
    name: string;
    desc: string;
    url: string;
    color: string;
    badge?: string;
}) {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-primary)',
                borderRadius: '10px',
                padding: '1rem',
                textDecoration: 'none',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = color;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 4px 20px ${color}20`;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-primary)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: `${color}15`,
                border: `1px solid ${color}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color,
                flexShrink: 0,
            }}>
                {icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                    }}>
                        {name}
                    </span>
                    <ExternalLink size={11} color="var(--text-muted)" />
                    {badge && (
                        <span className="mono" style={{
                            fontSize: '0.55rem',
                            padding: '1px 6px',
                            borderRadius: '3px',
                            background: `${color}20`,
                            color: color,
                            border: `1px solid ${color}40`,
                        }}>
                            {badge}
                        </span>
                    )}
                </div>
                <p style={{
                    fontSize: '0.65rem',
                    color: 'var(--text-muted)',
                    margin: 0,
                    lineHeight: 1.4,
                }}>
                    {desc}
                </p>
            </div>
        </a>
    );
}
