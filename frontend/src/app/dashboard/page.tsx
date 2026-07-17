'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, Satellite, DebrisObj, AssessResponse, PredictResponse, SystemStatus, AutoResponse } from '@/lib/api';
import Header from '@/components/layout/Header';
import StatusBar from '@/components/layout/StatusBar';
import OverviewPanel from '@/components/panels/OverviewPanel';
import RiskPanel from '@/components/panels/RiskPanel';
import GlobePanel from '@/components/visualizations/GlobePanel';
import TimelineChart from '@/components/visualizations/TimelineChart';
import ClosestApproachPanel from '@/components/panels/ClosestApproachPanel';
import VectorPanel from '@/components/visualizations/VectorPanel';
import SatelliteMapPanel from '@/components/visualizations/SatelliteMapPanel';
import EmergencyResponsePanel from '@/components/panels/EmergencyResponsePanel';
import AuditTrailModal from '@/components/modals/AuditTrailModal';
import { Shield, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  // ── Data state ──
  const [satellites, setSatellites] = useState<Satellite[]>([]);
  const [debris, setDebris] = useState<DebrisObj[]>([]);
  const [status, setStatus] = useState<SystemStatus | null>(null);

  // ── Selection state ──
  const [selectedSatId, setSelectedSatId] = useState<number | null>(null);
  const [selectedDebId, setSelectedDebId] = useState<number | null>(null);

  // ── Assessment results ──
  const [assessment, setAssessment] = useState<AssessResponse | null>(null);
  const [prediction, setPrediction] = useState<PredictResponse | null>(null);

  // ── UI state ──
  const [loading, setLoading] = useState(true);
  const [assessing, setAssessing] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [simulatingDrill, setSimulatingDrill] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiOnline, setApiOnline] = useState(false);

  // ── Load initial data ──
  useEffect(() => {
    async function loadData() {
      try {
        const [sats, debs, sys] = await Promise.all([
          api.getSatellites(),
          api.getDebris(),
          api.getStatus(),
        ]);
        setSatellites(sats);
        setDebris(debs);
        setStatus(sys);
        setApiOnline(true);
        if (sats.length > 0) setSelectedSatId(sats[0].id);
        if (debs.length > 0) setSelectedDebId(debs[0].id);
      } catch (e: any) {
        setError('Cannot connect to backend API. The server may be waking up — please wait 30 seconds and refresh.');
        setApiOnline(false);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // ── Run conjunction assessment ──
  const runAssessment = useCallback(async () => {
    if (!selectedSatId || !selectedDebId) return;
    setAssessing(true);
    setError(null);
    try {
      const result = await api.assess(selectedSatId, selectedDebId);
      setAssessment(result);
    } catch (e: any) {
      setError(`Assessment failed: ${e.message}`);
    } finally {
      setAssessing(false);
    }
  }, [selectedSatId, selectedDebId]);

  // ── Run prediction ──
  const runPrediction = useCallback(async () => {
    if (!selectedSatId || !selectedDebId) return;
    setPredicting(true);
    setError(null);
    try {
      const result = await api.predict(selectedSatId, selectedDebId);
      setPrediction(result);
    } catch (e: any) {
      setError(`Prediction failed: ${e.message}`);
    } finally {
      setPredicting(false);
    }
  }, [selectedSatId, selectedDebId]);

  // ── Run emergency drill simulation (Core USP demo) ──
  const runSimulationDrill = useCallback(async () => {
    if (!selectedSatId || !selectedDebId) return;
    setSimulatingDrill(true);
    setError(null);
    try {
      const result = await api.simulateDrill(selectedSatId, selectedDebId);
      setAssessment(result);
    } catch (e: any) {
      setError(`Drill simulation failed: ${e.message}`);
    } finally {
      setSimulatingDrill(false);
    }
  }, [selectedSatId, selectedDebId]);

  const selectedSat = satellites.find(s => s.id === selectedSatId) || null;
  const selectedDeb = debris.find(d => d.id === selectedDebId) || null;

  // ── Determine if CRITICAL auto-response was triggered ──
  const activeAutoResponse: AutoResponse | null =
    assessment?.auto_response || prediction?.auto_response || null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Header />
      <StatusBar status={status} apiOnline={apiOnline} />

      <main style={{ padding: '0 1.5rem 2rem', maxWidth: '1600px', margin: '0 auto' }}>
        {error && (
          <div style={{
            background: 'var(--risk-critical-bg)',
            border: '1px solid rgba(255, 45, 85, 0.3)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            color: 'var(--risk-critical)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.8rem',
          }}>
            ⚠ {error}
          </div>
        )}

        {/* ╔══════════════════════════════════════════════╗ */}
        {/* ║  SECTION 1: GETTING STARTED                 ║ */}
        {/* ╚══════════════════════════════════════════════╝ */}
        {!assessment && !prediction && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.06), rgba(74, 125, 255, 0.04))',
            border: '1px solid rgba(0, 212, 255, 0.15)',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.25rem',
          }}>
            <h2 style={{
              fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem',
              color: 'var(--accent-cyan)',
            }}>
              👋 How to Use This Platform
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.75rem',
              marginTop: '0.75rem',
            }}>
              <StepCard step={1} title="Select Objects" desc="Choose a satellite and a debris object from the dropdowns below." />
              <StepCard step={2} title="Run Assessment" desc='Click "RUN ASSESSMENT" to compute the real-time separation distance using SGP4 propagation.' />
              <StepCard step={3} title="Predict TCA" desc='Click "PREDICT TCA" to find the closest approach point over the next 24 hours.' />
              <StepCard step={4} title="Analyze Results" desc="Review the risk level, 3D positions, velocity vectors, and distance timeline below." />
            </div>
          </div>
        )}

        {/* ╔══════════════════════════════════════════════╗ */}
        {/* ║  SECTION 2: OBJECT SELECTION & CONTROLS      ║ */}
        {/* ╚══════════════════════════════════════════════╝ */}
        <SectionTitle
          number="01"
          title="OBJECT SELECTION"
          subtitle="Choose the satellite and debris object to analyze for conjunction risk"
        />

        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-end',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <label className="label" style={{ display: 'block', marginBottom: '6px' }}>
              🛰️ PRIMARY OBJECT (SATELLITE)
            </label>
            <select
              value={selectedSatId || ''}
              onChange={e => { setSelectedSatId(Number(e.target.value)); setAssessment(null); setPrediction(null); }}
              style={{ width: '100%' }}
              disabled={loading}
            >
              {satellites.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} — NORAD {s.norad_id} — {s.operator}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '220px' }}>
            <label className="label" style={{ display: 'block', marginBottom: '6px' }}>
              🗑️ SECONDARY OBJECT (DEBRIS)
            </label>
            <select
              value={selectedDebId || ''}
              onChange={e => { setSelectedDebId(Number(e.target.value)); setAssessment(null); setPrediction(null); }}
              style={{ width: '100%' }}
              disabled={loading}
            >
              {debris.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} — NORAD {d.norad_id}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              onClick={runAssessment}
              disabled={assessing || loading || !selectedSatId || !selectedDebId}
              style={{ whiteSpace: 'nowrap' }}
            >
              {assessing ? '◌ COMPUTING...' : '◉ RUN ASSESSMENT'}
            </button>

            <button
              className="btn-primary"
              onClick={runPrediction}
              disabled={predicting || loading || !selectedSatId || !selectedDebId}
              style={{
                whiteSpace: 'nowrap',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              }}
            >
              {predicting ? '◌ PREDICTING...' : '◈ PREDICT TCA'}
            </button>

            <button
              onClick={runSimulationDrill}
              disabled={simulatingDrill || loading || !selectedSatId || !selectedDebId}
              style={{
                whiteSpace: 'nowrap',
                background: 'linear-gradient(135deg, #ff2d55, #ff5e3a)',
                color: '#fff',
                border: 'none',
                padding: '0.6rem 1.1rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(255, 45, 85, 0.35)',
              }}
            >
              <AlertTriangle size={14} />
              {simulatingDrill ? '◌ DRILL IN PROGRESS...' : '🚨 EMERGENCY DRILL'}
            </button>

            <button
              onClick={() => setIsAuditModalOpen(true)}
              style={{
                whiteSpace: 'nowrap',
                background: 'var(--bg-secondary)',
                color: 'var(--accent-cyan)',
                border: '1px solid rgba(0, 212, 255, 0.35)',
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Shield size={14} />
              🛡️ AUDIT REGISTER
            </button>
          </div>
        </div>

        {/* ╔══════════════════════════════════════════════════╗ */}
        {/* ║  CRITICAL RESPONSE (auto-triggered, core USP)   ║ */}
        {/* ╚══════════════════════════════════════════════════╝ */}
        <EmergencyResponsePanel autoResponse={activeAutoResponse} />

        {/* ╔══════════════════════════════════════════════╗ */}
        {/* ║  SECTION 3: OBJECT DETAILS                  ║ */}
        {/* ╚══════════════════════════════════════════════╝ */}
        <SectionTitle
          number="02"
          title="OBJECT DETAILS"
          subtitle="Identification and orbital metadata for the selected satellite and debris"
        />

        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <OverviewPanel satellite={selectedSat} debris={selectedDeb} loading={loading} />
          <RiskPanel assessment={assessment} loading={assessing} />
        </div>

        {/* ╔══════════════════════════════════════════════╗ */}
        {/* ║  SECTION 4: SPATIAL ANALYSIS                ║ */}
        {/* ╚══════════════════════════════════════════════╝ */}
        <SectionTitle
          number="03"
          title="SPATIAL ANALYSIS"
          subtitle="3D orbital positions and state vectors in the GCRS coordinate frame"
        />

        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <GlobePanel assessment={assessment} />
          <VectorPanel assessment={assessment} />
        </div>

        {/* ╔══════════════════════════════════════════════╗ */}
        {/* ║  SECTION 5: PREDICTION & TIMELINE           ║ */}
        {/* ╚══════════════════════════════════════════════╝ */}
        <SectionTitle
          number="04"
          title="CONJUNCTION PREDICTION"
          subtitle="24-hour propagation timeline showing distance evolution and Time of Closest Approach (TCA)"
        />

        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <TimelineChart prediction={prediction} loading={predicting} />
          <ClosestApproachPanel prediction={prediction} loading={predicting} />
        </div>

        {/* ╔══════════════════════════════════════════════╗ */}
        {/* ║  SECTION 6: LIVE SATELLITE MAP              ║ */}
        {/* ╚══════════════════════════════════════════════╝ */}
        <SectionTitle
          number="05"
          title="LIVE GLOBAL SATELLITE MAP"
          subtitle="Real-time tracking of LEO, MEO, and GEO satellites — powered by satellitemap.space"
        />

        <SatelliteMapPanel noradId={selectedSat?.norad_id} />

        {/* Footer */}
        <footer style={{
          marginTop: '2rem',
          padding: '1rem 0',
          borderTop: '1px solid var(--border-primary)',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.65rem',
        }}>
          <p style={{ margin: 0 }}>
            ORIS v1.0 — Orbital Risk Intelligence System · SGP4 Propagation via Skyfield ·
            TLE Source: Celestrak · Coordinate Frame: GCRS (ECI)
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '0.6rem' }}>
            Risk Thresholds: CRITICAL &lt; 1 km · WARNING 1–5 km · SAFE &gt; 5 km
          </p>
        </footer>

        <AuditTrailModal
          isOpen={isAuditModalOpen}
          onClose={() => setIsAuditModalOpen(false)}
        />
      </main>
    </div>
  );
}

