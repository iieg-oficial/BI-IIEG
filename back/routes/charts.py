"""Routes for charts module."""

import logging

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from dependencies import get_current_user, get_db
from models.user import User
from schemas.charts import ChartCreate, ChartResponse, ChartUpdate
from schemas.queries import QueryExecuteResponse
from services import charts as charts_service
from services import connections as connections_service

router = APIRouter(prefix="/charts", tags=["charts"])
logger = logging.getLogger(__name__)


@router.post(
    "",
    response_model=ChartResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_chart(
    data: ChartCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ChartResponse:
    """Create a new chart configuration.

    Args:
        data: Chart creation payload.
        db: Async database session.
        current_user: The authenticated user.

    Returns:
        The created chart data.
    """
    chart = await charts_service.create_chart(db, current_user.id, data)
    return ChartResponse.model_validate(chart)


@router.get(
    "",
    response_model=list[ChartResponse],
)
async def list_charts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ChartResponse]:
    """List all charts for the current user.

    Args:
        db: Async database session.
        current_user: The authenticated user.

    Returns:
        List of chart data.
    """
    charts = await charts_service.get_user_charts(db, current_user.id)
    return [ChartResponse.model_validate(c) for c in charts]


@router.get(
    "/{chart_id}",
    response_model=ChartResponse,
)
async def get_chart(
    chart_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ChartResponse:
    """Get a single chart by ID.

    Args:
        chart_id: ID of the chart.
        db: Async database session.
        current_user: The authenticated user.

    Returns:
        The chart data.
    """
    chart = await charts_service.get_chart(db, chart_id, current_user.id)
    return ChartResponse.model_validate(chart)


@router.put(
    "/{chart_id}",
    response_model=ChartResponse,
)
async def update_chart(
    chart_id: int,
    data: ChartUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ChartResponse:
    """Update a chart.

    Args:
        chart_id: ID of the chart.
        data: Partial update payload.
        db: Async database session.
        current_user: The authenticated user.

    Returns:
        The updated chart data.
    """
    chart = await charts_service.update_chart(db, chart_id, current_user.id, data)
    return ChartResponse.model_validate(chart)


@router.delete(
    "/{chart_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_chart(
    chart_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    """Delete a chart.

    Args:
        chart_id: ID of the chart.
        db: Async database session.
        current_user: The authenticated user.

    Returns:
        Empty 204 response.
    """
    await charts_service.delete_chart(db, chart_id, current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/{chart_id}/preview",
    response_model=QueryExecuteResponse,
)
async def preview_chart(
    chart_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> QueryExecuteResponse:
    """Execute the chart's SQL and return query results for preview.

    Args:
        chart_id: ID of the chart.
        db: Async database session.
        current_user: The authenticated user.

    Returns:
        Query results with columns, rows, and row_count.
    """
    chart = await charts_service.get_chart(db, chart_id, current_user.id)
    connection = await connections_service.get_connection(db, chart.connection_id, current_user.id)
    result = await charts_service.get_chart_data(connection, chart.sql_text)
    return QueryExecuteResponse(**result)
