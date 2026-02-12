"""Application configuration via pydantic-settings."""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    APP_NAME: str = "Orbital Risk Intelligence System"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "sqlite:///./orbital_risk.db"

    # Celestrak
    CELESTRAK_BASE_URL: str = "https://celestrak.org/NORAD/elements/gp.php"

    # Space-Track (optional)
    SPACETRACK_USER: str = ""
    SPACETRACK_PASS: str = ""

    # TLE refresh interval (seconds) – default 6 hours
    TLE_REFRESH_INTERVAL: int = 21600

    # Risk thresholds (km)
    RISK_CRITICAL_THRESHOLD: float = 1.0
    RISK_WARNING_THRESHOLD: float = 5.0

    # Prediction
    PREDICTION_WINDOW_HOURS: int = 24
    PREDICTION_STEP_MINUTES: int = 5

    # CORS — comma-separated string for env var compatibility
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    model_config = {"env_file": ".env", "extra": "ignore"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
