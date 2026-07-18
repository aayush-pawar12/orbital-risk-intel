'use client';

import { useEffect, useState } from 'react';
import { api, IncidentRecord, AuditLogResponse } from '@/lib/api';
import { Shield, Lock, AlertTriangle, X, RefreshCw, Hash } from 'lucide-react';

export default function AuditTrailModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'chain' | 'incidents'>('chain');
  const [auditData, setAuditData] = useState<AuditLogResponse | null>(null);
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [auditRes, incRes] = await Promise.all([
        api.getAuditLogs(),
        api.getIncidents(),
      ]);
      setAuditData(auditRes);
      setIncidents(incRes);
    } catch (e: unknown) {
      if (e instanceof Error) setError(`Failed to load audit records: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-6">
      <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-[1000px] max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-emerald-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Shield size={22} className="text-emerald-500" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-neutral-100 m-0 tracking-wide uppercase">
                IMMUTABLE AUDIT TRAIL & INCIDENT REGISTER
              </h2>
              <p className="text-[11px] text-neutral-400 mt-0.5 mb-0">
                SHA-256 cryptographic hash chain verifying autonomous critical response actions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded transition-colors border border-emerald-500/20"
            >
              <RefreshCw size={14} /> REFRESH
            </button>
            <button
              onClick={onClose}
              className="bg-transparent border-none text-neutral-500 hover:text-white cursor-pointer p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Status Bar inside modal */}
        {auditData && (
          <div className="px-6 py-2.5 bg-neutral-900/50 border-b border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Lock size={14} className={auditData.chain_integrity === 'VALID' ? 'text-emerald-500' : 'text-rose-500'} />
              <span className="text-neutral-400 uppercase tracking-widest text-[9px] font-bold">Chain Integrity:</span>
              <span className={`font-bold ${auditData.chain_integrity === 'VALID' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {auditData.chain_integrity}
              </span>
            </div>
            <div className="flex gap-4 text-[10px] uppercase tracking-widest text-neutral-500">
              <span>Total Blocks: <strong className="text-neutral-300">{auditData.total_blocks}</strong></span>
              <span>Total Incidents: <strong className="text-neutral-300">{incidents.length}</strong></span>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-neutral-900/30">
          <button
            onClick={() => setActiveTab('chain')}
            className={`px-6 py-3 font-bold text-xs uppercase tracking-widest transition-colors ${
              activeTab === 'chain' 
                ? 'bg-neutral-800 text-emerald-500 border-b-2 border-emerald-500' 
                : 'bg-transparent text-neutral-500 hover:text-neutral-300 border-b-2 border-transparent'
            }`}
          >
            ⛓️ BLOCKCHAIN AUDIT LOGS ({auditData?.entries.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('incidents')}
            className={`px-6 py-3 font-bold text-xs uppercase tracking-widest transition-colors ${
              activeTab === 'incidents' 
                ? 'bg-neutral-800 text-emerald-500 border-b-2 border-emerald-500' 
                : 'bg-transparent text-neutral-500 hover:text-neutral-300 border-b-2 border-transparent'
            }`}
          >
            🚨 AUTONOMOUS INCIDENTS ({incidents.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          {loading && (
            <div className="text-center py-12 text-neutral-500 font-mono text-xs animate-pulse">
              [ CRYPTOGRAPHIC VERIFICATION IN PROGRESS... ]
            </div>
          )}

          {error && (
            <div className="bg-rose-500/20 text-rose-500 p-4 rounded-lg text-sm border border-rose-500/30 font-mono mb-4">
              ⚠ {error}
            </div>
          )}

          {!loading && activeTab === 'chain' && (
            <div className="flex flex-col gap-4">
              {(!auditData || auditData.entries.length === 0) ? (
                <div className="text-center py-12 text-neutral-500 text-xs">
                  No cryptographic blocks recorded yet. Run an assessment or simulate an emergency drill below.
                </div>
              ) : (
                auditData.entries.map((entry) => (
                  <div key={entry.id} className="bg-neutral-800/30 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <Hash size={16} className="text-emerald-500" />
                        <span className="font-mono text-xs font-bold text-emerald-500">
                          BLOCK #{entry.id}
                        </span>
                        <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                          {entry.event_type}
                        </span>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-500 font-bold tracking-widest uppercase">
                        {entry.verification_status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                      <div>
                        <span className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold">Block Hash:</span>
                        <div className="font-mono text-neutral-300 break-all text-[11px] mt-1 p-2 bg-neutral-950/50 rounded border border-white/5">
                          {entry.block_hash}
                        </div>
                      </div>
                      <div>
                        <span className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold">Previous Hash:</span>
                        <div className="font-mono text-neutral-500 break-all text-[11px] mt-1 p-2 bg-neutral-950/50 rounded border border-white/5">
                          {entry.prev_hash}
                        </div>
                      </div>
                    </div>

                    {entry.block_data && (
                      <div className="mt-2 p-3 bg-neutral-950/50 rounded-lg text-xs flex flex-wrap gap-4 border border-white/5">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-neutral-500 text-[9px] uppercase tracking-widest font-bold">Objects</span>
                          <strong className="text-neutral-300 font-mono">{String(entry.block_data.satellite)} / {String(entry.block_data.debris)}</strong>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-neutral-500 text-[9px] uppercase tracking-widest font-bold">Distance</span>
                          <strong className="text-rose-500 font-mono">{String(entry.block_data.distance_km)} km</strong>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-neutral-500 text-[9px] uppercase tracking-widest font-bold">Contract</span>
                          <span className="font-mono text-emerald-400">{String(entry.block_data.mitigation_contract)}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-neutral-500 text-[9px] uppercase tracking-widest font-bold">Timestamp</span>
                          <span className="font-mono text-neutral-400">{entry.created_at?.replace('T', ' ').slice(0, 19)} UTC</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {!loading && activeTab === 'incidents' && (
            <div className="flex flex-col gap-3">
              {incidents.length === 0 ? (
                <div className="text-center py-12 text-neutral-500 text-xs">
                  No autonomous incidents recorded yet.
                </div>
              ) : (
                incidents.map((inc) => (
                  <div key={inc.id} className="bg-neutral-800/30 border-l-4 border-l-rose-500 border border-white/10 rounded-r-xl p-4 flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle size={16} className="text-rose-500" />
                        <span className="font-bold text-sm text-neutral-200">
                          {inc.satellite_name} × {inc.debris_name}
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-500 flex gap-2">
                        <span>Incident ID: <span className="font-mono text-neutral-400">{inc.incident_id.slice(0, 13)}...</span></span>
                        <span>|</span>
                        <span>Contract: <span className="font-mono text-emerald-500/70">{inc.mitigation_contract_id}</span></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-[9px] uppercase tracking-widest font-bold text-neutral-500">MIN DISTANCE</div>
                        <div className="text-lg font-black font-mono text-rose-500">
                          {inc.distance_km.toFixed(4)} km
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 rounded text-[10px] font-bold uppercase tracking-widest">
                        {inc.response_status}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
