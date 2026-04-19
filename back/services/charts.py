"""Business logic for charts module."""

import logging
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from exceptions.charts import ChartAccessDeniedException, ChartNotFoundException
from models.charts import Chart
from models.connections import Connection
from schemas.charts import ChartCreate, ChartUpdate
from services.queries import execute_query

logger = logging.getLogger(__name__)


async def create_chart(
    db: AsyncSession,
    user_id: int,
    data: ChartCreate,
) -> Chart:
    """Create a new chart.

    Args:
        db: Async database session.
        user_id: ID of the owning user.
        data: Chart creation data.

    Returns:
        The newly created Chart instance.
    """
    chart = Chart(
        user_id=user_id,
        connection_id=data.connection_id,
        saved_query_id=data.saved_query_id,
        name=data.name,
        sql_text=data.sql_text,
        chart_type=data.chart_type,
        config=data.config,
    )
    db.add(chart)
    await db.flush()
    await db.refresh(chart)
    logger.info("Chart created: id=%d, user_id=%d", chart.id, user_id)
    return chart


async def get_user_charts(db: AsyncSession, user_id: int) -> list[Chart]:
    """List all charts belonging to a user.

    Args:
        db: Async database session.
        user_id: ID of the owning user.

    Returns:
        List of Chart instances owned by the user.
    """
    result = await db.execute(
        select(Chart).where(Chart.user_id == user_id).order_by(Chart.created_at.desc())
    )
    return list(result.scalars().all())


async def get_chart(db: AsyncSession, chart_id: int, user_id: int) -> Chart:
    """Get a single chart, verifying ownership.

    Args:
        db: Async database session.
        chart_id: ID of the chart to retrieve.
        user_id: ID of the requesting user.

    Returns:
        The Chart instance.

    Raises:
        ChartNotFoundException: If the chart does not exist.
        ChartAccessDeniedException: If the user does not own the chart.
    """
    result = await db.execute(select(Chart).where(Chart.id == chart_id))
    chart = result.scalar_one_or_none()
    if chart is None:
        raise ChartNotFoundException()
    if chart.user_id != user_id:
        raise ChartAccessDeniedException()
    return chart


async def update_chart(
    db: AsyncSession,
    chart_id: int,
    user_id: int,
    data: ChartUpdate,
) -> Chart:
    """Update a chart with partial data, verifying ownership.

    Args:
        db: Async database session.
        chart_id: ID of the chart to update.
        user_id: ID of the requesting user.
        data: Partial update data.

    Returns:
        The updated Chart instance.

    Raises:
        ChartNotFoundException: If the chart does not exist.
        ChartAccessDeniedException: If the user does not own the chart.
    """
    chart = await get_chart(db, chart_id, user_id)
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(chart, field, value)
    await db.flush()
    await db.refresh(chart)
    logger.info("Chart updated: id=%d, user_id=%d", chart_id, user_id)
    return chart


async def delete_chart(db: AsyncSession, chart_id: int, user_id: int) -> None:
    """Delete a chart, verifying ownership.

    Args:
        db: Async database session.
        chart_id: ID of the chart to delete.
        user_id: ID of the requesting user.

    Raises:
        ChartNotFoundException: If the chart does not exist.
        ChartAccessDeniedException: If the user does not own the chart.
    """
    chart = await get_chart(db, chart_id, user_id)
    await db.delete(chart)
    await db.flush()
    logger.info("Chart deleted: id=%d, user_id=%d", chart_id, user_id)


async def get_chart_data(connection: Connection, sql_text: str) -> dict[str, Any]:
    """Execute the chart's SQL query against the external database.

    Args:
        connection: The Connection model with external DB credentials.
        sql_text: The SQL query to execute.

    Returns:
        A dict with columns, rows, and row_count.

    Raises:
        QueryNotAllowedException: If the SQL is not a valid SELECT.
        QueryExecutionException: If the query fails on the external DB.
    """
    return await execute_query(connection, sql_text)
