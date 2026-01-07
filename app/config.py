from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional

class Settings(BaseSettings):
    # Database configuration (for local development)
    DB_HOST: Optional[str] = None
    DB_PORT: Optional[str] = None
    DB_USER: Optional[str] = None
    DB_PASSWORD: Optional[str] = None
    DB_NAME: Optional[str] = None
    
    # Database URL (for production - Neon, Render, etc.)
    DATABASE_URL: Optional[str] = None

    APP_NAME: str = "Banking System Simulation"
    DEBUG: bool = False
    CORS_ORIGINS: str = "http://localhost:5173"
    ENVIRONMENT: str = "development"
    
    # JWT Authentication
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    class Config:
        env_file = '.env'
        case_sensitive = True

    @property
    def database_url(self) -> str:
        # Use DATABASE_URL if provided (production)
        if self.DATABASE_URL:
            return self.DATABASE_URL
        
        # Otherwise build from individual components (local development)
        if all([self.DB_HOST, self.DB_PORT, self.DB_USER, self.DB_PASSWORD, self.DB_NAME]):
            return f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        
        raise ValueError("Either DATABASE_URL or individual DB_* variables must be set")
    

@lru_cache
def get_settings() -> Settings:
    return Settings()


