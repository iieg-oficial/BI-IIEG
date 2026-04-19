"""Tests for the dashboards module endpoints."""

from httpx import AsyncClient


async def _register_and_login(
    client: AsyncClient,
    email: str,
    password: str = "anotherpassword123",
) -> dict[str, str]:
    """Register a secondary user and return Authorization headers.

    Args:
        client: The async HTTP client.
        email: Email for the secondary user.
        password: Password for the secondary user.

    Returns:
        A dict with the Authorization Bearer header.
    """
    await client.post(
        "/auth/register",
        json={
            "email": email,
            "password": password,
            "full_name": "Another User",
        },
    )
    login = await client.post(
        "/auth/login",
        json={"email": email, "password": password},
    )
    token = login.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


async def test_create_dashboard(
    client: AsyncClient,
    auth_headers: dict[str, str],
) -> None:
    """POST /dashboards creates a dashboard and returns 201.

    Args:
        client: The async HTTP client.
        auth_headers: Authenticated user headers.
    """
    response = await client.post(
        "/dashboards",
        json={
            "name": "My Dashboard",
            "description": "A test dashboard",
            "layout": [
                {
                    "id": "block-1",
                    "type": "markdown",
                    "x": 0,
                    "y": 0,
                    "w": 4,
                    "h": 2,
                    "markdown": "# Hello",
                }
            ],
        },
        headers=auth_headers,
    )

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "My Dashboard"
    assert data["description"] == "A test dashboard"
    assert len(data["layout"]) == 1
    assert data["layout"][0]["id"] == "block-1"
    assert data["layout"][0]["type"] == "markdown"
    assert data["layout"][0]["markdown"] == "# Hello"
    assert "id" in data
    assert "user_id" in data


async def test_create_dashboard_default_layout(
    client: AsyncClient,
    auth_headers: dict[str, str],
) -> None:
    """Creating a dashboard without layout defaults to an empty list.

    Args:
        client: The async HTTP client.
        auth_headers: Authenticated user headers.
    """
    response = await client.post(
        "/dashboards",
        json={"name": "Empty"},
        headers=auth_headers,
    )

    assert response.status_code == 201
    data = response.json()
    assert data["layout"] == []
    assert data["description"] is None


