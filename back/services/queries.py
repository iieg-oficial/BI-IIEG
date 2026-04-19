"""Business logic for queries module."""

import logging
from datetime import date, datetime
from decimal import Decimal
from typing import Any
from uuid import UUID

import asyncpg
import sqlparse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from consts.queries import (
    FORBIDDEN_SQL_KEYWORDS,
    MAX_QUERY_ROWS,
    QUERY_EMPTY,
    QUERY_MULTIPLE_STATEMENTS,
    QUERY_NOT_ALLOWED,
    QUERY_TIMEOUT,
    QUERY_TIMEOUT_SECONDS,
)
from exceptions.queries import (
    QueryExecutionException,
    QueryNotAllowedException,
    SavedQueryAccessDeniedException,
    SavedQueryNotFoundException,
)
from models.connections import Connection
from models.queries import SavedQuery
from schemas.queries import SavedQueryCreate, SavedQueryUpdate
from services.connections import decrypt_password

logger = logging.getLogger(__name__)


def _serialize_value(val: Any) -> Any:
    """Convert non-JSON-serializable values to safe types.

    Args:
        val: A value from an asyncpg row.

    Returns:
        A JSON-serializable representation of the value.
    """
    if val is None:
        return None
    if isinstance(val, (int, float, str, bool)):
        return val
    if isinstance(val, Decimal):
        return float(val)
    if isinstance(val, (datetime, date)):
        return val.isoformat()
    if isinstance(val, UUID):
        return str(val)
    return str(val)


def validate_read_only_query(sql_text: str) -> str:
    """Validate that a SQL string contains only a single SELECT statement.

    Args:
        sql_text: The raw SQL text to validate.

    Returns:
        The cleaned/stripped SQL string.

    Raises:
        QueryNotAllowedException: If the SQL is empty, contains multiple
            statements, or is not a SELECT.
    """
    stripped = sql_text.strip()
    if not stripped:
        raise QueryNotAllowedException(QUERY_EMPTY)

    parsed = sqlparse.parse(stripped)
    statements = [s for s in parsed if s.get_type() is not None or str(s).strip()]

    if len(statements) != 1:
        raise QueryNotAllowedException(QUERY_MULTIPLE_STATEMENTS)

    statement = statements[0]
    stmt_type = (statement.get_type() or "").upper()

    if stmt_type != "SELECT":
        raise QueryNotAllowedException(QUERY_NOT_ALLOWED)

    # Check for forbidden keywords as additional safety layer
    first_token = stripped.split()[0].upper() if stripped.split() else ""
    if first_token in FORBIDDEN_SQL_KEYWORDS:
        raise QueryNotAllowedException(QUERY_NOT_ALLOWED)

    return stripped


async def execute_query(connection: Connection, sql_text: str) -> dict[str, Any]:
    """Execute a read-only SQL query against an external database.

    Args:
        connection: The Connection model with external DB credentials.
        sql_text: The SQL query to execute.

    Returns:
        A dict with columns, rows, and row_count.

    Raises:
        QueryNotAllowedException: If the SQL is not a valid SELECT.
        QueryExecutionException: If the query fails on the external DB.
    """
    validated_sql = validate_read_only_query(sql_text)

    conn = await asyncpg.connect(
        host=connection.host,
        port=connection.port,
        database=connection.database_name,
        user=connection.username,
        password=decrypt_password(connection.encrypted_password),
        timeout=10,
    )
    try:
        await conn.execute(f"SET statement_timeout = '{QUERY_TIMEOUT_SECONDS * 1000}'")
        await conn.execute("BEGIN TRANSACTION READ ONLY")

        rows = await conn.fetch(validated_sql)

        if rows:
            columns = list(rows[0].keys())
            data = [
                [_serialize_value(v) for v in row.values()]
                for row in rows[:MAX_QUERY_ROWS]
            ]
        else:
            columns = []
            data = []

        await conn.execute("ROLLBACK")

        return {"columns": columns, "rows": data, "row_count": len(data)}
    except asyncpg.exceptions.QueryCanceledError:
        raise QueryExecutionException(QUERY_TIMEOUT)
    except asyncpg.exceptions.PostgresError as exc:
        raise QueryExecutionException(str(exc))
    finally:
        await conn.close()


async def create_saved_query(
    db: AsyncSession,
    user_id: int,
    data: SavedQueryCreate,
) -> SavedQuery:
    """Create a new saved query.

    Args:
        db: Async database session.
        user_id: ID of the owning user.
        data: Saved query creation data.

    Returns:
        The newly created SavedQuery instance.
    """
    saved_query = SavedQuery(
        user_id=user_id,
        connection_id=data.connection_id,
        name=data.name,
        sql_text=data.sql_text,
        description=data.description,
    )
    db.add(saved_query)
    await db.flush()
    await db.refresh(saved_query)
    logger.info("Saved query created: id=%d, user_id=%d", saved_query.id, user_id)
    return saved_query


async def get_user_saved_queries(db: AsyncSession, user_id: int) -> list[SavedQuery]:
    """List all saved queries belonging to a user.

    Args:
        db: Async database session.
        user_id: ID of the owning user.

    Returns:
        List of SavedQuery instances owned by the user.
    """
    result = await db.execute(
        select(SavedQuery).where(SavedQuery.user_id == user_id).order_by(SavedQuery.created_at.desc())
    )
    return list(result.scalars().all())


async def get_saved_query(db: AsyncSession, query_id: int, user_id: int) -> SavedQuery:
    """Get a single saved query, verifying ownership.

    Args:
        db: Async database session.
        query_id: ID of the saved query to retrieve.
        user_id: ID of the requesting user.

    Returns:
        The SavedQuery instance.

    Raises:
        SavedQueryNotFoundException: If the saved query does not exist.
        SavedQueryAccessDeniedException: If the user does not own the query.
    """
    result = await db.execute(select(SavedQuery).where(SavedQuery.id == query_id))
    saved_query = result.scalar_one_or_none()
    if saved_query is None:
        raise SavedQueryNotFoundException()
    if saved_query.user_id != user_id:
        raise SavedQueryAccessDeniedException()
    return saved_query


async def update_saved_query(
    db: AsyncSession,
    query_id: int,
    user_id: int,
    data: SavedQueryUpdate,
) -> SavedQuery:
    """Update a saved query with partial data, verifying ownership.

    Args:
        db: Async database session.
        query_id: ID of the saved query to update.
        user_id: ID of the requesting user.
        data: Partial update data.

    Returns:
        The updated SavedQuery instance.

    Raises:
        SavedQueryNotFoundException: If the saved query does not exist.
        SavedQueryAccessDeniedException: If the user does not own the query.
    """
    saved_query = await get_saved_query(db, query_id, user_id)
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(saved_query, field, value)
    await db.flush()
    await db.refresh(saved_query)
    logger.info("Saved query updated: id=%d, user_id=%d", query_id, user_id)
    return saved_query


async def delete_saved_query(db: AsyncSession, query_id: int, user_id: int) -> None:
    """Delete a saved query, verifying ownership.

    Args:
        db: Async database session.
        query_id: ID of the saved query to delete.
        user_id: ID of the requesting user.

    Raises:
        SavedQueryNotFoundException: If the saved query does not exist.
        SavedQueryAccessDeniedException: If the user does not own the query.
    """
    saved_query = await get_saved_query(db, query_id, user_id)
    await db.delete(saved_query)
    await db.flush()
    logger.info("Saved query deleted: id=%d, user_id=%d", query_id, user_id)
