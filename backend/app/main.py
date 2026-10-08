from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.database import connect_to_mongo, close_mongo_connection
from app.routers.public import subjects as public_subjects
from app.routers.public import notes as public_notes
from app.routers.public import thinkers as public_thinkers
from app.routers.public import important_questions as public_important_questions
from app.routers.public import search as public_search
from app.routers.admin import auth as admin_auth
from app.routers.admin import subjects as admin_subjects
from app.routers.admin import notes as admin_notes
from app.routers.admin import thinkers as admin_thinkers
from app.routers.admin import important_questions as admin_important_questions
import traceback

# Captured at startup so /health can report it
_mongo_startup_error: str = ""

@asynccontextmanager
async def lifespan(app: FastAPI):
    global _mongo_startup_error
    try:
        await connect_to_mongo()
        _mongo_startup_error = ""
        print("MongoDB connected successfully.")
    except Exception as e:
        _mongo_startup_error = f"{type(e).__name__}: {e}"
        print(f"MongoDB connection FAILED: {_mongo_startup_error}")
        traceback.print_exc()
        print("Starting API without MongoDB connection.")
    yield
    try:
        await close_mongo_connection()
    except Exception:
        pass

app = FastAPI(
    title="POLISPHERE API",
    description="Political Science Academic Learning Hub Backend",
    version="1.0.0",
    lifespan=lifespan
)

# CORS — allow all origins so no browser preflight blocks debugging.
# (allow_credentials must be False when allow_origins=["*"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Public API routes
app.include_router(public_subjects.router, prefix="/api/v1")
app.include_router(public_notes.router, prefix="/api/v1")
app.include_router(public_thinkers.router, prefix="/api/v1")
app.include_router(public_important_questions.router, prefix="/api/v1")
app.include_router(public_search.router, prefix="/api/v1")

# Admin API routes
app.include_router(admin_auth.router, prefix="/api/v1")
app.include_router(admin_subjects.router, prefix="/api/v1")
app.include_router(admin_notes.router, prefix="/api/v1")
app.include_router(admin_thinkers.router, prefix="/api/v1")
app.include_router(admin_important_questions.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "app": "POLISPHERE Academic Hub API",
        "status": "online",
        "docs_url": "/docs"
    }

@app.get("/health")
async def health():
    """Diagnostic: live MongoDB ping + startup error report."""
    from app.database import db
    from motor.motor_asyncio import AsyncIOMotorClient

    live_ok = False
    live_error = ""
    try:
        test_client = AsyncIOMotorClient(settings.MONGO_URI, serverSelectionTimeoutMS=8000)
        await test_client.admin.command("ping")
        live_ok = True
        test_client.close()
    except Exception as e:
        live_error = f"{type(e).__name__}: {str(e)[:600]}"

    return {
        "db_client_initialized": db.client is not None,
        "startup_error": _mongo_startup_error or None,
        "live_ping_ok": live_ok,
        "live_ping_error": live_error or None,
        "mongo_uri_host": settings.MONGO_URI.split("@")[-1][:60] if "@" in settings.MONGO_URI else "no-credentials-in-uri",
    }
