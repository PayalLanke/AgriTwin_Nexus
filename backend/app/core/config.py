import os
# pyrefly: ignore [missing-import]
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AgriTwin Nexus API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "agritwin_super_secret_jwt_key_2026")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Database URL (Defaults to SQLite agritwin.db for zero-config deployment)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./agritwin.db"
    )

    # Google Earth Engine (GEE) Configuration
    GEE_PROJECT_ID: str = os.getenv("GEE_PROJECT_ID", "")
    GEE_SERVICE_ACCOUNT: str = os.getenv("GEE_SERVICE_ACCOUNT", "")
    GEE_PRIVATE_KEY: str = os.getenv("GEE_PRIVATE_KEY", "")

    # Meteorological Weather API Key (OpenWeatherMap / Open-Meteo)
    WEATHER_API_KEY: str = os.getenv("WEATHER_API_KEY", "")

    class Config:
        case_sensitive = True

settings = Settings()
