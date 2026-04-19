"""Routes for dashboards module."""

import logging

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from dependencies import get_current_user, get_db
from models.user import User
from schemas.dashboards import DashboardCreate, DashboardResponse, DashboardUpdate
from services import dashboards as dashboards_service

router = APIRouter(prefix="/dashboards", tags=["dashboards"])
logger = logging.getLogger(__name__)


@router.post(
    "",
    response_model=DashboardResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_dashboard(
    data: DashboardCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DashboardResponse:
    """Create a new dashboard.

    Args:
        data: Dashboard creation payload.
        db: Async database session.
        current_user: The authenticated user.

    Returns:
        The created dashboard data.
    """
    dashboard = await dashboards_service.create_dashboard(db, current_user.id, data)
    return DashboardResponse.model_validate(dashboard)


@router.get(
    "",
    response_model=list[DashboardResponse],
)
async def list_dashboards(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[DashboardResponse]:
    """List all dashboards for the current user.

    Args:
        db: Async database session.
        current_user: The authenticated user.

    Returns:
        List of dashboards owned by the user.
    """
    dashboards = await dashboards_service.get_user_dashboards(db, current_user.id)
    return [DashboardResponse.model_validate(d) for d in dashboards]


@router.get(
    "/{dashboard_id}",
    response_model=DashboardResponse,
)
async def get_dashboard(
    dashboard_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DashboardResponse:
    """Get a single dashboard by ID.

    Args:
        dashboard_id: ID of the dashboard.
        db: Async database session.
        current_user: The authenticated user.

    Returns:
        The dashboard data.
    """
    dashboard = await dashboards_service.get_dashboard(db, dashboard_id, current_user.id)
    return DashboardResponse.model_validate(dashboard)


@router.put(
    "/{dashboard_id}",
    response_model=DashboardResponse,
)
async def update_dashboard(
    dashboard_id: int,
    data: DashboardUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DashboardResponse:
    """Update a dashboard.

    Args:
        dashboard_id: ID of the dashboard.
        data: Partial update payload.
        db: Async database session.
        current_user: The authenticated user.

    Returns:
        The updated dashboard data.
    """
    dashboard = await dashboards_service.update_dashboard(db, dashboard_id, current_user.id, data)
    return DashboardResponse.model_validate(dashboard)


@router.delete(
    "/{dashboard_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_dashboard(
    dashboard_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    """Delete a dashboard.

    Args:
        dashboard_id: ID of the dashboard.
        db: Async database session.
        current_user: The authenticated user.

    Returns:
        Empty 204 response.
    """
    await dashboards_service.delete_dashboard(db, dashboard_id, current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
