from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    DB_HOST: str
    DB_PORT: str
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str

    APP_NAME: str = "Banking System Simulation"
    DEBUG: bool = False

    class Config:
        env_file = '.env'
        case_sensitive = True

    @property
    def database_url(self) -> str:
        return f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    

@lru_cache
def get_settings() -> Settings:
    return Settings()
    