async def test_list_dashboards(
    client: AsyncClient,
    auth_headers: dict[str, str],
) -> None:
    """GET /dashboards returns only the current user's dashboards.

    Args:
        client: The async HTTP client.
        auth_headers: Authenticated user headers.
    """
    await client.post("/dashboards", json={"name": "D1"}, headers=auth_headers)
    await client.post("/dashboards", json={"name": "D2"}, headers=auth_headers)

    other_headers = await _register_and_login(client, "other@example.com")
    await client.post("/dashboards", json={"name": "Other"}, headers=other_headers)

    response = await client.get("/dashboards", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    names = {item["name"] for item in data}
    assert names == {"D1", "D2"}


async def test_get_dashboard(
    client: AsyncClient,
    auth_headers: dict[str, str],
) -> None:
    """GET /dashboards/{id} returns the dashboard for its owner.

    Args:
        client: The async HTTP client.
        auth_headers: Authenticated user headers.
    """
    created = await client.post(
        "/dashboards",
        json={"name": "Detail"},
        headers=auth_headers,
    )
    dashboard_id = created.json()["id"]

    response = await client.get(f"/dashboards/{dashboard_id}", headers=auth_headers)

    assert response.status_code == 200
    assert response.json()["id"] == dashboard_id
    assert response.json()["name"] == "Detail"


async def test_get_dashboard_not_found(
    client: AsyncClient,
    auth_headers: dict[str, str],
) -> None:
    """GET /dashboards/{id} returns 404 for a non-existent dashboard.

    Args:
        client: The async HTTP client.
        auth_headers: Authenticated user headers.
    """
    response = await client.get("/dashboards/9999", headers=auth_headers)
    assert response.status_code == 404


async def test_get_dashboard_of_other_user(
    client: AsyncClient,
    auth_headers: dict[str, str],
) -> None:
    """Accessing another user's dashboard is forbidden.

    Args:
        client: The async HTTP client.
        auth_headers: Authenticated user headers.
    """
    other_headers = await _register_and_login(client, "other@example.com")
    created = await client.post(
        "/dashboards",
        json={"name": "Private"},
        headers=other_headers,
    )
    dashboard_id = created.json()["id"]

    response = await client.get(f"/dashboards/{dashboard_id}", headers=auth_headers)

    assert response.status_code == 403


async def test_update_dashboard(
    client: AsyncClient,
    auth_headers: dict[str, str],
) -> None:
    """PUT /dashboards/{id} applies partial updates including layout.

    Args:
        client: The async HTTP client.
        auth_headers: Authenticated user headers.
    """
    created = await client.post(
        "/dashboards",
        json={"name": "Original", "description": "old"},
        headers=auth_headers,
    )
    dashboard_id = created.json()["id"]

    new_layout = [
        {
            "id": "b1",
            "type": "chart",
            "x": 0,
            "y": 0,
            "w": 6,
            "h": 4,
            "chartId": 42,
        },
        {
            "id": "b2",
            "type": "markdown",
            "x": 6,
            "y": 0,
            "w": 6,
            "h": 4,
            "markdown": "notes",
        },
    ]
    response = await client.put(
        f"/dashboards/{dashboard_id}",
        json={"name": "Updated", "layout": new_layout},
        headers=auth_headers,
    )

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated"
    assert data["description"] == "old"
    assert len(data["layout"]) == 2
    assert data["layout"][0]["chartId"] == 42
    assert data["layout"][1]["markdown"] == "notes"


async def test_update_dashboard_of_other_user(
    client: AsyncClient,
    auth_headers: dict[str, str],
) -> None:
    """Updating another user's dashboard is forbidden.

    Args:
        client: The async HTTP client.
        auth_headers: Authenticated user headers.
    """
    other_headers = await _register_and_login(client, "other@example.com")
    created = await client.post(
        "/dashboards",
        json={"name": "Private"},
        headers=other_headers,
    )
    dashboard_id = created.json()["id"]

    response = await client.put(
        f"/dashboards/{dashboard_id}",
        json={"name": "Hacked"},
        headers=auth_headers,
    )

    assert response.status_code == 403


async def test_delete_dashboard(
    client: AsyncClient,
    auth_headers: dict[str, str],
) -> None:
    """DELETE /dashboards/{id} removes the dashboard and returns 204.

    Args:
        client: The async HTTP client.
        auth_headers: Authenticated user headers.
    """
    created = await client.post(
        "/dashboards",
        json={"name": "ToDelete"},
        headers=auth_headers,
    )
    dashboard_id = created.json()["id"]

    response = await client.delete(
        f"/dashboards/{dashboard_id}",
        headers=auth_headers,
    )
    assert response.status_code == 204

    missing = await client.get(f"/dashboards/{dashboard_id}", headers=auth_headers)
    assert missing.status_code == 404


async def test_delete_dashboard_of_other_user(
    client: AsyncClient,
    auth_headers: dict[str, str],
) -> None:
    """Deleting another user's dashboard is forbidden.

    Args:
        client: The async HTTP client.
        auth_headers: Authenticated user headers.
    """
    other_headers = await _register_and_login(client, "other@example.com")
    created = await client.post(
        "/dashboards",
        json={"name": "Private"},
        headers=other_headers,
    )
    dashboard_id = created.json()["id"]

    response = await client.delete(
        f"/dashboards/{dashboard_id}",
        headers=auth_headers,
    )

    assert response.status_code == 403


async def test_dashboards_require_auth(client: AsyncClient) -> None:
    """All /dashboards endpoints require authentication.

    Args:
        client: The async HTTP client.
    """
    assert (await client.get("/dashboards")).status_code == 401
    assert (await client.post("/dashboards", json={"name": "x"})).status_code == 401
