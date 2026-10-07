import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AgriTwin Nexus API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "agritwin_super_secret_jwt_key_2026")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # SQLite / PostgreSQL Database URL (Defaults to SQLite agritwin.db for zero-config portable deployment)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./agritwin.db"
    )

    class Config:
        case_sensitive = True

settings = Settings()
