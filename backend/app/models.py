"""SQLAlchemy ORM models for the Orbital Risk Intelligence System."""

from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text, Index
)
from sqlalchemy.orm import relationship
from app.database import Base


class Satellite(Base):
    __tablename__ = "satellites"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    norad_id = Column(Integer, unique=True, nullable=False, index=True)
    operator = Column(String(100), nullable=False, default="Unknown")
    orbit_type = Column(String(50), nullable=False, default="LEO")
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    tle_records = relationship("TLERecord", back_populates="satellite", foreign_keys="TLERecord.satellite_id")
    assessments = relationship("ConjunctionAssessment", back_populates="satellite")

    def __repr__(self):
        return f"<Satellite(name='{self.name}', norad_id={self.norad_id})>"


class Debris(Base):
    __tablename__ = "debris"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    norad_id = Column(Integer, unique=True, nullable=False, index=True)
    source = Column(String(200), nullable=False, default="Unknown")
    orbit_type = Column(String(50), nullable=False, default="LEO")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    tle_records = relationship("TLERecord", back_populates="debris", foreign_keys="TLERecord.debris_id")
    assessments = relationship("ConjunctionAssessment", back_populates="debris")

    def __repr__(self):
        return f"<Debris(name='{self.name}', norad_id={self.norad_id})>"


class TLERecord(Base):
    __tablename__ = "tle_records"

    id = Column(Integer, primary_key=True, index=True)
    object_type = Column(String(20), nullable=False)  # "satellite" or "debris"
    satellite_id = Column(Integer, ForeignKey("satellites.id"), nullable=True)
    debris_id = Column(Integer, ForeignKey("debris.id"), nullable=True)
    norad_id = Column(Integer, nullable=False, index=True)
    line1 = Column(Text, nullable=False)
    line2 = Column(Text, nullable=False)
    epoch = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    satellite = relationship("Satellite", back_populates="tle_records", foreign_keys=[satellite_id])
    debris = relationship("Debris", back_populates="tle_records", foreign_keys=[debris_id])

    __table_args__ = (
        Index("ix_tle_records_object_created", "object_type", "norad_id", "created_at"),
    )

    def __repr__(self):
        return f"<TLERecord(norad_id={self.norad_id}, epoch={self.epoch})>"


class ConjunctionAssessment(Base):
    __tablename__ = "conjunction_assessments"

    id = Column(Integer, primary_key=True, index=True)
    satellite_id = Column(Integer, ForeignKey("satellites.id"), nullable=False)
    debris_id = Column(Integer, ForeignKey("debris.id"), nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    distance_km = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False)
    satellite_position = Column(String(200), nullable=True)  # JSON: [x, y, z]
    debris_position = Column(String(200), nullable=True)
    min_distance_km = Column(Float, nullable=True)
    tca_utc = Column(DateTime, nullable=True)
    predicted_risk = Column(String(20), nullable=True)

    satellite = relationship("Satellite", back_populates="assessments")
    debris = relationship("Debris", back_populates="assessments")

    __table_args__ = (
        Index("ix_conjunction_sat_debris", "satellite_id", "debris_id"),
    )

    def __repr__(self):
        return f"<ConjunctionAssessment(sat={self.satellite_id}, debris={self.debris_id}, risk={self.risk_level})>"


class CriticalIncident(Base):
    """Autonomous incident record — created automatically on CRITICAL breach."""
    __tablename__ = "critical_incidents"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(String(64), unique=True, nullable=False, index=True)
    satellite_name = Column(String(200), nullable=False)
    satellite_norad_id = Column(Integer, nullable=False)
    debris_name = Column(String(200), nullable=False)
    debris_norad_id = Column(Integer, nullable=False)
    distance_km = Column(Float, nullable=False)
    tca_utc = Column(DateTime, nullable=True)
    satellite_position = Column(Text, nullable=True)
    debris_position = Column(Text, nullable=True)
    response_status = Column(String(50), nullable=False, default="EXECUTED")
    mitigation_action = Column(String(200), nullable=True)
    mitigation_contract_id = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f"<CriticalIncident(id={self.incident_id[:8]}, dist={self.distance_km:.4f}km)>"


class AuditLog(Base):
    """Blockchain-style immutable audit log with SHA-256 hash chain."""
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(String(64), nullable=False, index=True)
    event_type = Column(String(100), nullable=False)
    block_hash = Column(String(64), nullable=False, unique=True)
    prev_hash = Column(String(64), nullable=False)
    tx_hash = Column(String(42), nullable=False)
    block_data = Column(Text, nullable=False)
    verification_status = Column(String(20), nullable=False, default="VERIFIED")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f"<AuditLog(tx={self.tx_hash[:16]}, block={self.block_hash[:16]})>"

