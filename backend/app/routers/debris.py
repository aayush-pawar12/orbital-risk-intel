"""Debris API endpoints."""

from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends

from app.database import get_db
from app.models import Debris, TLERecord
from app.schemas import DebrisOut

router = APIRouter(prefix="/api", tags=["Debris"])


@router.get("/debris", response_model=list[DebrisOut])
def list_debris(db: Session = Depends(get_db)):
    """Return all tracked debris objects with latest TLE epoch."""
    debris_list = db.query(Debris).order_by(Debris.name).all()
    results = []
    for deb in debris_list:
        latest_tle = (
            db.query(TLERecord)
            .filter(TLERecord.norad_id == deb.norad_id)
            .order_by(TLERecord.created_at.desc())
            .first()
        )
        results.append(DebrisOut(
            id=deb.id,
            name=deb.name,
            norad_id=deb.norad_id,
            source=deb.source,
            orbit_type=deb.orbit_type,
            latest_tle_epoch=latest_tle.epoch.isoformat() if latest_tle and latest_tle.epoch else None,
        ))
    return results
