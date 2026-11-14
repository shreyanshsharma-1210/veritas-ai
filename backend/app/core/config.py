import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Veritas AI — Decision Intelligence Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./veritas_ai.db"
    
    # LLM Providers
    GROQ_API_KEY: str = ""
    GROQ_API_KEY_SECONDARY: str = ""
    GEMINI_API_KEY: str = ""
    DEFAULT_LLM_PROVIDER: str = "groq"
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    GEMINI_MODEL: str = "gemini-1.5-flash"
    
    # Debate Constraints
    MAX_DEBATE_ROUNDS: int = 3
    DEBATE_TIMEOUT_SECONDS: int = 120
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()

