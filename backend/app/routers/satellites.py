"""Satellite API endpoints."""

from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends

from app.database import get_db
from app.models import Satellite, TLERecord
from app.schemas import SatelliteOut

router = APIRouter(prefix="/api", tags=["Satellites"])


@router.get("/satellites", response_model=list[SatelliteOut])
def list_satellites(db: Session = Depends(get_db)):
    """Return all tracked satellites with latest TLE epoch."""
    satellites = db.query(Satellite).order_by(Satellite.name).all()
    results = []
    for sat in satellites:
        latest_tle = (
            db.query(TLERecord)
            .filter(TLERecord.norad_id == sat.norad_id)
            .order_by(TLERecord.created_at.desc())
            .first()
        )
        results.append(
            SatelliteOut(
                id=sat.id,
                name=sat.name,
                norad_id=sat.norad_id,
                operator=sat.operator,
                orbit_type=sat.orbit_type,
                active=sat.active,
                latest_tle_epoch=(
                    latest_tle.epoch.isoformat()
                    if latest_tle and latest_tle.epoch
                    else None
                ),
            )
        )
    return results
