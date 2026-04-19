"""Application settings loaded from environment variables."""

import logging

from pydantic_settings import BaseSettings

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    """Application configuration via environment variables.

    Args:
        DATABASE_URL: Async PostgreSQL connection string.
        SECRET_KEY: Secret key used for JWT signing.
        ACCESS_TOKEN_EXPIRE_MINUTES: Token expiration time in minutes.
        CORS_ORIGINS: List of allowed CORS origins.
    """

    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/bi_iieg"
    SECRET_KEY: str = "change-me-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
