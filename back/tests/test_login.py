"""Tests for the POST /auth/login endpoint."""

from httpx import AsyncClient


async def test_login_success(client: AsyncClient, test_user: dict) -> None:
    """Correct credentials should return 200 with access token.

    Args:
        client: The async HTTP client.
        test_user: Ensures the user exists.
    """
    payload = {
        "email": "test@example.com",
        "password": "securepassword123",
    }

    response = await client.post("/auth/login", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


async def test_login_wrong_password(client: AsyncClient, test_user: dict) -> None:
    """Wrong password should return 401.

    Args:
        client: The async HTTP client.
        test_user: Ensures the user exists.
    """
    payload = {
        "email": "test@example.com",
        "password": "wrongpassword",
    }

    response = await client.post("/auth/login", json=payload)

    assert response.status_code == 401


async def test_login_nonexistent_email(client: AsyncClient) -> None:
    """Non-existent email should return 401.

    Args:
        client: The async HTTP client.
    """
    payload = {
        "email": "nobody@example.com",
        "password": "somepassword",
    }

    response = await client.post("/auth/login", json=payload)

    assert response.status_code == 401


async def test_login_missing_fields(client: AsyncClient) -> None:
    """Request without required fields should return 422.

    Args:
        client: The async HTTP client.
    """
    response = await client.post("/auth/login", json={})

    assert response.status_code == 422
