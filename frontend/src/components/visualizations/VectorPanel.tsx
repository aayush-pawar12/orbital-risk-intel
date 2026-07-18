'use client';

import { AssessResponse } from '@/lib/api';
import { Crosshair } from 'lucide-react';

interface Props {
    assessment: AssessResponse | null;
}

export default function VectorPanel({ assessment }: Props) {
    if (!assessment) {
        return (
            <div className="bg-neutral-950/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-[600px] flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                    <Crosshair size={16} className="text-neutral-500" />
                    <h3 className="m-0 text-xs font-semibold tracking-wider text-neutral-300 uppercase">
                        State Vectors
                    </h3>
                </div>
                <div className="flex-1 flex items-center justify-center text-center text-neutral-500 text-sm">
                    Run an assessment to view positional<br />and velocity vectors.
                </div>
            </div>
        );
    }

    const sp = assessment.satellite_position;
    const dp = assessment.debris_position;
    const sv = assessment.satellite_velocity;
    const dv = assessment.debris_velocity;

    return (
        <div className="bg-neutral-950/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Crosshair size={16} className="text-neutral-500" />
                    <h3 className="m-0 text-xs font-semibold tracking-wider text-neutral-300 uppercase">
                        State Vectors
                    </h3>
                </div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                    GCRS (ECI)
                </span>
            </div>

            <div className="flex flex-col gap-6 overflow-y-auto pr-2">
                {/* Satellite */}
                <div>
                    <h4 className="text-sm font-semibold text-neutral-300 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        {assessment.satellite_name}
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <VectorTable 
                            title="Position" 
                            unit="km"
                            data={[
                                { label: 'X', value: sp.x_km },
                                { label: 'Y', value: sp.y_km },
                                { label: 'Z', value: sp.z_km },
                            ]}
                        />
                        <VectorTable 
                            title="Velocity" 
                            unit="km/s"
                            data={[
                                { label: 'Vx', value: sv.vx_km_s },
                                { label: 'Vy', value: sv.vy_km_s },
                                { label: 'Vz', value: sv.vz_km_s },
                                { label: '|V|', value: sv.magnitude_km_s },
                            ]}
                        />
                    </div>
                </div>

                <div className="h-px bg-neutral-800 w-full" />

                {/* Debris */}
                <div>
                    <h4 className="text-sm font-semibold text-neutral-300 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        {assessment.debris_name}
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <VectorTable 
                            title="Position" 
                            unit="km"
                            data={[
                                { label: 'X', value: dp.x_km },
                                { label: 'Y', value: dp.y_km },
                                { label: 'Z', value: dp.z_km },
                            ]}
                        />
                        <VectorTable 
                            title="Velocity" 
                            unit="km/s"
                            data={[
                                { label: 'Vx', value: dv.vx_km_s },
                                { label: 'Vy', value: dv.vy_km_s },
                                { label: 'Vz', value: dv.vz_km_s },
                                { label: '|V|', value: dv.magnitude_km_s },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function VectorTable({ title, unit, data }: { title: string, unit: string, data: { label: string, value: number }[] }) {
    return (
        <div className="bg-neutral-900 border border-white/5 rounded-lg overflow-hidden">
            <div className="bg-neutral-800/50 px-3 py-1.5 border-b border-white/5">
                <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">{title} ({unit})</span>
            </div>
            <table className="w-full text-left border-collapse">
                <tbody>
                    {data.map((row, i) => (
                        <tr key={row.label} className={i !== data.length - 1 ? 'border-b border-white/5' : ''}>
                            <td className="px-3 py-1.5 w-8 text-neutral-500 font-mono text-xs">{row.label}</td>
                            <td className="px-3 py-1.5 text-right font-mono text-xs text-neutral-300">{row.value >= 0 ? '+' : ''}{row.value.toFixed(4)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
