"""Pydantic schemas for connections module."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from consts.connections import DEFAULT_PORT


class ConnectionCreate(BaseModel):
    """Schema for creating a new database connection.

    Attributes:
        name: Display name for the connection.
        host: Database host address.
        port: Database port number.
        database_name: Name of the external database.
        username: Database login username.
        password: Plain-text password (will be encrypted before storage).
    """

    name: str = Field(min_length=1, max_length=255)
    host: str = Field(min_length=1, max_length=255)
    port: int = Field(default=DEFAULT_PORT, ge=1, le=65535)
    database_name: str = Field(min_length=1, max_length=255)
    username: str = Field(min_length=1, max_length=255)
    password: str = Field(min_length=1)


class ConnectionResponse(BaseModel):
    """Schema for connection data response. Never exposes the password.

    Attributes:
        id: Connection primary key.
        name: Display name for the connection.
        host: Database host address.
        port: Database port number.
        database_name: Name of the external database.
        username: Database login username.
        created_at: Connection creation timestamp.
        updated_at: Last update timestamp.
    """

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    host: str
    port: int
    database_name: str
    username: str
    created_at: datetime
    updated_at: datetime


class ConnectionTestResponse(BaseModel):
    """Schema for connection test result.

    Attributes:
        ok: Whether the connection was successful.
        message: Description of the result.
    """

    ok: bool
    message: str


class SchemaInfo(BaseModel):
    """Schema for external database schema information.

    Attributes:
        schema_name: Name of the database schema.
    """

    schema_name: str


class TableInfo(BaseModel):
    """Schema for external database table information.

    Attributes:
        table_name: Name of the database table.
    """

    table_name: str


class ColumnInfo(BaseModel):
    """Schema for external database column information.

    Attributes:
        column_name: Name of the column.
        data_type: Data type of the column.
        is_nullable: Whether the column allows NULL values.
    """

    column_name: str
    data_type: str
    is_nullable: bool