/* ── Helper Components ── */

function SectionTitle({ number, title, subtitle }: {
  number: string; title: string; subtitle: string;
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'baseline',
      gap: '12px',
      margin: '0.25rem 0 0.75rem',
    }}>
      <span className="mono" style={{
        fontSize: '0.7rem',
        fontWeight: 700,
        color: 'var(--accent-cyan)',
        opacity: 0.6,
      }}>
        {number}
      </span>
      <div>
        <h2 style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          margin: 0,
          color: 'var(--text-primary)',
        }}>
          {title}
        </h2>
        <p style={{
          fontSize: '0.68rem',
          color: 'var(--text-muted)',
          margin: '2px 0 0',
        }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function StepCard({ step, title, desc }: {
  step: number; title: string; desc: string;
}) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-primary)',
      borderRadius: '10px',
      padding: '0.85rem',
      display: 'flex',
      gap: '0.75rem',
      alignItems: 'flex-start',
    }}>
      <div style={{
        width: '28px',
        height: '28px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.75rem',
        fontWeight: 700,
        color: '#fff',
        flexShrink: 0,
      }}>
        {step}
      </div>
      <div>
        <p style={{
          fontSize: '0.78rem',
          fontWeight: 600,
          margin: '0 0 3px',
          color: 'var(--text-primary)',
        }}>
          {title}
        </p>
        <p style={{
          fontSize: '0.68rem',
          color: 'var(--text-muted)',
          margin: 0,
          lineHeight: 1.4,
        }}>
          {desc}
        </p>
      </div>
    </div>
  );
}
