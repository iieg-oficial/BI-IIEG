"""Tests for the POST /auth/register endpoint."""

from httpx import AsyncClient


async def test_register_success(client: AsyncClient) -> None:
    """Valid registration data should return 201 with user data.

    Args:
        client: The async HTTP client.
    """
    payload = {
        "email": "newuser@example.com",
        "password": "strongpassword",
        "full_name": "New User",
    }

    response = await client.post("/auth/register", json=payload)

    assert response.status_code == 201
    data = response.json()
    assert data["email"] == payload["email"]
    assert data["full_name"] == payload["full_name"]
    assert "id" in data
    assert "created_at" in data
    assert "password" not in data
    assert "password_hash" not in data


async def test_register_duplicate_email(client: AsyncClient, test_user: dict) -> None:
    """Registering with an already-used email should return 409.

    Args:
        client: The async HTTP client.
        test_user: Ensures the email is already registered.
    """
    payload = {
        "email": "test@example.com",
        "password": "anotherpassword",
        "full_name": "Another User",
    }

    response = await client.post("/auth/register", json=payload)

    assert response.status_code == 409


async def test_register_missing_email(client: AsyncClient) -> None:
    """Request without email should return 422.

    Args:
        client: The async HTTP client.
    """
    payload = {
        "password": "strongpassword",
        "full_name": "No Email User",
    }

    response = await client.post("/auth/register", json=payload)

    assert response.status_code == 422


async def test_register_short_password(client: AsyncClient) -> None:
    """Password shorter than 8 characters should return 422.

    Args:
        client: The async HTTP client.
    """
    payload = {
        "email": "short@example.com",
        "password": "short",
        "full_name": "Short Password User",
    }

    response = await client.post("/auth/register", json=payload)

    assert response.status_code == 422


async def test_register_missing_full_name(client: AsyncClient) -> None:
    """Request without full_name should return 422.

    Args:
        client: The async HTTP client.
    """
    payload = {
        "email": "noname@example.com",
        "password": "strongpassword",
    }

    response = await client.post("/auth/register", json=payload)

    assert response.status_code == 422


async def test_register_empty_full_name(client: AsyncClient) -> None:
    """Empty full_name string should return 422.

    Args:
        client: The async HTTP client.
    """
    payload = {
        "email": "emptyname@example.com",
        "password": "strongpassword",
        "full_name": "",
    }

    response = await client.post("/auth/register", json=payload)

    assert response.status_code == 422
