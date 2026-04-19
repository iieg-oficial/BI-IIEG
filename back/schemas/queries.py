"""Pydantic schemas for queries module."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class QueryExecuteRequest(BaseModel):
    """Schema for executing a SQL query against an external connection.

    Attributes:
        connection_id: ID of the connection to execute against.
        sql_text: The SQL query to execute.
    """

    connection_id: int
    sql_text: str = Field(min_length=1)


class QueryExecuteResponse(BaseModel):
    """Schema for query execution results.

    Attributes:
        columns: List of column names.
        rows: List of rows, each row a list of values.
        row_count: Number of rows returned.
    """

    columns: list[str]
    rows: list[list[Any]]
    row_count: int


class SavedQueryCreate(BaseModel):
    """Schema for creating a saved query.

    Attributes:
        connection_id: ID of the associated connection.
        name: Display name for the saved query.
        sql_text: The SQL query text.
        description: Optional description.
    """

    connection_id: int
    name: str = Field(min_length=1, max_length=255)
    sql_text: str = Field(min_length=1)
    description: str = ""


class SavedQueryUpdate(BaseModel):
    """Schema for partially updating a saved query.

    Attributes:
        name: Updated display name.
        sql_text: Updated SQL text.
        description: Updated description.
    """

    name: str | None = Field(default=None, min_length=1, max_length=255)
    sql_text: str | None = Field(default=None, min_length=1)
    description: str | None = None


class SavedQueryResponse(BaseModel):
    """Schema for saved query data response.

    Attributes:
        id: Saved query primary key.
        connection_id: ID of the associated connection.
        name: Display name.
        sql_text: The SQL query text.
        description: Description of the query.
        created_at: Creation timestamp.
        updated_at: Last update timestamp.
    """

    model_config = ConfigDict(from_attributes=True)

    id: int
    connection_id: int
    name: str
    sql_text: str
    description: str
    created_at: datetime
    updated_at: datetime
