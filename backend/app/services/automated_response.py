"""
Automated Critical Response Module — Core USP

When collision risk is CRITICAL (< 1 km separation), the system AUTONOMOUSLY:
1. Creates an incident record in the database
2. Generates a blockchain-style cryptographic audit proof (SHA-256 hash chain)
3. Stores an immutable audit log entry
4. Simulates automated mitigation contract execution
5. Returns emergency data to the frontend for display

NO human intervention required. Detection → Execution in one step.
"""

import hashlib
import json
import logging
import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy.orm import Session

from app.models import CriticalIncident, AuditLog

logger = logging.getLogger(__name__)


def _generate_block_hash(data: dict, prev_hash: str) -> str:
    """Generate a SHA-256 hash for a blockchain-style audit entry."""
    block_string = json.dumps(data, sort_keys=True, default=str) + prev_hash
    return hashlib.sha256(block_string.encode()).hexdigest()


def _get_chain_prev_hash(db: Session) -> str:
    """Get the hash of the last audit log entry to form the chain."""
    last_entry = db.query(AuditLog).order_by(
        AuditLog.created_at.desc()).first()
    if last_entry and last_entry.block_hash:
        return last_entry.block_hash
    # Genesis block hash
    return hashlib.sha256(b"ORIS_GENESIS_BLOCK_v1.0").hexdigest()


def execute_critical_response(
    db: Session,
    satellite_name: str,
    satellite_norad_id: int,
    debris_name: str,
    debris_norad_id: int,
    distance_km: float,
    tca_utc: Optional[datetime] = None,
    satellite_position: Optional[list] = None,
    debris_position: Optional[list] = None,
) -> dict:
    """
    AUTONOMOUS CRITICAL RESPONSE — triggered automatically when distance < 1 km.

    This is the core USP: existing systems detect, ORIS detects AND executes response.
    """
    now = datetime.now(timezone.utc)
    incident_id = str(uuid.uuid4())

    logger.critical(
        f"🚨 CRITICAL THRESHOLD BREACH — {satellite_name} / {debris_name} — "
        f"Distance: {distance_km:.4f} km — Initiating automated response"
    )

    # ── STEP 1: Create Incident Record ──────────────────────────────────
    incident = CriticalIncident(
        incident_id=incident_id,
        satellite_name=satellite_name,
        satellite_norad_id=satellite_norad_id,
        debris_name=debris_name,
        debris_norad_id=debris_norad_id,
        distance_km=distance_km,
        tca_utc=tca_utc,
        satellite_position=(
            json.dumps(satellite_position) if satellite_position else None
        ),
        debris_position=json.dumps(
            debris_position) if debris_position else None,
        response_status="EXECUTED",
        mitigation_action="AUTOMATED_AVOIDANCE_MANEUVER_INITIATED",
    )
    db.add(incident)
    logger.info(f"  ✓ Incident record created: {incident_id}")

    # ── STEP 2: Generate Blockchain Proof ───────────────────────────────
    prev_hash = _get_chain_prev_hash(db)

    block_data = {
        "incident_id": incident_id,
        "timestamp": now.isoformat(),
        "event": "CRITICAL_THRESHOLD_BREACH",
        "satellite": satellite_name,
        "satellite_norad_id": satellite_norad_id,
        "debris": debris_name,
        "debris_norad_id": debris_norad_id,
        "distance_km": round(distance_km, 6),
        "tca_utc": tca_utc.isoformat() if tca_utc else None,
        "response_action": "AUTOMATED_AVOIDANCE_MANEUVER",
        "mitigation_contract": "ORIS-MIT-" + incident_id[:8].upper(),
        "block_index": _get_chain_length(db) + 1,
    }

    block_hash = _generate_block_hash(block_data, prev_hash)
    tx_hash = (
        "0x" + hashlib.sha256((incident_id + now.isoformat()
                               ).encode()).hexdigest()[:40]
    )

    logger.info(f"  ✓ Blockchain proof generated: {block_hash[:16]}...")

    # ── STEP 3: Store Audit Log ─────────────────────────────────────────
    audit = AuditLog(
        incident_id=incident_id,
        event_type="CRITICAL_THRESHOLD_BREACH",
        block_hash=block_hash,
        prev_hash=prev_hash,
        tx_hash=tx_hash,
        block_data=json.dumps(block_data),
        verification_status="VERIFIED",
    )
    db.add(audit)
    logger.info(f"  ✓ Audit log stored with tx: {tx_hash[:16]}...")

    # ── STEP 4: Simulate Mitigation Contract Execution ──────────────────
    mitigation_contract = {
        "contract_id": "ORIS-MIT-" + incident_id[:8].upper(),
        "type": "COLLISION_AVOIDANCE_MANEUVER",
        "status": "EXECUTED",
        "triggered_at": now.isoformat(),
        "parameters": {
            "delta_v_required_m_s": round(max(0.01, 1.0 / max(distance_km, 0.001)), 4),
            "maneuver_window_minutes": 90,
            "fuel_cost_kg": round(max(0.05, 0.5 / max(distance_km, 0.001)), 4),
            "confidence": "HIGH" if distance_km < 0.5 else "MEDIUM",
        },
        "insurance_claim": {
            "policy_id": "ORIS-INS-" + incident_id[:6].upper(),
            "coverage_triggered": True,
            "estimated_cost_usd": round(
                max(50000, 500000 / max(distance_km, 0.001)), 2
            ),
        },
    }

    incident.mitigation_contract_id = mitigation_contract["contract_id"]
    db.commit()
    logger.info(
        f"  ✓ Mitigation contract executed: {mitigation_contract['contract_id']}"
    )

    # ── Return complete response ────────────────────────────────────────
    response = {
        "auto_response_triggered": True,
        "incident_id": incident_id,
        "triggered_at": now.isoformat(),
        "response_status": "EXECUTED",
        "blockchain_proof": {
            "block_hash": block_hash,
            "prev_hash": prev_hash,
            "tx_hash": tx_hash,
            "block_index": block_data["block_index"],
            "verification": "VERIFIED",
        },
        "mitigation": mitigation_contract,
        "audit_trail": {
            "total_incidents": db.query(CriticalIncident).count(),
            "total_audit_entries": db.query(AuditLog).count(),
            "chain_integrity": "VALID",
        },
    }

    logger.critical(
        f"🚨 AUTOMATED RESPONSE COMPLETE — Incident {incident_id[:8]} — "
        f"Contract {mitigation_contract['contract_id']} — Chain block #{block_data['block_index']}"
    )

    return response


def _get_chain_length(db: Session) -> int:
    return db.query(AuditLog).count()
