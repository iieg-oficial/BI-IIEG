"""Business logic for dashboards module."""

import logging

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from exceptions.dashboards import DashboardAccessDeniedException, DashboardNotFoundException
from models.dashboards import Dashboard
from schemas.dashboards import DashboardCreate, DashboardUpdate

logger = logging.getLogger(__name__)


async def create_dashboard(
    db: AsyncSession,
    user_id: int,
    data: DashboardCreate,
) -> Dashboard:
    """Create a new dashboard.

    Args:
        db: Async database session.
        user_id: ID of the owning user.
        data: Dashboard creation data.

    Returns:
        The newly created Dashboard instance.
    """
    dashboard = Dashboard(
        user_id=user_id,
        name=data.name,
        description=data.description,
        layout=[block.model_dump() for block in data.layout],
    )
    db.add(dashboard)
    await db.flush()
    await db.refresh(dashboard)
    logger.info("Dashboard created: id=%d, user_id=%d", dashboard.id, user_id)
    return dashboard


async def get_user_dashboards(db: AsyncSession, user_id: int) -> list[Dashboard]:
    """List all dashboards belonging to a user.

    Args:
        db: Async database session.
        user_id: ID of the owning user.

    Returns:
        List of Dashboard instances owned by the user.
    """
    result = await db.execute(
        select(Dashboard).where(Dashboard.user_id == user_id).order_by(Dashboard.created_at.desc())
    )
    return list(result.scalars().all())


async def get_dashboard(db: AsyncSession, dashboard_id: int, user_id: int) -> Dashboard:
    """Get a single dashboard, verifying ownership.

    Args:
        db: Async database session.
        dashboard_id: ID of the dashboard to retrieve.
        user_id: ID of the requesting user.

    Returns:
        The Dashboard instance.

    Raises:
        DashboardNotFoundException: If the dashboard does not exist.
        DashboardAccessDeniedException: If the user does not own the dashboard.
    """
    result = await db.execute(select(Dashboard).where(Dashboard.id == dashboard_id))
    dashboard = result.scalar_one_or_none()
    if dashboard is None:
        raise DashboardNotFoundException()
    if dashboard.user_id != user_id:
        raise DashboardAccessDeniedException()
    return dashboard


async def update_dashboard(
    db: AsyncSession,
    dashboard_id: int,
    user_id: int,
    data: DashboardUpdate,
) -> Dashboard:
    """Update a dashboard with partial data, verifying ownership.

    Args:
        db: Async database session.
        dashboard_id: ID of the dashboard to update.
        user_id: ID of the requesting user.
        data: Partial update data.

    Returns:
        The updated Dashboard instance.

    Raises:
        DashboardNotFoundException: If the dashboard does not exist.
        DashboardAccessDeniedException: If the user does not own the dashboard.
    """
    dashboard = await get_dashboard(db, dashboard_id, user_id)
    update_data = data.model_dump(exclude_unset=True)
    if "layout" in update_data and update_data["layout"] is not None:
        update_data["layout"] = [
            block if isinstance(block, dict) else block.model_dump()
            for block in update_data["layout"]
        ]
    for field, value in update_data.items():
        setattr(dashboard, field, value)
    await db.flush()
    await db.refresh(dashboard)
    logger.info("Dashboard updated: id=%d, user_id=%d", dashboard_id, user_id)
    return dashboard


async def delete_dashboard(db: AsyncSession, dashboard_id: int, user_id: int) -> None:
    """Delete a dashboard, verifying ownership.

    Args:
        db: Async database session.
        dashboard_id: ID of the dashboard to delete.
        user_id: ID of the requesting user.

    Raises:
        DashboardNotFoundException: If the dashboard does not exist.
        DashboardAccessDeniedException: If the user does not own the dashboard.
    """
    dashboard = await get_dashboard(db, dashboard_id, user_id)
    await db.delete(dashboard)
    await db.flush()
    logger.info("Dashboard deleted: id=%d, user_id=%d", dashboard_id, user_id)
