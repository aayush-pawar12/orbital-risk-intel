"""Conjunction assessment and prediction endpoints."""

import json
import logging
from datetime import datetime, timezone

from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException

from app.database import get_db
from app.models import (
    Satellite,
    Debris,
    TLERecord,
    ConjunctionAssessment,
    CriticalIncident,
    AuditLog,
)
from app.schemas import (
    AssessRequest,
    AssessResponse,
    PredictRequest,
    PredictResponse,
    PositionVector,
    VelocityVector,
    RiskClassification,
    TimelinePoint,
    SystemStatus,
)
from app.config import get_settings
from app.services.propagation import create_satellite, propagate_at
from app.services.risk_engine import (
    calculate_distance,
    classify_risk,
    predict_closest_approach,
)
from app.services.tle_ingestion import get_latest_tle
from app.services.automated_response import execute_critical_response

logger = logging.getLogger(__name__)
settings = get_settings()
router = APIRouter(prefix="/api", tags=["Assessment"])


def _get_tle_or_404(db: Session, norad_id: int, obj_name: str):
    tle = get_latest_tle(db, norad_id)
    if not tle:
        raise HTTPException(
            status_code=404,
            detail=f"No TLE data found for {obj_name} (NORAD {norad_id}). Run TLE ingestion first.",
        )
    return tle


@router.post("/assess", response_model=AssessResponse)
def assess_conjunction(req: AssessRequest, db: Session = Depends(get_db)):
    """Real-time conjunction assessment between a satellite and debris object.

    Propagates both objects to the current time using SGP4 and computes
    the Euclidean separation distance in GCRS frame.

    *** CORE USP: If distance < 1 km, AUTOMATICALLY triggers critical response ***
    """
    # Look up objects
    satellite = db.query(Satellite).filter(
        Satellite.id == req.satellite_id).first()
    if not satellite:
        raise HTTPException(
            status_code=404, detail=f"Satellite ID {req.satellite_id} not found"
        )

    debris = db.query(Debris).filter(Debris.id == req.debris_id).first()
    if not debris:
        raise HTTPException(
            status_code=404, detail=f"Debris ID {req.debris_id} not found"
        )

    # Get latest TLEs
    sat_tle = _get_tle_or_404(db, satellite.norad_id, satellite.name)
    deb_tle = _get_tle_or_404(db, debris.norad_id, debris.name)

    # Propagate to now
    now = datetime.now(timezone.utc)
    sat_obj = create_satellite(satellite.name, sat_tle.line1, sat_tle.line2)
    deb_obj = create_satellite(debris.name, deb_tle.line1, deb_tle.line2)

    sat_state = propagate_at(sat_obj, now)
    deb_state = propagate_at(deb_obj, now)

    # Calculate distance and risk
    distance = calculate_distance(sat_state.position_km, deb_state.position_km)
    risk = classify_risk(distance)

    import numpy as np

    sat_vel_mag = float(np.linalg.norm(sat_state.velocity_km_s))
    deb_vel_mag = float(np.linalg.norm(deb_state.velocity_km_s))

    # Store assessment
    assessment = ConjunctionAssessment(
        satellite_id=satellite.id,
        debris_id=debris.id,
        distance_km=risk.distance_km,
        risk_level=risk.risk_level,
        satellite_position=json.dumps(sat_state.position_km.tolist()),
        debris_position=json.dumps(deb_state.position_km.tolist()),
    )
    db.add(assessment)
    db.commit()

    # ═══════════════════════════════════════════════════════════════════
    # ██  CORE USP: AUTOMATED CRITICAL RESPONSE                      ██
    # ═══════════════════════════════════════════════════════════════════
    auto_response = None
    if risk.distance_km < settings.RISK_CRITICAL_THRESHOLD:
        logger.critical(
            f"🚨 CRITICAL THRESHOLD BREACH DETECTED — Auto-executing response"
        )
        auto_response = execute_critical_response(
            db=db,
            satellite_name=satellite.name,
            satellite_norad_id=satellite.norad_id,
            debris_name=debris.name,
            debris_norad_id=debris.norad_id,
            distance_km=risk.distance_km,
            satellite_position=sat_state.position_km.tolist(),
            debris_position=deb_state.position_km.tolist(),
        )

    return AssessResponse(
        satellite_name=satellite.name,
        satellite_norad_id=satellite.norad_id,
        debris_name=debris.name,
        debris_norad_id=debris.norad_id,
        timestamp=now.isoformat(),
        satellite_position=PositionVector(
            x_km=round(sat_state.position_km[0], 4),
            y_km=round(sat_state.position_km[1], 4),
            z_km=round(sat_state.position_km[2], 4),
        ),
        debris_position=PositionVector(
            x_km=round(deb_state.position_km[0], 4),
            y_km=round(deb_state.position_km[1], 4),
            z_km=round(deb_state.position_km[2], 4),
        ),
        satellite_velocity=VelocityVector(
            vx_km_s=round(sat_state.velocity_km_s[0], 4),
            vy_km_s=round(sat_state.velocity_km_s[1], 4),
            vz_km_s=round(sat_state.velocity_km_s[2], 4),
            magnitude_km_s=round(sat_vel_mag, 4),
        ),
        debris_velocity=VelocityVector(
            vx_km_s=round(deb_state.velocity_km_s[0], 4),
            vy_km_s=round(deb_state.velocity_km_s[1], 4),
            vz_km_s=round(deb_state.velocity_km_s[2], 4),
            magnitude_km_s=round(deb_vel_mag, 4),
        ),
        risk=RiskClassification(
            distance_km=risk.distance_km,
            risk_level=risk.risk_level,
            threshold_used=risk.threshold_used,
        ),
        auto_response=auto_response,
    )


