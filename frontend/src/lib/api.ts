/**
 * API client for the Orbital Risk Intelligence System backend.
 */

function getApiBase(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:8000/api';
  }
  return 'https://orbital-risk-intel.onrender.com/api';
}

export interface IncidentRecord {
  id: number;
  incident_id: string;
  satellite_name: string;
  satellite_norad_id: number;
  debris_name: string;
  debris_norad_id: number;
  distance_km: number;
  tca_utc: string | null;
  response_status: string;
  mitigation_action: string;
  mitigation_contract_id: string;
  created_at: string;
}

export interface AuditBlockData {
  satellite?: string;
  debris?: string;
  distance_km?: number;
  mitigation_contract?: string;
}

export interface AuditLogEntry {
  id: number;
  incident_id: string;
  event_type: string;
  block_hash: string;
  prev_hash: string;
  tx_hash: string;
  verification_status: string;
  block_data: AuditBlockData;
  created_at: string;
}

export interface AuditLogResponse {
  chain_integrity: string;
  total_blocks: number;
  entries: AuditLogEntry[];
}

// ── API Functions ─────────────────────────────────────────────────────

async function apiFetch<T>(path: string, opts?: RequestInit): Promise<T> {
  const base = getApiBase();
  const res = await fetch(`${base}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json();
}

export const api = {
  getSatellites: () => apiFetch<Satellite[]>('/satellites'),
  getDebris: () => apiFetch<DebrisObj[]>('/debris'),
  getStatus: () => apiFetch<SystemStatus>('/status'),
  getIncidents: () => apiFetch<IncidentRecord[]>('/incidents'),
  getAuditLogs: () => apiFetch<AuditLogResponse>('/audit-logs'),

  assess: (satellite_id: number, debris_id: number) =>
    apiFetch<AssessResponse>('/assess', {
      method: 'POST',
      body: JSON.stringify({ satellite_id, debris_id }),
    }),

  predict: (satellite_id: number, debris_id: number, window_hours = 24, step_minutes = 5) =>
    apiFetch<PredictResponse>('/predict', {
      method: 'POST',
      body: JSON.stringify({ satellite_id, debris_id, window_hours, step_minutes }),
    }),

  simulateDrill: (satellite_id: number, debris_id: number) =>
    apiFetch<AssessResponse>('/simulate-drill', {
      method: 'POST',
      body: JSON.stringify({ satellite_id, debris_id }),
    }),
};

export interface Satellite {
  id: number;
  name: string;
  norad_id: number;
  operator: string;
  orbit_type: string;
  active: boolean;
  latest_tle_epoch: string | null;
}

export interface DebrisObj {
  id: number;
  name: string;
  norad_id: number;
  source: string;
  orbit_type: string;
  latest_tle_epoch: string | null;
}

export interface PositionVector {
  x_km: number;
  y_km: number;
  z_km: number;
  frame: string;
}

export interface VelocityVector {
  vx_km_s: number;
  vy_km_s: number;
  vz_km_s: number;
  magnitude_km_s: number;
}

export interface RiskClassification {
  distance_km: number;
  risk_level: 'CRITICAL' | 'WARNING' | 'SAFE';
  threshold_used: number;
}

export interface BlockchainProof {
  block_hash: string;
  prev_hash: string;
  tx_hash: string;
  block_index: number;
  verification: string;
}

export interface MitigationContract {
  contract_id: string;
  type: string;
  status: string;
  triggered_at: string;
  parameters: {
    delta_v_required_m_s: number;
    maneuver_window_minutes: number;
    fuel_cost_kg: number;
    confidence: string;
  };
  insurance_claim: {
    policy_id: string;
    coverage_triggered: boolean;
    estimated_cost_usd: number;
  };
}

export interface AutoResponse {
  auto_response_triggered: boolean;
  incident_id: string;
  triggered_at: string;
  response_status: string;
  blockchain_proof: BlockchainProof;
  mitigation: MitigationContract;
  audit_trail: {
    total_incidents: number;
    total_audit_entries: number;
    chain_integrity: string;
  };
}

export interface AssessResponse {
  satellite_name: string;
  satellite_norad_id: number;
  debris_name: string;
  debris_norad_id: number;
  timestamp: string;
  propagation_model: string;
  coordinate_frame: string;
  satellite_position: PositionVector;
  debris_position: PositionVector;
  satellite_velocity: VelocityVector;
  debris_velocity: VelocityVector;
  risk: RiskClassification;
  auto_response?: AutoResponse;
}

export interface TimelinePoint {
  time_utc: string;
  distance_km: number;
  risk_level: string;
}

export interface PredictResponse {
  satellite_name: string;
  debris_name: string;
  propagation_model: string;
  window_hours: number;
  step_minutes: number;
  total_steps: number;
  min_distance_km: number;
  tca_utc: string;
  predicted_risk: string;
  confidence_level: string;
  timeline: TimelinePoint[];
  auto_response?: AutoResponse;
}

export interface SystemStatus {
  status: string;
  app_name: string;
  version: string;
  satellite_count: number;
  debris_count: number;
  tle_record_count: number;
  last_tle_update: string | null;
  propagation_model: string;
  coordinate_frame: string;
  risk_thresholds: { critical_km: number; warning_km: number };
  total_incidents: number;
  total_audit_entries: number;
}


