"""Shared fixtures for the test suite."""

import logging
from collections.abc import AsyncGenerator

import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from db import Base
from dependencies import get_db
from main import app

logger = logging.getLogger(__name__)

TEST_DATABASE_URL = "sqlite+aiosqlite://"

engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

test_session_factory = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
    """Yield a test database session with commit/rollback handling.

    Yields:
        AsyncSession: A test async SQLAlchemy session.
    """
    async with test_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


@pytest_asyncio.fixture
async def test_db() -> AsyncGenerator[None, None]:
    """Create all tables before a test and drop them after.

    Yields:
        None
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def client(test_db: None) -> AsyncGenerator[AsyncClient, None]:
    """Provide an async HTTP client wired to the FastAPI app with test DB.

    Args:
        test_db: Ensures tables exist before requests.

    Yields:
        AsyncClient: An httpx async client for making requests.
    """
    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()


TEST_USER_EMAIL = "test@example.com"
TEST_USER_PASSWORD = "securepassword123"
TEST_USER_FULL_NAME = "Test User"


@pytest_asyncio.fixture
async def test_user(client: AsyncClient) -> dict:
    """Register a test user and return the response data.

    Args:
        client: The async HTTP client.

    Returns:
        The user data dict from the registration response.
    """
    response = await client.post(
        "/auth/register",
        json={
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD,
            "full_name": TEST_USER_FULL_NAME,
        },
    )
    return response.json()


@pytest_asyncio.fixture
async def auth_headers(client: AsyncClient, test_user: dict) -> dict[str, str]:
    """Log in the test user and return Authorization headers.

    Args:
        client: The async HTTP client.
        test_user: Ensures the user exists before login.

    Returns:
        A dict with the Authorization Bearer header.
    """
    response = await client.post(
        "/auth/login",
        json={
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD,
        },
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
