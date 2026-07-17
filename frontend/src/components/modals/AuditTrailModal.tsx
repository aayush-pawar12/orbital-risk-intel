'use client';

import { useEffect, useState } from 'react';
import { api, IncidentRecord, AuditLogResponse } from '@/lib/api';
import { Shield, Lock, AlertTriangle, X, RefreshCw, Hash } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuditTrailModal({ isOpen, onClose }: Props) {
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
    } catch (e) {
      setError(`Failed to load audit records: ${e instanceof Error ? e.message : String(e)}`);
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
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 10, 24, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem',
    }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-primary)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '1000px',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        overflow: 'hidden',
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(90deg, rgba(0, 212, 255, 0.08), transparent)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(0, 212, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(0, 212, 255, 0.3)',
            }}>
              <Shield size={22} color="var(--accent-cyan)" />
            </div>
            <div>
              <h2 style={{
                fontSize: '1rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                margin: 0,
                letterSpacing: '0.05em',
              }}>
                IMMUTABLE AUDIT TRAIL & INCIDENT REGISTER
              </h2>
              <p style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                margin: '2px 0 0',
              }}>
                SHA-256 cryptographic hash chain verifying autonomous critical response actions
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={fetchData}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}
            >
              <RefreshCw size={14} /> REFRESH
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Status Bar inside modal */}
        {auditData && (
          <div style={{
            padding: '0.65rem 1.5rem',
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={14} color="#30d158" />
              <span>Chain Integrity:</span>
              <span style={{
                color: auditData.chain_integrity === 'VALID' ? '#30d158' : '#ff2d55',
                fontWeight: 700,
              }}>
                {auditData.chain_integrity}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span>Total Blocks: <strong>{auditData.total_blocks}</strong></span>
              <span>Total Incidents: <strong>{incidents.length}</strong></span>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-primary)',
          background: 'var(--bg-secondary)',
        }}>
          <button
            onClick={() => setActiveTab('chain')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'chain' ? 'var(--bg-card)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'chain' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              color: activeTab === 'chain' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
            }}
          >
            ⛓️ BLOCKCHAIN AUDIT LOGS ({auditData?.entries.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('incidents')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'incidents' ? 'var(--bg-card)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'incidents' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              color: activeTab === 'incidents' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
            }}
          >
            🚨 AUTONOMOUS INCIDENTS ({incidents.length})
          </button>
        </div>

        {/* Modal Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
        }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              ◌ Cryptographically verifying blockchain audit logs...
            </div>
          )}

          {error && (
            <div style={{
              background: 'var(--risk-critical-bg)',
              color: 'var(--risk-critical)',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
            }}>
              ⚠ {error}
            </div>
          )}

          {!loading && activeTab === 'chain' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(!auditData || auditData.entries.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                  No cryptographic blocks recorded yet. Run an assessment or simulate an emergency drill below.
                </div>
              ) : (
                auditData.entries.map((entry) => (
                  <div key={entry.id} style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '10px',
                    padding: '1rem',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem',
                      borderBottom: '1px solid var(--border-primary)',
                      paddingBottom: '0.5rem',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Hash size={16} color="var(--accent-cyan)" />
                        <span className="mono" style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                          BLOCK #{entry.id}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                          {entry.event_type}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '0.65rem',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'rgba(48, 209, 88, 0.15)',
                        color: '#30d158',
                        fontWeight: 700,
                      }}>
                        {entry.verification_status}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.72rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Block Hash:</span>
                        <div className="mono" style={{ color: 'var(--text-primary)', wordBreak: 'break-all', fontSize: '0.68rem', marginTop: '2px' }}>
                          {entry.block_hash}
                        </div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Previous Hash:</span>
                        <div className="mono" style={{ color: 'var(--text-secondary)', wordBreak: 'break-all', fontSize: '0.68rem', marginTop: '2px' }}>
                          {entry.prev_hash}
                        </div>
                      </div>
                    </div>

                    {entry.block_data && (
                      <div style={{
                        marginTop: '0.75rem',
                        padding: '0.6rem',
                        background: 'rgba(0,0,0,0.25)',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1rem',
                      }}>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Objects:</span>{' '}
                          <strong>{entry.block_data.satellite} / {entry.block_data.debris}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Distance:</span>{' '}
                          <strong style={{ color: 'var(--risk-critical)' }}>{entry.block_data.distance_km} km</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Contract:</span>{' '}
                          <span className="mono">{entry.block_data.mitigation_contract}</span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Timestamp:</span>{' '}
                          <span>{entry.created_at?.replace('T', ' ').slice(0, 19)} UTC</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {!loading && activeTab === 'incidents' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {incidents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                  No autonomous incidents recorded yet.
                </div>
              ) : (
                incidents.map((inc) => (
                  <div key={inc.id} style={{
                    background: 'var(--bg-secondary)',
                    borderLeft: '4px solid var(--risk-critical)',
                    borderRadius: '8px',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <AlertTriangle size={16} color="var(--risk-critical)" />
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                          {inc.satellite_name} × {inc.debris_name}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Incident ID: <span className="mono">{inc.incident_id.slice(0, 13)}...</span> | Contract: <span className="mono">{inc.mitigation_contract_id}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>MIN DISTANCE</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--risk-critical)' }}>
                          {inc.distance_km.toFixed(4)} km
                        </div>
                      </div>
                      <div style={{
                        padding: '4px 10px',
                        background: 'rgba(48, 209, 88, 0.15)',
                        color: '#30d158',
                        borderRadius: '4px',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                      }}>
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
