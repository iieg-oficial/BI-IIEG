"""Pydantic schemas for charts module."""

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field


ChartType = Literal["bar", "line", "pie", "scatter", "histogram"]


class ChartCreate(BaseModel):
    """Schema for creating a chart.

    Attributes:
        name: Display name for the chart.
        connection_id: ID of the associated connection.
        saved_query_id: Optional ID of the associated saved query.
        sql_text: The SQL query text.
        chart_type: Type of Plotly chart.
        config: Plotly chart configuration.
    """

    name: str = Field(min_length=1, max_length=255)
    connection_id: int
    saved_query_id: int | None = None
    sql_text: str = Field(min_length=1)
    chart_type: ChartType
    config: dict[str, Any] = Field(default_factory=dict)


class ChartUpdate(BaseModel):
    """Schema for partially updating a chart.

    Attributes:
        name: Updated display name.
        sql_text: Updated SQL text.
        chart_type: Updated chart type.
        config: Updated Plotly chart configuration.
        saved_query_id: Updated saved query reference.
    """

    name: str | None = Field(default=None, min_length=1, max_length=255)
    sql_text: str | None = Field(default=None, min_length=1)
    chart_type: ChartType | None = None
    config: dict[str, Any] | None = None
    saved_query_id: int | None = None


class ChartResponse(BaseModel):
    """Schema for chart data response.

    Attributes:
        id: Chart primary key.
        user_id: ID of the owning user.
        connection_id: ID of the associated connection.
        saved_query_id: Optional ID of the associated saved query.
        name: Display name.
        sql_text: The SQL query text.
        chart_type: Type of Plotly chart.
        config: Plotly chart configuration.
        created_at: Creation timestamp.
        updated_at: Last update timestamp.
    """

    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    connection_id: int
    saved_query_id: int | None
    name: str
    sql_text: str
    chart_type: str
    config: dict[str, Any]
    created_at: datetime
    updated_at: datetime
