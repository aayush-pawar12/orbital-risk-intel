"""FastAPI application entry point.

Orbital Risk Intelligence System – Real-Time Space Debris
Collision Assessment Platform.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import init_db, SessionLocal
from app.routers import satellites, debris, assessment, audit
from app.scheduler import start_scheduler, stop_scheduler
from app.services.tle_ingestion import refresh_all_tles

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(name)-30s | %(levelname)-7s | %(message)s",
)
logger = logging.getLogger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown lifecycle."""
    logger.info(f"🚀 Starting {settings.APP_NAME} v{settings.APP_VERSION}")

    # Initialize database tables
    init_db()
    logger.info("Database initialized")

    # Seed the database and ensure fallback TLE records exist
    from app.models import Satellite
    from seed_data import seed_database, ensure_fallback_tles

    db = SessionLocal()
    try:
        if db.query(Satellite).count() == 0:
            logger.info("Empty database detected — running seed...")
            seed_database(db)
            logger.info("Seed complete")
        else:
            ensure_fallback_tles(db)

        # Attempt to refresh TLEs from Celestrak safely
        try:
            logger.info("Fetching TLE data from Celestrak...")
            await refresh_all_tles(db)
            logger.info("TLE fetch check complete")
        except Exception as e:
            logger.warning(f"Live TLE refresh warning (using fallback TLEs): {e}")
    finally:
        db.close()

    # Start background TLE refresh scheduler
    start_scheduler()

    yield

    # Shutdown
    stop_scheduler()
    logger.info("Application shutdown complete")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Real-Time Space Debris Collision Assessment Platform using SGP4 propagation via Skyfield",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(satellites.router)
app.include_router(debris.router)
app.include_router(assessment.router)
app.include_router(audit.router)


@app.get("/")
def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "operational",
        "docs": "/docs",
    }
