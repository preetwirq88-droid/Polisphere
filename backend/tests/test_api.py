import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_root_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    assert response.json()["app"] == "POLISPHERE Academic Hub API"

@pytest.mark.asyncio
async def test_admin_login_failure():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post(
            "/api/v1/admin/login",
            json={"email": "nonexistent@polisphere.app", "password": "wrongpassword"}
        )
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_admin_protected_routes_unauthorized():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/admin/subjects")
    assert response.status_code == 401
