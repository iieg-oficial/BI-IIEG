"""Business logic for connections module."""

import base64
import hashlib
import logging

import asyncpg
from cryptography.fernet import Fernet
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from config import settings
from consts.connections import EXCLUDED_SCHEMAS, EXTERNAL_DB_TIMEOUT
from exceptions.connections import (
    ConnectionAccessDeniedException,
    ConnectionNotFoundException,
)
from models.connections import Connection
from schemas.connections import ConnectionCreate

logger = logging.getLogger(__name__)


def _derive_fernet_key() -> bytes:
    """Derive a 32-byte Fernet key from the application SECRET_KEY.

    Returns:
        A URL-safe base64-encoded 32-byte key suitable for Fernet.
    """
    digest = hashlib.sha256(settings.SECRET_KEY.encode()).digest()
    return base64.urlsafe_b64encode(digest)


def encrypt_password(plain: str) -> str:
    """Encrypt a plain-text password using Fernet symmetric encryption.

    Args:
        plain: The plain-text password to encrypt.

    Returns:
        The encrypted password as a string.
    """
    fernet = Fernet(_derive_fernet_key())
    return fernet.encrypt(plain.encode()).decode()


def decrypt_password(encrypted: str) -> str:
    """Decrypt a Fernet-encrypted password.

    Args:
        encrypted: The encrypted password string.

    Returns:
        The decrypted plain-text password.
    """
    fernet = Fernet(_derive_fernet_key())
    return fernet.decrypt(encrypted.encode()).decode()


async def create_connection(
    db: AsyncSession,
    user_id: int,
    data: ConnectionCreate,
) -> Connection:
    """Create a new database connection record with encrypted password.

    Args:
        db: Async database session.
        user_id: ID of the owning user.
        data: Connection creation data.

    Returns:
        The newly created Connection instance.
    """
    connection = Connection(
        user_id=user_id,
        name=data.name,
        host=data.host,
        port=data.port,
        database_name=data.database_name,
        username=data.username,
        encrypted_password=encrypt_password(data.password),
    )
    db.add(connection)
    await db.flush()
    await db.refresh(connection)
    logger.info("Connection created: id=%d, user_id=%d", connection.id, user_id)
    return connection


async def get_user_connections(db: AsyncSession, user_id: int) -> list[Connection]:
    """List all connections belonging to a user.

    Args:
        db: Async database session.
        user_id: ID of the owning user.

    Returns:
        List of Connection instances owned by the user.
    """
    result = await db.execute(
        select(Connection).where(Connection.user_id == user_id).order_by(Connection.created_at.desc())
    )
    return list(result.scalars().all())


async def get_connection(db: AsyncSession, connection_id: int, user_id: int) -> Connection:
    """Get a single connection, verifying ownership.

    Args:
        db: Async database session.
        connection_id: ID of the connection to retrieve.
        user_id: ID of the requesting user.

    Returns:
        The Connection instance.

    Raises:
        ConnectionNotFoundException: If the connection does not exist.
        ConnectionAccessDeniedException: If the user does not own the connection.
    """
    result = await db.execute(select(Connection).where(Connection.id == connection_id))
    connection = result.scalar_one_or_none()
    if connection is None:
        raise ConnectionNotFoundException()
    if connection.user_id != user_id:
        raise ConnectionAccessDeniedException()
    return connection


async def delete_connection(db: AsyncSession, connection_id: int, user_id: int) -> None:
    """Delete a connection, verifying ownership.

    Args:
        db: Async database session.
        connection_id: ID of the connection to delete.
        user_id: ID of the requesting user.

    Raises:
        ConnectionNotFoundException: If the connection does not exist.
        ConnectionAccessDeniedException: If the user does not own the connection.
    """
    connection = await get_connection(db, connection_id, user_id)
    await db.delete(connection)
    await db.flush()
    logger.info("Connection deleted: id=%d, user_id=%d", connection_id, user_id)


async def test_connection(connection: Connection) -> tuple[bool, str]:
    """Test connectivity to an external PostgreSQL database.

    Args:
        connection: The Connection model instance to test.

    Returns:
        A tuple of (success, message).
    """
    try:
        conn = await asyncpg.connect(
            host=connection.host,
            port=connection.port,
            database=connection.database_name,
            user=connection.username,
            password=decrypt_password(connection.encrypted_password),
            timeout=EXTERNAL_DB_TIMEOUT,
        )
        try:
            await conn.fetchval("SELECT 1")
        finally:
            await conn.close()
        return True, "Connection successful"
    except Exception as exc:
        logger.warning("Connection test failed for id=%d: %s", connection.id, exc)
        return False, str(exc)


async def get_schemas(connection: Connection) -> list[dict[str, str]]:
    """List schemas from an external PostgreSQL database.

    Args:
        connection: The Connection model instance.

    Returns:
        List of dicts with schema_name key.
    """
    conn = await asyncpg.connect(
        host=connection.host,
        port=connection.port,
        database=connection.database_name,
        user=connection.username,
        password=decrypt_password(connection.encrypted_password),
        timeout=EXTERNAL_DB_TIMEOUT,
    )
    try:
        rows = await conn.fetch(
            "SELECT schema_name FROM information_schema.schemata "
            "WHERE schema_name != ALL($1::text[]) "
            "ORDER BY schema_name",
            EXCLUDED_SCHEMAS,
        )
        return [{"schema_name": row["schema_name"]} for row in rows]
    finally:
        await conn.close()


async def get_tables(connection: Connection, schema: str) -> list[dict[str, str]]:
    """List tables from a specific schema in an external PostgreSQL database.

    Args:
        connection: The Connection model instance.
        schema: The schema name to list tables from.

    Returns:
        List of dicts with table_name key.
    """
    conn = await asyncpg.connect(
        host=connection.host,
        port=connection.port,
        database=connection.database_name,
        user=connection.username,
        password=decrypt_password(connection.encrypted_password),
        timeout=EXTERNAL_DB_TIMEOUT,
    )
    try:
        rows = await conn.fetch(
            "SELECT table_name FROM information_schema.tables "
            "WHERE table_schema = $1 "
            "ORDER BY table_name",
            schema,
        )
        return [{"table_name": row["table_name"]} for row in rows]
    finally:
        await conn.close()


async def get_columns(connection: Connection, schema: str, table: str) -> list[dict[str, str | bool]]:
    """List columns from a specific table in an external PostgreSQL database.

    Args:
        connection: The Connection model instance.
        schema: The schema name.
        table: The table name.

    Returns:
        List of dicts with column_name, data_type, and is_nullable keys.
    """
    conn = await asyncpg.connect(
        host=connection.host,
        port=connection.port,
        database=connection.database_name,
        user=connection.username,
        password=decrypt_password(connection.encrypted_password),
        timeout=EXTERNAL_DB_TIMEOUT,
    )
    try:
        rows = await conn.fetch(
            "SELECT column_name, data_type, is_nullable "
            "FROM information_schema.columns "
            "WHERE table_schema = $1 AND table_name = $2 "
            "ORDER BY ordinal_position",
            schema,
            table,
        )
        return [
            {
                "column_name": row["column_name"],
                "data_type": row["data_type"],
                "is_nullable": row["is_nullable"] == "YES",
            }
            for row in rows
        ]
    finally:
        await conn.close()