@router.post("/predict", response_model=PredictResponse)
def predict_conjunction(req: PredictRequest, db: Session = Depends(get_db)):
    """Predict future closest approach between a satellite and debris object.

    Propagates both objects for the specified window and identifies the
    Time of Closest Approach (TCA).

    *** CORE USP: If min distance < 1 km, AUTOMATICALLY triggers critical response ***
    """
    satellite = db.query(Satellite).filter(
        Satellite.id == req.satellite_id).first()
    if not satellite:
        raise HTTPException(
            status_code=404, detail=f"Satellite ID {req.satellite_id} not found"
        )

    debris = db.query(Debris).filter(Debris.id == req.debris_id).first()
    if not debris:
        raise HTTPException(
            status_code=404, detail=f"Debris ID {req.debris_id} not found"
        )

    sat_tle = _get_tle_or_404(db, satellite.norad_id, satellite.name)
    deb_tle = _get_tle_or_404(db, debris.norad_id, debris.name)

    result = predict_closest_approach(
        tle1_name=satellite.name,
        tle1_line1=sat_tle.line1,
        tle1_line2=sat_tle.line2,
        tle2_name=debris.name,
        tle2_line1=deb_tle.line1,
        tle2_line2=deb_tle.line2,
        window_hours=req.window_hours,
        step_minutes=req.step_minutes,
    )

    # Store the prediction
    assessment = ConjunctionAssessment(
        satellite_id=satellite.id,
        debris_id=debris.id,
        distance_km=result.min_distance_km,
        risk_level=result.predicted_risk,
        min_distance_km=result.min_distance_km,
        tca_utc=result.tca_utc,
        predicted_risk=result.predicted_risk,
    )
    db.add(assessment)
    db.commit()

    # ═══════════════════════════════════════════════════════════════════
    # ██  CORE USP: AUTOMATED CRITICAL RESPONSE ON PREDICTION         ██
    # ═══════════════════════════════════════════════════════════════════
    auto_response = None
    if result.min_distance_km < settings.RISK_CRITICAL_THRESHOLD:
        logger.critical(
            f"🚨 PREDICTED CRITICAL BREACH — TCA auto-response triggered")
        auto_response = execute_critical_response(
            db=db,
            satellite_name=satellite.name,
            satellite_norad_id=satellite.norad_id,
            debris_name=debris.name,
            debris_norad_id=debris.norad_id,
            distance_km=result.min_distance_km,
            tca_utc=result.tca_utc,
        )

    return PredictResponse(
        satellite_name=satellite.name,
        debris_name=debris.name,
        window_hours=req.window_hours,
        step_minutes=req.step_minutes,
        total_steps=len(result.timeline),
        min_distance_km=result.min_distance_km,
        tca_utc=result.tca_utc.isoformat(),
        predicted_risk=result.predicted_risk,
        confidence_level=result.confidence_level,
        timeline=[TimelinePoint(**point) for point in result.timeline],
        auto_response=auto_response,
    )


@router.get("/status", response_model=SystemStatus)
def system_status(db: Session = Depends(get_db)):
    """System health and status."""
    sat_count = db.query(Satellite).count()
    deb_count = db.query(Debris).count()
    tle_count = db.query(TLERecord).count()
    incident_count = db.query(CriticalIncident).count()
    audit_count = db.query(AuditLog).count()

    latest_tle = db.query(TLERecord).order_by(
        TLERecord.created_at.desc()).first()

    return SystemStatus(
        status="operational",
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        satellite_count=sat_count,
        debris_count=deb_count,
        tle_record_count=tle_count,
        last_tle_update=latest_tle.created_at.isoformat() if latest_tle else None,
        risk_thresholds={
            "critical_km": settings.RISK_CRITICAL_THRESHOLD,
            "warning_km": settings.RISK_WARNING_THRESHOLD,
        },
        total_incidents=incident_count,
        total_audit_entries=audit_count,
    )
