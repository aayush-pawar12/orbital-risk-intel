'use client';

import { SystemStatus } from '@/lib/api';

interface Props {
    status: SystemStatus | null;
    apiOnline: boolean;
}

export default function Header({ status, apiOnline }: Props) {
    return (
        <header className="sticky top-0 z-50 bg-[#171717] border-b border-neutral-800 px-6 py-5 flex items-center justify-between text-[11px] uppercase tracking-wider font-mono">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 font-bold text-neutral-200">
                    <span className="text-white">ORIS</span>
                </div>
                
                <div className="h-4 w-px bg-neutral-800" />
                
                <div className="flex items-center gap-2 text-neutral-400">
                    <div className={`w-1.5 h-1.5 rounded-full ${apiOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <span>{apiOnline ? 'API Connected' : 'API Offline'}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 text-neutral-400">
                <span className="text-neutral-500">Updated</span>
                <span className="text-neutral-200">
                    {status?.last_tle_update
                        ? new Date(status.last_tle_update).toLocaleString('en-US', {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                            hour12: false, timeZoneName: 'short',
                        })
                        : '—'
                    }
                </span>
            </div>
        </header>
    );
}
