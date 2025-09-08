import os
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database Configuration
    database_url: str = "sqlite:///./documents.db"
    
    # OpenAI Configuration (optional)
    openai_api_key: Optional[str] = None
    
    # Application Configuration
    secret_key: str = "your-secret-key-change-in-production"
    debug: bool = True
    log_level: str = "INFO"
    
    # File Storage
    upload_dir: str = "./uploads"
    processed_dir: str = "./processed"
    max_file_size: int = 10485760  # 10MB
    
    class Config:
        env_file = ".env"


settings = Settings()
