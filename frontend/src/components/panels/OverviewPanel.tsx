'use client';

import { Satellite, DebrisObj } from '@/lib/api';

interface Props {
    satellite: Satellite | null;
    debris: DebrisObj | null;
    loading: boolean;
}

export default function OverviewPanel({ satellite, debris, loading }: Props) {
    if (loading) {
        return (
            <div className="bg-neutral-950/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-neutral-100 mb-6">Object Details</h3>
                <div className="flex flex-col gap-4">
                    <div className="bg-neutral-800/50 animate-pulse rounded-lg h-[160px] border border-neutral-700/50" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-neutral-950/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-neutral-100 mb-6">Object Details</h3>
            <div className="flex flex-col xl:flex-row gap-6">
                {/* Satellite Card */}
                <div className="flex-1 bg-neutral-900 border border-white/10 rounded-xl p-5">
                    <h4 className="text-xs font-semibold tracking-wider uppercase text-neutral-500 mb-4">Primary Satellite</h4>
                    {satellite ? (
                        <div className="flex flex-col divide-y divide-neutral-800/50">
                            <InfoRow label="Name" value={satellite.name} />
                            <InfoRow label="NORAD ID" value={String(satellite.norad_id)} valueClass="text-emerald-400 font-mono" />
                            <InfoRow label="Operator" value={satellite.operator} />
                            <InfoRow label="Orbit" value={satellite.orbit_type} />
                            <InfoRow label="TLE Epoch" value={
                                satellite.latest_tle_epoch
                                    ? new Date(satellite.latest_tle_epoch).toISOString().slice(0, 19) + 'Z'
                                    : 'N/A'
                            } valueClass="font-mono text-neutral-400" />
                        </div>
                    ) : (
                        <div className="py-8 text-center text-sm text-neutral-500">
                            Select a primary object to view details
                        </div>
                    )}
                </div>

                {/* Debris Card */}
                <div className="flex-1 bg-neutral-900 border border-white/10 rounded-xl p-5">
                    <h4 className="text-xs font-semibold tracking-wider uppercase text-neutral-500 mb-4">Secondary Object</h4>
                    {debris ? (
                        <div className="flex flex-col divide-y divide-neutral-800/50">
                            <InfoRow label="Name" value={debris.name} />
                            <InfoRow label="NORAD ID" value={String(debris.norad_id)} valueClass="text-amber-400 font-mono" />
                            <InfoRow label="Source" value={debris.source} />
                            <InfoRow label="Orbit" value={debris.orbit_type} />
                            <InfoRow label="TLE Epoch" value={
                                debris.latest_tle_epoch
                                    ? new Date(debris.latest_tle_epoch).toISOString().slice(0, 19) + 'Z'
                                    : 'N/A'
                            } valueClass="font-mono text-neutral-400" />
                        </div>
                    ) : (
                        <div className="py-8 text-center text-sm text-neutral-500">
                            Select a secondary object to view details
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function InfoRow({ label, value, valueClass = 'text-neutral-200' }: { label: string; value: string; valueClass?: string }) {
    return (
        <div className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0">
            <span className="text-xs text-neutral-400">{label}</span>
            <span className={`text-sm ${valueClass}`}>
                {value}
            </span>
        </div>
    );
}
