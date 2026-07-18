'use client';

import { AssessResponse } from '@/lib/api';
import { Globe2 } from 'lucide-react';

interface Props {
    assessment: AssessResponse | null;
}

export default function GlobePanel({ assessment }: Props) {
    return (
        <div className="bg-neutral-950/40 backdrop-blur-xl border border-white/10 rounded-2xl p-0 relative overflow-hidden flex flex-col h-[600px] group">
            <div className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-neutral-950/80 px-3 py-2 rounded-lg border border-white/10 shadow-lg">
                <Globe2 size={16} className="text-emerald-500" />
                <h3 className="m-0 text-xs font-semibold tracking-wider text-neutral-200 uppercase">
                    Live 3D Trajectory
                </h3>
            </div>

            <div className="flex-1 w-full h-full bg-neutral-950/40 backdrop-blur-xl">
                <iframe 
                    src="https://satellitemap.space/" 
                    width="100%" 
                    height="100%" 
                    className="border-none bg-neutral-950" 
                    title="Live Satellite Map"
                    allow="accelerometer; gyroscope"
                    loading="lazy"
                />
            </div>
        </div>
    );
}
