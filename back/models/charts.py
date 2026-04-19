"""SQLAlchemy models for charts module."""

import logging
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from db import Base

logger = logging.getLogger(__name__)


class Chart(Base):
    """Chart database model matching the charts table.

    Attributes:
        id: Primary key.
        user_id: Foreign key to users table.
        connection_id: Foreign key to connections table.
        saved_query_id: Optional foreign key to saved_queries table.
        name: Display name for the chart.
        sql_text: The SQL query text used by the chart.
        chart_type: Type of Plotly chart (bar, line, pie, scatter, histogram).
        config: JSON configuration for the Plotly chart.
        created_at: Timestamp of creation.
        updated_at: Timestamp of last update.
    """

    __tablename__ = "charts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    connection_id: Mapped[int] = mapped_column(Integer, ForeignKey("connections.id", ondelete="CASCADE"), nullable=False)
    saved_query_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("saved_queries.id", ondelete="SET NULL"), nullable=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    sql_text: Mapped[str] = mapped_column(Text, nullable=False)
    chart_type: Mapped[str] = mapped_column(String(50), nullable=False)
    config: Mapped[dict] = mapped_column(JSON, nullable=False, server_default="{}")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
