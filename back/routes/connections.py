"""Routes for connections module."""

import logging

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from consts.connections import CONNECTION_TEST_SUCCESS
from dependencies import get_current_user, get_db
from models.user import User
from schemas.connections import (
    ColumnInfo,
    ConnectionCreate,
    ConnectionResponse,
    ConnectionTestResponse,
    SchemaInfo,
    TableInfo,
)
from services import connections as connections_service

router = APIRouter(prefix="/connections", tags=["connections"])
logger = logging.getLogger(__name__)


@router.post(
    "",
    response_model=ConnectionResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_connection(
    data: ConnectionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ConnectionResponse:
    """Create a new external database connection.

    Args:
        data: Connection creation payload.
        db: Async database session.
        current_user: The authenticated user.

    Returns:
        The created connection data.
    """
    connection = await connections_service.create_connection(db, current_user.id, data)
    return ConnectionResponse.model_validate(connection)


@router.get(
    "",
    response_model=list[ConnectionResponse],
)
async def list_connections(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ConnectionResponse]:
    """List all connections for the current user.

    Args:
        db: Async database session.
        current_user: The authenticated user.

    Returns:
        List of connection data.
    """
    connections = await connections_service.get_user_connections(db, current_user.id)
    return [ConnectionResponse.model_validate(c) for c in connections]


@router.get(
    "/{connection_id}",
    response_model=ConnectionResponse,
)
async def get_connection(
    connection_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ConnectionResponse:
    """Get a single connection by ID.

    Args:
        connection_id: ID of the connection.
        db: Async database session.
        current_user: The authenticated user.

    Returns:
        The connection data.
    """
    connection = await connections_service.get_connection(db, connection_id, current_user.id)
    return ConnectionResponse.model_validate(connection)


@router.delete(
    "/{connection_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_connection(
    connection_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    """Delete a connection by ID.

    Args:
        connection_id: ID of the connection.
        db: Async database session.
        current_user: The authenticated user.

    Returns:
        Empty 204 response.
    """
    await connections_service.delete_connection(db, connection_id, current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/{connection_id}/test",
    response_model=ConnectionTestResponse,
)
async def test_connection(
    connection_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ConnectionTestResponse:
    """Test connectivity to an external database.

    Args:
        connection_id: ID of the connection.
        db: Async database session.
        current_user: The authenticated user.

    Returns:
        Test result with ok status and message.
    """
    connection = await connections_service.get_connection(db, connection_id, current_user.id)
    ok, message = await connections_service.test_connection(connection)
    if ok:
        message = CONNECTION_TEST_SUCCESS
    return ConnectionTestResponse(ok=ok, message=message)


@router.get(
    "/{connection_id}/schemas",
    response_model=list[SchemaInfo],
)
async def list_schemas(
    connection_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[SchemaInfo]:
    """List schemas from an external database.

    Args:
        connection_id: ID of the connection.
        db: Async database session.
        current_user: The authenticated user.

    Returns:
        List of schema names.
    """
    connection = await connections_service.get_connection(db, connection_id, current_user.id)
    schemas = await connections_service.get_schemas(connection)
    return [SchemaInfo(**s) for s in schemas]


@router.get(
    "/{connection_id}/schemas/{schema_name}/tables",
    response_model=list[TableInfo],
)
async def list_tables(
    connection_id: int,
    schema_name: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[TableInfo]:
    """List tables from a schema in an external database.

    Args:
        connection_id: ID of the connection.
        schema_name: Name of the schema.
        db: Async database session.
        current_user: The authenticated user.

    Returns:
        List of table names.
    """
    connection = await connections_service.get_connection(db, connection_id, current_user.id)
    tables = await connections_service.get_tables(connection, schema_name)
    return [TableInfo(**t) for t in tables]


@router.get(
    "/{connection_id}/schemas/{schema_name}/tables/{table_name}/columns",
    response_model=list[ColumnInfo],
)
async def list_columns(
    connection_id: int,
    schema_name: str,
    table_name: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ColumnInfo]:
    """List columns from a table in an external database.

    Args:
        connection_id: ID of the connection.
        schema_name: Name of the schema.
        table_name: Name of the table.
        db: Async database session.
        current_user: The authenticated user.

    Returns:
        List of column details.
    """
    connection = await connections_service.get_connection(db, connection_id, current_user.id)
    columns = await connections_service.get_columns(connection, schema_name, table_name)
    return [ColumnInfo(**c) for c in columns]
