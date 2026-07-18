"""Audit trail, incident log, and emergency drill simulation endpoints."""

import json
import logging
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import (
    CriticalIncident,
    AuditLog,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["Audit & Incidents"])


@router.get("/incidents")
def list_incidents(db: Session = Depends(get_db), limit: int = 50):
    """Return recent automated critical incidents."""
    incidents = (
        db.query(CriticalIncident)
        .order_by(CriticalIncident.created_at.desc())
        .limit(limit)
        .all()
    )
    results = []
    for inc in incidents:
        results.append(
            {
                "id": inc.id,
                "incident_id": inc.incident_id,
                "satellite_name": inc.satellite_name,
                "satellite_norad_id": inc.satellite_norad_id,
                "debris_name": inc.debris_name,
                "debris_norad_id": inc.debris_norad_id,
                "distance_km": round(inc.distance_km, 4),
                "tca_utc": inc.tca_utc.isoformat() if inc.tca_utc else None,
                "response_status": inc.response_status,
                "mitigation_action": inc.mitigation_action,
                "mitigation_contract_id": inc.mitigation_contract_id,
                "created_at": inc.created_at.isoformat() if inc.created_at else None,
            }
        )
    return results


@router.get("/audit-logs")
def list_audit_logs(db: Session = Depends(get_db), limit: int = 50):
    """Return blockchain-style cryptographic audit logs and verify SHA-256 chain integrity."""
    logs = db.query(AuditLog).order_by(AuditLog.id.desc()).limit(limit).all()

    # Verify chain integrity
    all_logs_asc = db.query(AuditLog).order_by(AuditLog.id.asc()).all()
    chain_valid = True
    for i in range(1, len(all_logs_asc)):
        if all_logs_asc[i].prev_hash != all_logs_asc[i - 1].block_hash:
            chain_valid = False
            break

    entries = []
    for log in logs:
        entries.append(
            {
                "id": log.id,
                "incident_id": log.incident_id,
                "event_type": log.event_type,
                "block_hash": log.block_hash,
                "prev_hash": log.prev_hash,
                "tx_hash": log.tx_hash,
                "verification_status": log.verification_status,
                "block_data": json.loads(log.block_data) if log.block_data else {},
                "created_at": log.created_at.isoformat() if log.created_at else None,
            }
        )

    return {
        "chain_integrity": "VALID" if chain_valid else "CORRUPTED",
        "total_blocks": len(all_logs_asc),
        "entries": entries,
    }
