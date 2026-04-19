"""SQLAlchemy models for queries module."""

import logging
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from db import Base

logger = logging.getLogger(__name__)


class SavedQuery(Base):
    """SavedQuery database model matching the saved_queries table.

    Attributes:
        id: Primary key.
        user_id: Foreign key to users table.
        connection_id: Foreign key to connections table.
        name: Display name for the saved query.
        sql_text: The SQL query text.
        description: Optional description of the query.
        created_at: Timestamp of creation.
        updated_at: Timestamp of last update.
    """

    __tablename__ = "saved_queries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    connection_id: Mapped[int] = mapped_column(Integer, ForeignKey("connections.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    sql_text: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str] = mapped_column(Text, server_default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
