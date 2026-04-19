"""SQLAlchemy models for dashboards module."""

import logging
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from db import Base

logger = logging.getLogger(__name__)


class Dashboard(Base):
    """Dashboard database model matching the dashboards table.

    Attributes:
        id: Primary key.
        user_id: Foreign key to users table.
        name: Display name for the dashboard.
        description: Optional description of the dashboard.
        layout: JSON array of blocks (chart or markdown) with grid positions.
        created_at: Timestamp of creation.
        updated_at: Timestamp of last update.
    """

    __tablename__ = "dashboards"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    layout: Mapped[list] = mapped_column(JSON, nullable=False, server_default="[]")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
