"""Tests for the health check endpoint."""

from httpx import AsyncClient


async def test_health_check_returns_ok(client: AsyncClient) -> None:
    """GET / should return 200 with status ok.

    Args:
        client: The async HTTP client.
    """
    response = await client.get("/")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
