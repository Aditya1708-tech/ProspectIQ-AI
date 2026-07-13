"""
ProspectIQ AI - Application Settings Configuration
"""
import os

class Settings:
    PROJECT_NAME: str = "ProspectIQ AI - Inference Service"
    PROJECT_VERSION: str = "1.0.0"
    API_PORT: int = int(os.getenv("PORT", 8000))
    DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")

settings = Settings()
