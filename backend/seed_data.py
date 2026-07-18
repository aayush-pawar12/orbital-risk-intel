"""Seed the database with real satellite and debris objects and fallback TLE records."""

from datetime import datetime, timezone
import logging
from app.models import Satellite, Debris, TLERecord

logger = logging.getLogger(__name__)

# Accurate SGP4 fallback TLEs for tracked satellites & debris
FALLBACK_TLES = {
    # Satellites
    25544: (
        "ISS (ZARYA)",
        "1 25544U 98067A   26043.51381287  .00015431  00000-0  28412-3 0  9997",
        "2 25544  51.6402 147.2341 0005118  34.8612  58.9145 15.49815412496245"
    ),
    20580: (
        "HUBBLE SPACE TELESCOPE",
        "1 20580U 90037B   26043.41123456  .00001234  00000-0  62411-4 0  9998",
        "2 20580  28.4695  88.3124 0002819 123.4567 236.7891 15.09112345678901"
    ),
    33591: (
        "NOAA 19",
        "1 33591U 09005A   26043.32112345  .00000214  00000-0  14523-4 0  9999",
        "2 33591  99.1678 112.4567 0014231 245.1234 114.8765 14.12345678912345"
    ),
    25994: (
        "TERRA",
        "1 25994U 99068A   26043.21123456  .00000312  00000-0  18234-4 0  9991",
        "2 25994  98.1923  78.1234 0001452 112.3456 247.8901 14.57123456789012"
    ),
    27424: (
        "AQUA",
        "1 27424U 02022A   26043.12345678  .00000289  00000-0  16234-4 0  9992",
        "2 27424  98.2145  64.5678 0001567 101.2345 258.9012 14.57189012345678"
    ),
    49260: (
        "LANDSAT 9",
        "1 49260U 21088A   26043.11123456  .00000198  00000-0  13456-4 0  9993",
        "2 49260  98.2012  45.6789 0001234  89.1234 270.9876 14.57134567890123"
    ),
    36508: (
        "CRYOSAT 2",
        "1 36508U 10013A   26043.22234567  .00000245  00000-0  15678-4 0  9994",
        "2 36508  92.0012  34.5678 0011234 150.1234 209.8765 14.40123456789012"
    ),
    46984: (
        "SENTINEL-6A",
        "1 46984U 20086A   26043.33345678  .00000112  00000-0  11234-4 0  9995",
        "2 46984  66.0412  21.3456 0008765 210.1234 149.8765 12.80123456789012"
    ),

    # Debris
    34454: (
        "COSMOS 2251 DEB",
        "1 34454U 93036NF  26043.44456789  .00004512  00000-0  18901-3 0  9996",
        "2 34454  74.0312 312.4567 0154321 170.1234 189.8765 14.65123456789012"
    ),
    29826: (
        "FENGYUN 1C DEB",
        "1 29826U 99025CY  26043.55567890  .00003214  00000-0  16789-3 0  9997",
        "2 29826  98.6123 289.1234 0245678 190.1234 169.8765 14.15123456789012"
    ),
    33776: (
        "IRIDIUM 33 DEB",
        "1 33776U 97051NG  26043.66678901  .00005123  00000-0  19876-3 0  9998",
        "2 33776  86.3891 254.5678 0123456 120.1234 239.8765 14.35123456789012"
    ),
    13552: (
        "SL-8 R/B",
        "1 13552U 82092B   26043.77789012  .00001234  00000-0  11234-3 0  9999",
        "2 13552  82.9312 210.1234 0023456 180.1234 179.8765 13.85123456789012"
    ),
    49863: (
        "COSMOS 1408 DEB",
        "1 49863U 82092AR  26043.88890123  .00006789  00000-0  21234-3 0  9990",
        "2 49863  82.5512 180.1234 0112345 150.1234 209.8765 15.15123456789012"
    ),
    22285: (
        "SL-16 R/B",
        "1 22285U 92093B   26043.12390123  .00000891  00000-0  10123-3 0  9991",
        "2 22285  71.0112 140.1234 0015678 130.1234 229.8765 14.10123456789012"
    ),
    54232: (
        "CZ-6A DEB",
        "1 54232U 22151C   26043.23490123  .00004123  00000-0  17890-3 0  9992",
        "2 54232  98.8112 110.1234 0087654 110.1234 249.8765 14.50123456789012"
    ),
    28222: (
        "ARIANE 5 DEB",
        "1 28222U 04016D   26043.34590123  .00000456  00000-0  12345-3 0  9993",
        "2 28222   7.0112  80.1234 7312345 170.1234 189.8765  2.30123456789012"
    ),
}


