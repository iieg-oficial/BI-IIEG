"""Tests for the GET /auth/me endpoint."""

from datetime import timedelta

from httpx import AsyncClient

from services.auth import create_access_token


async def test_me_success(
    client: AsyncClient,
    test_user: dict,
    auth_headers: dict[str, str],
) -> None:
    """Valid token should return 200 with current user data.

    Args:
        client: The async HTTP client.
        test_user: The registered user data for comparison.
        auth_headers: Authorization headers with valid Bearer token.
    """
    response = await client.get("/auth/me", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user["email"]
    assert data["full_name"] == test_user["full_name"]
    assert data["id"] == test_user["id"]
    assert "created_at" in data


async def test_me_no_token(client: AsyncClient) -> None:
    """Request without Authorization header should return 401.

    Args:
        client: The async HTTP client.
    """
    response = await client.get("/auth/me")

    assert response.status_code == 401


async def test_me_invalid_token(client: AsyncClient) -> None:
    """Request with an invalid token should return 401.

    Args:
        client: The async HTTP client.
    """
    headers = {"Authorization": "Bearer invalidtoken"}

    response = await client.get("/auth/me", headers=headers)

    assert response.status_code == 401


async def test_me_expired_token(client: AsyncClient, test_user: dict) -> None:
    """Request with an expired token should return 401.

    Args:
        client: The async HTTP client.
        test_user: Ensures the user exists.
    """
    expired_token = create_access_token(
        data={"sub": test_user["email"]},
        expires_delta=timedelta(seconds=-1),
    )
    headers = {"Authorization": f"Bearer {expired_token}"}

    response = await client.get("/auth/me", headers=headers)

    assert response.status_code == 401
