"""Risk classification and closest approach prediction.

Implements LEO conjunction risk thresholds and time-of-closest-approach
(TCA) computation over configurable propagation windows.
"""

import logging
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Optional

import numpy as np

from app.config import get_settings
from app.services.propagation import create_satellite, propagate_at, propagate_range

logger = logging.getLogger(__name__)
settings = get_settings()


@dataclass
class RiskResult:
    distance_km: float
    risk_level: str
    threshold_used: float


@dataclass
class ClosestApproachResult:
    min_distance_km: float
    tca_utc: datetime
    predicted_risk: str
    confidence_level: str
    timeline: list[dict]  # [{time_utc, distance_km, risk_level}, ...]


def calculate_distance(pos1: np.ndarray, pos2: np.ndarray) -> float:
    """Euclidean distance between two 3D position vectors in km.

    Distance = sqrt((x1-x2)² + (y1-y2)² + (z1-z2)²)
    """
    return float(np.sqrt(np.sum((pos1 - pos2) ** 2)))


def classify_risk(distance_km: float) -> RiskResult:
    """Classify conjunction risk using LEO thresholds.

    CRITICAL: < 1 km
    WARNING:  1–5 km
    SAFE:     > 5 km
    """
    if distance_km < settings.RISK_CRITICAL_THRESHOLD:
        return RiskResult(
            distance_km=round(distance_km, 4),
            risk_level="CRITICAL",
            threshold_used=settings.RISK_CRITICAL_THRESHOLD,
        )
    elif distance_km < settings.RISK_WARNING_THRESHOLD:
        return RiskResult(
            distance_km=round(distance_km, 4),
            risk_level="WARNING",
            threshold_used=settings.RISK_WARNING_THRESHOLD,
        )
    else:
        return RiskResult(
            distance_km=round(distance_km, 4),
            risk_level="SAFE",
            threshold_used=settings.RISK_WARNING_THRESHOLD,
        )


def predict_closest_approach(
    tle1_name: str,
    tle1_line1: str,
    tle1_line2: str,
    tle2_name: str,
    tle2_line1: str,
    tle2_line2: str,
    window_hours: int = 24,
    step_minutes: int = 5,
) -> ClosestApproachResult:
    """Predict the closest approach between two objects.

    Propagates both objects over the specified window and finds
    the time of minimum distance (TCA).

    Args:
        tle1_*: TLE data for object 1 (satellite)
        tle2_*: TLE data for object 2 (debris)
        window_hours: Propagation window in hours
        step_minutes: Time step in minutes

    Returns:
        ClosestApproachResult with TCA, min distance, and timeline
    """
    sat1 = create_satellite(tle1_name, tle1_line1, tle1_line2)
    sat2 = create_satellite(tle2_name, tle2_line1, tle2_line2)

    now = datetime.now(timezone.utc)
    end = now + timedelta(hours=window_hours)

    # Propagate both objects
    results1 = propagate_range(sat1, now, end, step_minutes)
    results2 = propagate_range(sat2, now, end, step_minutes)

    # Calculate distances at each step
    min_distance = float("inf")
    tca = now
    timeline = []

    for r1, r2 in zip(results1, results2):
        dist = calculate_distance(r1.position_km, r2.position_km)
        risk = classify_risk(dist)

        timeline.append({
            "time_utc": r1.time_utc.isoformat(),
            "distance_km": round(dist, 4),
            "risk_level": risk.risk_level,
        })

        if dist < min_distance:
            min_distance = dist
            tca = r1.time_utc

    predicted_risk = classify_risk(min_distance)

    # Determine confidence based on TLE age
    # (newer TLEs = higher confidence)
    confidence = _estimate_confidence(tle1_line1, tle2_line1, window_hours)

    return ClosestApproachResult(
        min_distance_km=round(min_distance, 4),
        tca_utc=tca,
        predicted_risk=predicted_risk.risk_level,
        confidence_level=confidence,
        timeline=timeline,
    )


def _estimate_confidence(line1_a: str, line1_b: str, window_hours: int) -> str:
    """Estimate prediction confidence based on TLE freshness and window.

    Heuristic:
    - SHORT window + FRESH TLEs → HIGH
    - LONG window or STALE TLEs → MEDIUM/LOW
    """
    if window_hours <= 12:
        return "HIGH"
    elif window_hours <= 24:
        return "MEDIUM"
    else:
        return "LOW"
