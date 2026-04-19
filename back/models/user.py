"""SQLAlchemy models for user module."""

import logging
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from db import Base

logger = logging.getLogger(__name__)


class User(Base):
    """User database model matching the users table.

    Attributes:
        id: Primary key.
        email: Unique email address.
        password_hash: Bcrypt-hashed password.
        full_name: User display name.
        is_active: Whether the account is active.
        created_at: Timestamp of account creation.
        updated_at: Timestamp of last update.
    """

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
