"""SGP4 orbit propagation via Skyfield.

Provides functions to propagate satellite/debris positions
using Two-Line Element sets and the SGP4 model, computing
GCRS Cartesian coordinates and velocity vectors.
"""

import logging
from dataclasses import dataclass
from datetime import datetime, timezone

import numpy as np
from skyfield.api import EarthSatellite, load

logger = logging.getLogger(__name__)

# Load timescale once at module level
_ts = load.timescale()


@dataclass
class PropagationResult:
    """Result of SGP4 orbit propagation at a single instant."""

    position_km: np.ndarray  # [x, y, z] in GCRS frame
    velocity_km_s: np.ndarray  # [vx, vy, vz] in GCRS frame
    time_utc: datetime


def create_satellite(name: str, line1: str, line2: str) -> EarthSatellite:
    """Create a Skyfield EarthSatellite from TLE lines."""
    return EarthSatellite(line1, line2, name, _ts)


def propagate_at(sat: EarthSatellite, dt: datetime) -> PropagationResult:
    """Propagate a satellite to a specific datetime.

    Args:
        sat: Skyfield EarthSatellite object
        dt: Target datetime (UTC)

    Returns:
        PropagationResult with GCRS position and velocity
    """
    t = _ts.from_datetime(dt.replace(tzinfo=timezone.utc) if dt.tzinfo is None else dt)
    geocentric = sat.at(t)

    # Position in km (GCRS frame)
    position = geocentric.position.km

    # Velocity in km/s (GCRS frame)
    velocity = geocentric.velocity.km_per_s

    return PropagationResult(
        position_km=np.array(position),
        velocity_km_s=np.array(velocity),
        time_utc=dt,
    )


def propagate_range(
    sat: EarthSatellite,
    start: datetime,
    end: datetime,
    step_minutes: int = 5,
) -> list[PropagationResult]:
    """Propagate a satellite over a time range.

    Args:
        sat: Skyfield EarthSatellite object
        start: Start datetime (UTC)
        end: End datetime (UTC)
        step_minutes: Time step in minutes

    Returns:
        List of PropagationResult at each time step
    """
    from datetime import timedelta

    results = []
    current = start
    delta = timedelta(minutes=step_minutes)

    while current <= end:
        try:
            result = propagate_at(sat, current)
            results.append(result)
        except Exception as e:
            logger.warning(f"Propagation error at {current}: {e}")
        current += delta

    return results


def get_timescale():
    """Return the shared timescale object."""
    return _ts
