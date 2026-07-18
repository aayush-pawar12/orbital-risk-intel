'use client';

import { Satellite as SatIcon } from 'lucide-react';

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
            <div className="rounded-xl overflow-hidden border border-white/10 h-[450px] relative bg-neutral-900">
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
        </div>
    );
}
