"""Pydantic schemas for API request/response validation."""

from pydantic import BaseModel, Field
from typing import Optional

# ── Satellite ──────────────────────────────────────────────────────────


class SatelliteOut(BaseModel):
    id: int
    name: str
    norad_id: int
    operator: str
    orbit_type: str
    active: bool
    latest_tle_epoch: Optional[str] = None

    model_config = {"from_attributes": True}


# ── Debris ─────────────────────────────────────────────────────────────


class DebrisOut(BaseModel):
    id: int
    name: str
    norad_id: int
    source: str
    orbit_type: str
    latest_tle_epoch: Optional[str] = None

    model_config = {"from_attributes": True}


# ── Assessment ─────────────────────────────────────────────────────────


class AssessRequest(BaseModel):
    satellite_id: int
    debris_id: int


class PositionVector(BaseModel):
    x_km: float
    y_km: float
    z_km: float
    frame: str = "GCRS"


class VelocityVector(BaseModel):
    vx_km_s: float
    vy_km_s: float
    vz_km_s: float
    magnitude_km_s: float


class RiskClassification(BaseModel):
    distance_km: float
    risk_level: str  # CRITICAL | WARNING | SAFE
    threshold_used: float


class AssessResponse(BaseModel):
    satellite_name: str
    satellite_norad_id: int
    debris_name: str
    debris_norad_id: int
    timestamp: str
    propagation_model: str = "SGP4"
    coordinate_frame: str = "GCRS"
    satellite_position: PositionVector
    debris_position: PositionVector
    satellite_velocity: VelocityVector
    debris_velocity: VelocityVector
    risk: RiskClassification
    auto_response: Optional[dict] = None  # Populated when CRITICAL threshold breached


# ── Prediction ─────────────────────────────────────────────────────────


class PredictRequest(BaseModel):
    satellite_id: int
    debris_id: int
    window_hours: int = Field(default=24, ge=1, le=72)
    step_minutes: int = Field(default=5, ge=1, le=60)


class TimelinePoint(BaseModel):
    time_utc: str
    distance_km: float
    risk_level: str


class PredictResponse(BaseModel):
    satellite_name: str
    debris_name: str
    propagation_model: str = "SGP4"
    window_hours: int
    step_minutes: int
    total_steps: int
    min_distance_km: float
    tca_utc: str
    predicted_risk: str
    confidence_level: str
    timeline: list[TimelinePoint]
    auto_response: Optional[dict] = None  # Populated when CRITICAL threshold breached


# ── System Status ──────────────────────────────────────────────────────


class SystemStatus(BaseModel):
    status: str
    app_name: str
    version: str
    satellite_count: int
    debris_count: int
    tle_record_count: int
    last_tle_update: Optional[str]
    propagation_model: str = "SGP4 (Skyfield)"
    coordinate_frame: str = "GCRS"
    risk_thresholds: dict
    total_incidents: int = 0
    total_audit_entries: int = 0
