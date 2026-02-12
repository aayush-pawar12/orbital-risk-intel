"""APScheduler background job for periodic TLE refresh."""

import asyncio
import logging
from apscheduler.schedulers.background import BackgroundScheduler

from app.config import get_settings
from app.database import SessionLocal
from app.services.tle_ingestion import refresh_all_tles

logger = logging.getLogger(__name__)
settings = get_settings()

scheduler = BackgroundScheduler()


def _run_tle_refresh():
    """Synchronous wrapper for the async TLE refresh."""
    logger.info("Scheduled TLE refresh starting...")
    db = SessionLocal()
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(refresh_all_tles(db))
        logger.info(f"Scheduled TLE refresh complete: {result}")
    except Exception as e:
        logger.error(f"Scheduled TLE refresh failed: {e}")
    finally:
        db.close()


def start_scheduler():
    """Start the background TLE refresh scheduler."""
    scheduler.add_job(
        _run_tle_refresh,
        "interval",
        seconds=settings.TLE_REFRESH_INTERVAL,
        id="tle_refresh",
        replace_existing=True,
    )
    scheduler.start()
    logger.info(f"TLE refresh scheduler started (interval: {settings.TLE_REFRESH_INTERVAL}s)")


def stop_scheduler():
    """Stop the scheduler gracefully."""
    if scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("TLE refresh scheduler stopped")
