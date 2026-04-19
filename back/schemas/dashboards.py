"""Pydantic schemas for dashboards module."""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


BlockType = Literal["chart", "markdown"]


class DashboardBlock(BaseModel):
    """A single block rendered on the dashboard canvas.

    Attributes:
        id: Client-generated block identifier (e.g., uuid).
        type: Block type, either "chart" or "markdown".
        x: X position on the grid.
        y: Y position on the grid.
        w: Width on the grid.
        h: Height on the grid.
        chartId: Referenced chart id when type is "chart".
        markdown: Markdown content when type is "markdown".
    """

    model_config = ConfigDict(populate_by_name=True)

    id: str
    type: BlockType
    x: float
    y: float
    w: float
    h: float
    chartId: int | None = None
    markdown: str | None = None


class DashboardCreate(BaseModel):
    """Schema for creating a dashboard.

    Attributes:
        name: Display name for the dashboard.
        description: Optional description.
        layout: Initial layout of blocks.
    """

    name: str = Field(min_length=1, max_length=255)
    description: str | None = None
    layout: list[DashboardBlock] = Field(default_factory=list)


class DashboardUpdate(BaseModel):
    """Schema for partially updating a dashboard.

    Attributes:
        name: Updated display name.
        description: Updated description.
        layout: Updated layout of blocks.
    """

    name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    layout: list[DashboardBlock] | None = None


class DashboardResponse(BaseModel):
    """Schema for dashboard data response.

    Attributes:
        id: Dashboard primary key.
        user_id: ID of the owning user.
        name: Display name.
        description: Optional description.
        layout: List of blocks on the canvas.
        created_at: Creation timestamp.
        updated_at: Last update timestamp.
    """

    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    name: str
    description: str | None
    layout: list[DashboardBlock]
    created_at: datetime
    updated_at: datetime
