"""Seed the database with real satellite and debris objects."""

from app.models import Satellite, Debris


def seed_database(db):
    """Insert real tracked satellites and debris objects."""

    satellites = [
        Satellite(name="ISS (ZARYA)", norad_id=25544, operator="NASA / Roscosmos", orbit_type="LEO"),
        Satellite(name="HUBBLE SPACE TELESCOPE", norad_id=20580, operator="NASA", orbit_type="LEO"),
        Satellite(name="NOAA 19", norad_id=33591, operator="NOAA", orbit_type="LEO-SSO"),
        Satellite(name="TERRA", norad_id=25994, operator="NASA", orbit_type="LEO-SSO"),
        Satellite(name="AQUA", norad_id=27424, operator="NASA", orbit_type="LEO-SSO"),
        Satellite(name="LANDSAT 9", norad_id=49260, operator="NASA / USGS", orbit_type="LEO-SSO"),
        Satellite(name="CRYOSAT 2", norad_id=36508, operator="ESA", orbit_type="LEO"),
        Satellite(name="SENTINEL-6A", norad_id=46984, operator="ESA / NASA", orbit_type="LEO"),
    ]

    debris_objects = [
        Debris(name="COSMOS 2251 DEB", norad_id=34454, source="Cosmos 2251 / Iridium 33 Collision (2009)", orbit_type="LEO"),
        Debris(name="FENGYUN 1C DEB", norad_id=29826, source="Fengyun-1C ASAT Test (2007)", orbit_type="LEO"),
        Debris(name="IRIDIUM 33 DEB", norad_id=33776, source="Cosmos 2251 / Iridium 33 Collision (2009)", orbit_type="LEO"),
        Debris(name="SL-8 R/B", norad_id=13552, source="Soviet Launch Vehicle Stage", orbit_type="LEO"),
        Debris(name="COSMOS 1408 DEB", norad_id=49863, source="Cosmos 1408 ASAT Test (2021)", orbit_type="LEO"),
        Debris(name="SL-16 R/B", norad_id=22285, source="Zenit-2 Rocket Body", orbit_type="LEO"),
        Debris(name="CZ-6A DEB", norad_id=54232, source="Long March 6A Debris (2022)", orbit_type="LEO"),
        Debris(name="ARIANE 5 DEB", norad_id=28222, source="Ariane 5 Rocket Body Fragment", orbit_type="LEO-MEO"),
    ]

    for sat in satellites:
        existing = db.query(Satellite).filter(Satellite.norad_id == sat.norad_id).first()
        if not existing:
            db.add(sat)

    for deb in debris_objects:
        existing = db.query(Debris).filter(Debris.norad_id == deb.norad_id).first()
        if not existing:
            db.add(deb)

    db.commit()
    print(f"Seeded {len(satellites)} satellites and {len(debris_objects)} debris objects")