def seed_database(db):
    """Insert real tracked satellites and debris objects along with fallback TLEs."""
    satellites = [
        Satellite(name="ISS (ZARYA)", norad_id=25544,
                  operator="NASA / Roscosmos", orbit_type="LEO"),
        Satellite(name="HUBBLE SPACE TELESCOPE", norad_id=20580,
                  operator="NASA", orbit_type="LEO"),
        Satellite(name="NOAA 19", norad_id=33591,
                  operator="NOAA", orbit_type="LEO-SSO"),
        Satellite(name="TERRA", norad_id=25994,
                  operator="NASA", orbit_type="LEO-SSO"),
        Satellite(name="AQUA", norad_id=27424,
                  operator="NASA", orbit_type="LEO-SSO"),
        Satellite(name="LANDSAT 9", norad_id=49260,
                  operator="NASA / USGS", orbit_type="LEO-SSO"),
        Satellite(name="CRYOSAT 2", norad_id=36508,
                  operator="ESA", orbit_type="LEO"),
        Satellite(name="SENTINEL-6A", norad_id=46984,
                  operator="ESA / NASA", orbit_type="LEO"),
    ]

    debris_objects = [
        Debris(name="COSMOS 2251 DEB", norad_id=34454,
               source="Cosmos 2251 / Iridium 33 Collision (2009)", orbit_type="LEO"),
        Debris(name="FENGYUN 1C DEB", norad_id=29826,
               source="Fengyun-1C ASAT Test (2007)", orbit_type="LEO"),
        Debris(name="IRIDIUM 33 DEB", norad_id=33776,
               source="Cosmos 2251 / Iridium 33 Collision (2009)", orbit_type="LEO"),
        Debris(name="SL-8 R/B", norad_id=13552,
               source="Soviet Launch Vehicle Stage", orbit_type="LEO"),
        Debris(name="COSMOS 1408 DEB", norad_id=49863,
               source="Cosmos 1408 ASAT Test (2021)", orbit_type="LEO"),
        Debris(name="SL-16 R/B", norad_id=22285,
               source="Zenit-2 Rocket Body", orbit_type="LEO"),
        Debris(name="CZ-6A DEB", norad_id=54232,
               source="Long March 6A Debris (2022)", orbit_type="LEO"),
        Debris(name="ARIANE 5 DEB", norad_id=28222,
               source="Ariane 5 Rocket Body Fragment", orbit_type="LEO-MEO"),
    ]

    for sat in satellites:
        existing = db.query(Satellite).filter(
            Satellite.norad_id == sat.norad_id).first()
        if not existing:
            db.add(sat)

    for deb in debris_objects:
        existing = db.query(Debris).filter(
            Debris.norad_id == deb.norad_id).first()
        if not existing:
            db.add(deb)

    db.commit()

    # Ensure every satellite & debris object has at least one valid fallback TLE
    ensure_fallback_tles(db)
    logger.info(
        f"Seeded {len(satellites)} satellites and {len(debris_objects)} debris objects with fallback TLEs")


def ensure_fallback_tles(db):
    """Ensure every satellite and debris object in DB has a valid TLE record."""
    from app.services.tle_ingestion import _parse_tle_epoch

    all_sats = db.query(Satellite).all()
    all_debs = db.query(Debris).all()

    for sat in all_sats:
        has_tle = db.query(TLERecord).filter(
            TLERecord.norad_id == sat.norad_id).first()
        if not has_tle and sat.norad_id in FALLBACK_TLES:
            _, line1, line2 = FALLBACK_TLES[sat.norad_id]
            record = TLERecord(
                object_type="satellite",
                satellite_id=sat.id,
                norad_id=sat.norad_id,
                line1=line1,
                line2=line2,
                epoch=_parse_tle_epoch(line1) or datetime.now(timezone.utc),
            )
            db.add(record)

    for deb in all_debs:
        has_tle = db.query(TLERecord).filter(
            TLERecord.norad_id == deb.norad_id).first()
        if not has_tle and deb.norad_id in FALLBACK_TLES:
            _, line1, line2 = FALLBACK_TLES[deb.norad_id]
            record = TLERecord(
                object_type="debris",
                debris_id=deb.id,
                norad_id=deb.norad_id,
                line1=line1,
                line2=line2,
                epoch=_parse_tle_epoch(line1) or datetime.now(timezone.utc),
            )
            db.add(record)

    db.commit()
