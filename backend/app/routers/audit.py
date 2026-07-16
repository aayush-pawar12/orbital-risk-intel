"""Audit trail, incident log, and emergency drill simulation endpoints."""

import json
import logging
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import (
    CriticalIncident,
    AuditLog,
    Satellite,
    Debris,
    ConjunctionAssessment,
)
from app.schemas import (
    AssessRequest,
    AssessResponse,
    PositionVector,
    VelocityVector,
    RiskClassification,
)
from app.services.automated_response import execute_critical_response
from app.services.tle_ingestion import get_latest_tle
from app.services.propagation import create_satellite, propagate_at

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


@router.post("/simulate-drill", response_model=AssessResponse)
def simulate_emergency_drill(req: AssessRequest, db: Session = Depends(get_db)):
    """Simulate a Critical Conjunction (< 1 km threshold breach) to demonstrate the Core USP.

    Generates a simulated high-risk close encounter (e.g. 0.342 km separation),
    triggers autonomous response, logs the incident, generates SHA-256 block proof,
    and returns the full assessment with auto_response populated.
    """
    satellite = db.query(Satellite).filter(Satellite.id == req.satellite_id).first()
    if not satellite:
        raise HTTPException(
            status_code=404, detail=f"Satellite ID {req.satellite_id} not found"
        )

    debris = db.query(Debris).filter(Debris.id == req.debris_id).first()
    if not debris:
        raise HTTPException(
            status_code=404, detail=f"Debris ID {req.debris_id} not found"
        )

    sat_tle = get_latest_tle(db, satellite.norad_id)
    deb_tle = get_latest_tle(db, debris.norad_id)

    now = datetime.now(timezone.utc)
    if sat_tle and deb_tle:
        sat_obj = create_satellite(satellite.name, sat_tle.line1, sat_tle.line2)
        deb_obj = create_satellite(debris.name, deb_tle.line1, deb_tle.line2)
        sat_state = propagate_at(sat_obj, now)
        deb_state = propagate_at(deb_obj, now)
        sat_pos = sat_state.position_km.tolist()
        # Simulate debris right next to satellite (0.342 km separation)
        deb_pos = [sat_pos[0] + 0.2, sat_pos[1] + 0.2, sat_pos[2] + 0.18]
        sat_vel = sat_state.velocity_km_s.tolist()
        deb_vel = deb_state.velocity_km_s.tolist()
    else:
        sat_pos = [6780.12, 120.45, -340.11]
        deb_pos = [6780.32, 120.65, -339.93]
        sat_vel = [7.54, -1.21, 0.43]
        deb_vel = [-6.89, 2.11, -1.05]

    simulated_dist_km = 0.3421  # < 1.0 km critical threshold

    # Store assessment record
    assessment = ConjunctionAssessment(
        satellite_id=satellite.id,
        debris_id=debris.id,
        distance_km=simulated_dist_km,
        risk_level="CRITICAL",
        satellite_position=json.dumps(sat_pos),
        debris_position=json.dumps(deb_pos),
    )
    db.add(assessment)
    db.commit()

    # Trigger Automated Critical Response (Core USP)
    auto_response = execute_critical_response(
        db=db,
        satellite_name=satellite.name,
        satellite_norad_id=satellite.norad_id,
        debris_name=debris.name,
        debris_norad_id=debris.norad_id,
        distance_km=simulated_dist_km,
        tca_utc=now,
        satellite_position=sat_pos,
        debris_position=deb_pos,
    )

    import numpy as np

    sat_vel_mag = float(np.linalg.norm(sat_vel))
    deb_vel_mag = float(np.linalg.norm(deb_vel))

    return AssessResponse(
        satellite_name=satellite.name,
        satellite_norad_id=satellite.norad_id,
        debris_name=debris.name,
        debris_norad_id=debris.norad_id,
        timestamp=now.isoformat(),
        satellite_position=PositionVector(
            x_km=round(sat_pos[0], 4),
            y_km=round(sat_pos[1], 4),
            z_km=round(sat_pos[2], 4),
        ),
        debris_position=PositionVector(
            x_km=round(deb_pos[0], 4),
            y_km=round(deb_pos[1], 4),
            z_km=round(deb_pos[2], 4),
        ),
        satellite_velocity=VelocityVector(
            vx_km_s=round(sat_vel[0], 4),
            vy_km_s=round(sat_vel[1], 4),
            vz_km_s=round(sat_vel[2], 4),
            magnitude_km_s=round(sat_vel_mag, 4),
        ),
        debris_velocity=VelocityVector(
            vx_km_s=round(deb_vel[0], 4),
            vy_km_s=round(deb_vel[1], 4),
            vz_km_s=round(deb_vel[2], 4),
            magnitude_km_s=round(deb_vel_mag, 4),
        ),
        risk=RiskClassification(
            distance_km=simulated_dist_km,
            risk_level="CRITICAL",
            threshold_used=1.0,
        ),
        auto_response=auto_response,
    )
