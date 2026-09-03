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

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(
    title="POLISPHERE API",
    description="Political Science Academic Learning Hub Backend",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
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
