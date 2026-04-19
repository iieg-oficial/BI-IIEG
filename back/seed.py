"""Seed script to populate the BI-IIEG database with demo data."""

import asyncio
import base64
import hashlib
import json
import logging
import os
from urllib.parse import urlparse

import asyncpg
from cryptography.fernet import Fernet
from passlib.context import CryptContext

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _derive_fernet_key(secret_key: str) -> bytes:
    """Derive a Fernet-compatible key from a secret string.

    Args:
        secret_key: Application secret key.

    Returns:
        URL-safe base64-encoded 32-byte key.
    """
    digest = hashlib.sha256(secret_key.encode()).digest()
    return base64.urlsafe_b64encode(digest)


def encrypt_password(plain: str, secret_key: str) -> str:
    """Encrypt a plaintext password using Fernet symmetric encryption.

    Args:
        plain: Plaintext password to encrypt.
        secret_key: Application secret key used to derive the Fernet key.

    Returns:
        Encrypted password as a string.
    """
    fernet = Fernet(_derive_fernet_key(secret_key))
    return fernet.encrypt(plain.encode()).decode()


def parse_database_url(database_url: str) -> dict[str, str | int]:
    """Parse a DATABASE_URL into individual connection parameters.

    Handles both ``postgresql+asyncpg://`` and ``postgresql://`` prefixes.

    Args:
        database_url: Full database URL string.

    Returns:
        Dict with host, port, user, password, and database keys.
    """
    normalized = database_url.replace("postgresql+asyncpg://", "postgresql://")
    parsed = urlparse(normalized)
    return {
        "host": parsed.hostname or "localhost",
        "port": parsed.port or 5432,
        "user": parsed.username or "bi_iieg",
        "password": parsed.password or "",
        "database": parsed.path.lstrip("/") or "bi_iieg",
    }


async def seed() -> None:
    """Populate the BI-IIEG database with demo user, connection, queries, and charts."""
    database_url = os.environ.get(
        "DATABASE_URL",
        "postgresql+asyncpg://bi_iieg:changeme@localhost:5432/bi_iieg",
    )
    secret_key = os.environ.get("SECRET_KEY", "change-this-to-a-random-secret-key")

    db_params = parse_database_url(database_url)

    conn: asyncpg.Connection = await asyncpg.connect(
        host=db_params["host"],
        port=db_params["port"],
        user=db_params["user"],
        password=db_params["password"],
        database=db_params["database"],
    )

    try:
        # Check idempotency
        existing = await conn.fetchrow(
            "SELECT id FROM users WHERE email = $1",
            "demo@iieg.gob.mx",
        )
        if existing:
            logger.info("Demo data already exists, skipping seed.")
            return

        # -- User --
        password_hash = pwd_context.hash("demo1234")
        user_row = await conn.fetchrow(
            """
            INSERT INTO users (email, password_hash, full_name)
            VALUES ($1, $2, $3)
            ON CONFLICT (email) DO NOTHING
            RETURNING id
            """,
            "demo@iieg.gob.mx",
            password_hash,
            "Usuario Demo",
        )
        if user_row is None:
            logger.info("Demo user insert conflict, skipping seed.")
            return
        user_id: int = user_row["id"]
        logger.info("Created demo user (id=%s)", user_id)

        # -- Connection --
        encrypted_pw = encrypt_password(str(db_params["password"]), secret_key)
        conn_row = await conn.fetchrow(
            """
            INSERT INTO connections (user_id, name, host, port, database_name, username, encrypted_password)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
            """,
            user_id,
            "Datos de Prueba",
            "db",
            5432,
            "dummy_data",
            str(db_params["user"]),
            encrypted_pw,
        )
        connection_id: int = conn_row["id"]
        logger.info("Created demo connection (id=%s)", connection_id)

        # -- Saved Queries --
        queries = [
            {
                "name": "Ventas por región",
                "sql_text": (
                    "SELECT r.nombre AS region, SUM(v.monto) AS total_ventas, "
                    "SUM(v.cantidad) AS total_unidades "
                    "FROM ventas v JOIN regiones r ON v.region_id = r.id "
                    "GROUP BY r.nombre ORDER BY total_ventas DESC"
                ),
                "description": "Resumen de ventas totales agrupadas por región",
            },
            {
                "name": "Productos por categoría",
                "sql_text": (
                    "SELECT categoria, COUNT(*) AS total_productos, "
                    "AVG(precio) AS precio_promedio, SUM(stock) AS stock_total "
                    "FROM productos GROUP BY categoria ORDER BY total_productos DESC"
                ),
                "description": "Resumen de productos agrupados por categoría",
            },
            {
                "name": "Ingresos mensuales 2024",
                "sql_text": (
                    "SELECT TO_CHAR(fecha, 'YYYY-MM') AS mes, SUM(monto) AS ingresos "
                    "FROM ventas WHERE fecha >= '2024-01-01' AND fecha < '2025-01-01' "
                    "GROUP BY TO_CHAR(fecha, 'YYYY-MM') ORDER BY mes"
                ),
                "description": "Ingresos mensuales durante el año 2024",
            },
        ]

        query_ids: list[int] = []
        for q in queries:
            row = await conn.fetchrow(
                """
                INSERT INTO saved_queries (user_id, connection_id, name, sql_text, description)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id
                """,
                user_id,
                connection_id,
                q["name"],
                q["sql_text"],
                q["description"],
            )
            query_ids.append(row["id"])
        logger.info("Created %d saved queries", len(query_ids))

        # -- Charts --
        charts = [
            {
                "name": "Ventas por región",
                "sql_text": queries[0]["sql_text"],
                "chart_type": "bar",
                "config": json.dumps({
                    "x_column": "region",
                    "y_columns": ["total_ventas"],
                    "title": "Ventas totales por región",
                }),
                "saved_query_id": query_ids[0],
            },
            {
                "name": "Tendencia de ingresos mensuales",
                "sql_text": queries[2]["sql_text"],
                "chart_type": "line",
                "config": json.dumps({
                    "x_column": "mes",
                    "y_columns": ["ingresos"],
                    "title": "Ingresos mensuales 2024",
                }),
                "saved_query_id": query_ids[2],
            },
            {
                "name": "Distribución por departamento",
                "sql_text": (
                    "SELECT departamento, COUNT(*) AS total "
                    "FROM empleados GROUP BY departamento ORDER BY total DESC"
                ),
                "chart_type": "pie",
                "config": json.dumps({
                    "x_column": "departamento",
                    "y_columns": ["total"],
                    "title": "Empleados por departamento",
                }),
                "saved_query_id": None,
            },
        ]

        for c in charts:
            await conn.execute(
                """
                INSERT INTO charts (user_id, connection_id, saved_query_id, name, sql_text, chart_type, config)
                VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
                """,
                user_id,
                connection_id,
                c["saved_query_id"],
                c["name"],
                c["sql_text"],
                c["chart_type"],
                c["config"],
            )
        logger.info("Created %d charts", len(charts))

        logger.info("Seed data inserted successfully.")
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(seed())
