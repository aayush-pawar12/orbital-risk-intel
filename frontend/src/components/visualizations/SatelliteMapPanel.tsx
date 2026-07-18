'use client';

import { ExternalLink, Globe, Radio, Map, Satellite as SatIcon } from 'lucide-react';

interface Props {
    noradId?: number;
}

export default function SatelliteMapPanel({ noradId }: Props) {
    return (
        <div className="bg-neutral-950/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6" style={{ gridColumn: '1 / -1' }}>
            <div className="flex items-center gap-2 mb-6">
                <SatIcon size={16} className="text-neutral-500" />
                <h3 className="m-0 text-xs font-semibold tracking-wider text-neutral-300 uppercase">
                    Live Tracking Hub
                </h3>
            </div>

            {/* Embedded N2YO widget */}
            <div className="rounded-xl overflow-hidden border border-white/10 h-[450px] relative bg-neutral-900 mb-6">
                <iframe
                    src={`https://www.n2yo.com/widgets/widget-tracker.php?s=${noradId || 25544}&size=large&num=3&colors=000000,10b981,10b981,f43f5e,fff`}
                    title="Satellite Live Tracker"
                    width="100%"
                    height="100%"
                    className="border-none block"
                    loading="lazy"
                    allow="accelerometer; gyroscope"
                />
            </div>

            {/* Tracking resource cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TrackingCard
                    icon={<Globe size={18} />}
                    name="SatelliteMap.space"
                    desc="3D WebGL satellite tracker"
                    url="https://satellitemap.space/"
                />
                <TrackingCard
                    icon={<Radio size={18} />}
                    name="N2YO Tracker"
                    desc="Real-time ground track predictions"
                    url={noradId ? `https://www.n2yo.com/satellite/?s=${noradId}` : 'https://www.n2yo.com/'}
                />
                <TrackingCard
                    icon={<Map size={18} />}
                    name="Celestrak Viz"
                    desc="Official NORAD/Celestrak orbit viewer"
                    url="https://celestrak.org/cesium/orbit-viz3d.php"
                />
            </div>
        </div>
    );
}

function TrackingCard({ icon, name, desc, url }: {
    icon: React.ReactNode;
    name: string;
    desc: string;
    url: string;
}) {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-neutral-900 border border-white/10 hover:border-neutral-700 rounded-lg p-3 flex items-center justify-between transition-colors"
        >
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-neutral-200 transition-colors">
                    {icon}
                </div>
                <div>
                    <h4 className="text-xs font-semibold text-neutral-200 group-hover:text-white transition-colors">{name}</h4>
                    <p className="text-[10px] text-neutral-500 m-0">{desc}</p>
                </div>
            </div>
            <div className="text-neutral-600 group-hover:text-emerald-500 transition-colors">
                <ExternalLink size={14} />
            </div>
        </a>
    );
}
