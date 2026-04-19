"""Routes for queries module."""

import logging

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from dependencies import get_current_user, get_db
from models.user import User
from schemas.queries import (
    QueryExecuteRequest,
    QueryExecuteResponse,
    SavedQueryCreate,
    SavedQueryResponse,
    SavedQueryUpdate,
)
from services import connections as connections_service
from services import queries as queries_service

router = APIRouter(prefix="/queries", tags=["queries"])
logger = logging.getLogger(__name__)


@router.post(
    "/execute",
    response_model=QueryExecuteResponse,
)
async def execute_query(
    data: QueryExecuteRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> QueryExecuteResponse:
    """Execute a read-only SQL query against an external database.

    Args:
        data: Query execution payload with connection_id and sql_text.
        current_user: The authenticated user.
        db: Async database session.

    Returns:
        Query results with columns, rows, and row_count.
    """
    connection = await connections_service.get_connection(db, data.connection_id, current_user.id)
    result = await queries_service.execute_query(connection, data.sql_text)
    return QueryExecuteResponse(**result)


@router.post(
    "/saved",
    response_model=SavedQueryResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_saved_query(
    data: SavedQueryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SavedQueryResponse:
    """Save a query for later reuse.

    Args:
        data: Saved query creation payload.
        db: Async database session.
        current_user: The authenticated user.

    Returns:
        The created saved query data.
    """
    saved_query = await queries_service.create_saved_query(db, current_user.id, data)
    return SavedQueryResponse.model_validate(saved_query)


@router.get(
    "/saved",
    response_model=list[SavedQueryResponse],
)
async def list_saved_queries(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[SavedQueryResponse]:
    """List all saved queries for the current user.

    Args:
        db: Async database session.
        current_user: The authenticated user.

    Returns:
        List of saved query data.
    """
    queries = await queries_service.get_user_saved_queries(db, current_user.id)
    return [SavedQueryResponse.model_validate(q) for q in queries]


@router.get(
    "/saved/{query_id}",
    response_model=SavedQueryResponse,
)
async def get_saved_query(
    query_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SavedQueryResponse:
    """Get a single saved query by ID.

    Args:
        query_id: ID of the saved query.
        db: Async database session.
        current_user: The authenticated user.

    Returns:
        The saved query data.
    """
    saved_query = await queries_service.get_saved_query(db, query_id, current_user.id)
    return SavedQueryResponse.model_validate(saved_query)


@router.put(
    "/saved/{query_id}",
    response_model=SavedQueryResponse,
)
async def update_saved_query(
    query_id: int,
    data: SavedQueryUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SavedQueryResponse:
    """Update a saved query.

    Args:
        query_id: ID of the saved query.
        data: Partial update payload.
        db: Async database session.
        current_user: The authenticated user.

    Returns:
        The updated saved query data.
    """
    saved_query = await queries_service.update_saved_query(db, query_id, current_user.id, data)
    return SavedQueryResponse.model_validate(saved_query)


@router.delete(
    "/saved/{query_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_saved_query(
    query_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    """Delete a saved query.

    Args:
        query_id: ID of the saved query.
        db: Async database session.
        current_user: The authenticated user.

    Returns:
        Empty 204 response.
    """
    await queries_service.delete_saved_query(db, query_id, current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
