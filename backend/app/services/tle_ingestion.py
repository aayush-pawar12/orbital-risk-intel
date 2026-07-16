"""TLE ingestion from Celestrak.

Fetches Two-Line Element sets for tracked objects and stores them
in the database. Supports batch fetching by NORAD catalog ID.
"""

import logging
from datetime import datetime, timezone
from typing import Optional

import httpx
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models import TLERecord, Satellite, Debris

logger = logging.getLogger(__name__)
settings = get_settings()


def _parse_tle_epoch(line1: str) -> Optional[datetime]:
    """Extract epoch from TLE line 1.

    The epoch is encoded in columns 18-32 as YYDDD.DDDDDDDD
    where YY = 2-digit year and DDD.DDDD = fractional day of year.
    """
    try:
        epoch_str = line1[18:32].strip()
        year_2d = int(epoch_str[:2])
        day_frac = float(epoch_str[2:])
        year = 2000 + year_2d if year_2d < 57 else 1900 + year_2d
        epoch = datetime(year, 1, 1, tzinfo=timezone.utc) + __import__(
            "datetime"
        ).timedelta(days=day_frac - 1)
        return epoch
    except Exception as e:
        logger.warning(f"Failed to parse TLE epoch: {e}")
        return None


async def fetch_tle_from_celestrak(norad_id: int) -> Optional[tuple[str, str, str]]:
    """Fetch latest TLE for a NORAD catalog ID from Celestrak.

    Returns (name, line1, line2) or None on failure.
    """
    url = f"{settings.CELESTRAK_BASE_URL}?CATNR={norad_id}&FORMAT=TLE"
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            text = response.text.strip()
            if not text or "No GP data found" in text:
                logger.warning(f"No TLE data found for NORAD ID {norad_id}")
                return None

            lines = text.strip().splitlines()
            if len(lines) >= 3:
                name = lines[0].strip()
                line1 = lines[1].strip()
                line2 = lines[2].strip()
                return (name, line1, line2)
            elif len(lines) == 2:
                # Some responses omit the name line
                return (f"NORAD-{norad_id}", lines[0].strip(), lines[1].strip())
            else:
                logger.warning(
                    f"Unexpected TLE format for NORAD ID {norad_id}: {text[:200]}"
                )
                return None
    except httpx.HTTPError as e:
        logger.error(f"HTTP error fetching TLE for NORAD ID {norad_id}: {e}")
        return None
    except Exception as e:
        logger.error(f"Error fetching TLE for NORAD ID {norad_id}: {e}")
        return None


def store_tle_record(
    db: Session,
    norad_id: int,
    line1: str,
    line2: str,
    object_type: str,
) -> TLERecord:
    """Store a TLE record in the database."""
    epoch = _parse_tle_epoch(line1)

    satellite_id = None
    debris_id = None

    if object_type == "satellite":
        sat = db.query(Satellite).filter(Satellite.norad_id == norad_id).first()
        if sat:
            satellite_id = sat.id
    else:
        deb = db.query(Debris).filter(Debris.norad_id == norad_id).first()
        if deb:
            debris_id = deb.id

    record = TLERecord(
        object_type=object_type,
        satellite_id=satellite_id,
        debris_id=debris_id,
        norad_id=norad_id,
        line1=line1,
        line2=line2,
        epoch=epoch,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    logger.info(f"Stored TLE for NORAD {norad_id} (epoch: {epoch})")
    return record


def get_latest_tle(db: Session, norad_id: int) -> Optional[TLERecord]:
    """Get the most recent TLE record for a NORAD ID."""
    return (
        db.query(TLERecord)
        .filter(TLERecord.norad_id == norad_id)
        .order_by(TLERecord.created_at.desc())
        .first()
    )


async def refresh_all_tles(db: Session):
    """Fetch and store fresh TLEs for all tracked objects."""
    satellites = db.query(Satellite).all()
    debris_list = db.query(Debris).all()

    total = 0
    errors = 0

    for sat in satellites:
        result = await fetch_tle_from_celestrak(sat.norad_id)
        if result:
            _, line1, line2 = result
            store_tle_record(db, sat.norad_id, line1, line2, "satellite")
            total += 1
        else:
            errors += 1

    for deb in debris_list:
        result = await fetch_tle_from_celestrak(deb.norad_id)
        if result:
            _, line1, line2 = result
            store_tle_record(db, deb.norad_id, line1, line2, "debris")
            total += 1
        else:
            errors += 1

    logger.info(f"TLE refresh complete: {total} updated, {errors} errors")
    return {"updated": total, "errors": errors}
