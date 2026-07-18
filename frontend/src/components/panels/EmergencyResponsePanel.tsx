'use client';

import { AutoResponse } from '@/lib/api';
import {
    Shield, Link2, FileCheck, Zap,
    ChevronRight, ShieldAlert
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    autoResponse: AutoResponse | null;
}

export default function EmergencyResponsePanel({ autoResponse }: Props) {
    const [flash, setFlash] = useState(true);

    useEffect(() => {
        if (autoResponse?.auto_response_triggered) {
            const timer = setTimeout(() => setFlash(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [autoResponse]);

    if (!autoResponse || !autoResponse.auto_response_triggered) return null;

    const { blockchain_proof, mitigation, audit_trail } = autoResponse;

    return (
        <div className={`bg-neutral-900/40 backdrop-blur-xl border rounded-xl p-5 shadow-lg animate-fade-in ${
            flash ? 'border-rose-500/50' : 'border-white/10'
        }`}>
            {/* Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-rose-500/30 mb-4">
                <div className={`w-9 h-9 rounded-full bg-rose-500/20 flex items-center justify-center ${flash ? 'animate-pulse' : ''}`}>
                    <ShieldAlert size={20} className="text-rose-500" />
                </div>
                <div className="flex-1">
                    <h2 className="text-[11px] font-bold tracking-widest text-rose-500 m-0">
                        🚨 CRITICAL THRESHOLD — AUTOMATED RESPONSE EXECUTED
                    </h2>
                    <p className="text-[10px] text-neutral-400 m-0 mt-0.5">
                        Distance &lt; 1 km detected — autonomous response triggered without human intervention
                    </p>
                </div>
                <div className="px-3 py-1 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-500 text-[10px] font-bold tracking-wider">
                    {autoResponse.response_status}
                </div>
            </div>

            {/* Response Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ResponseCard icon={<Zap size={16} />} title="INCIDENT RECORD" color="text-rose-500">
                    <DataRow label="Incident ID" value={autoResponse.incident_id.slice(0, 8) + '...'} mono />
                    <DataRow label="Triggered At" value={new Date(autoResponse.triggered_at).toISOString().replace('T', ' ').slice(0, 19) + ' UTC'} />
                    <DataRow label="Response" value="AUTONOMOUS" highlight />
                </ResponseCard>

                <ResponseCard icon={<Link2 size={16} />} title="BLOCKCHAIN AUDIT PROOF" color="text-cyan-500">
                    <DataRow label="Block Index" value={`#${blockchain_proof.block_index}`} />
                    <DataRow label="Block Hash" value={blockchain_proof.block_hash.slice(0, 16) + '...'} mono />
                    <DataRow label="Tx Hash" value={blockchain_proof.tx_hash.slice(0, 18) + '...'} mono />
                    <DataRow label="Verification" value={blockchain_proof.verification} highlight />
                </ResponseCard>

                <ResponseCard icon={<FileCheck size={16} />} title="MITIGATION CONTRACT" color="text-orange-500">
                    <DataRow label="Contract ID" value={mitigation.contract_id} mono />
                    <DataRow label="Status" value={mitigation.status} highlight />
                    <DataRow label="Δv Required" value={`${mitigation.parameters.delta_v_required_m_s} m/s`} />
                    <DataRow label="Fuel Cost" value={`${mitigation.parameters.fuel_cost_kg} kg`} />
                </ResponseCard>

                <ResponseCard icon={<Shield size={16} />} title="INSURANCE & AUDIT" color="text-violet-500">
                    <DataRow label="Policy ID" value={mitigation.insurance_claim.policy_id} mono />
                    <DataRow label="Coverage" value={mitigation.insurance_claim.coverage_triggered ? 'TRIGGERED' : 'READY'} highlight />
                    <DataRow label="Est. Cost" value={`$${mitigation.insurance_claim.estimated_cost_usd.toLocaleString()}`} />
                    <DataRow label="Chain Integrity" value={audit_trail.chain_integrity} highlight />
                </ResponseCard>
            </div>

            {/* Footer */}
            <div className="mt-4 p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 flex items-start gap-2">
                <ChevronRight size={14} className="text-rose-500 shrink-0 mt-0.5" />
                <p className="m-0 text-[11px] text-neutral-400 leading-relaxed">
                    <strong className="text-rose-500">CORE USP:</strong> Existing systems detect threats. ORIS detects and autonomously executes response — incident logging, blockchain audit recording, and mitigation workflow — all without human intervention.
                </p>
            </div>
        </div>
    );
}

function ResponseCard({ icon, title, color, children }: { icon: React.ReactNode, title: string, color: string, children: React.ReactNode }) {
    return (
        <div className="bg-neutral-800/40 rounded-lg border border-white/5 p-3">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                <div className={color}>{icon}</div>
                <span className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">{title}</span>
            </div>
            {children}
        </div>
    );
}

function DataRow({ label, value, mono, highlight }: {
    label: string;
    value: string;
    mono?: boolean;
    highlight?: boolean;
}) {
    return (
        <div className="flex justify-between items-center py-0.5">
            <span className="text-[9px] text-neutral-500 uppercase tracking-wider">
                {label}
            </span>
            <span className={`text-[10px] ${mono ? 'font-mono' : ''} ${
                highlight 
                    ? 'text-emerald-500 font-bold bg-emerald-500/15 px-1.5 py-0.5 rounded' 
                    : 'text-neutral-300'
            }`}>
                {value}
            </span>
        </div>
    );
}
