"""FastAPI application entry point."""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from routes.auth import router as auth_router
from routes.charts import router as charts_router
from routes.connections import router as connections_router
from routes.dashboards import router as dashboards_router
from routes.queries import router as queries_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="BI-IIEG API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(charts_router)
app.include_router(connections_router)
app.include_router(dashboards_router)
app.include_router(queries_router)


@app.get("/")
async def health_check() -> dict[str, str]:
    """Health check endpoint.

    Returns:
        A dict with status "ok".
    """
    return {"status": "ok"}
