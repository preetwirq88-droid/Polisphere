from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import HTTPException
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None

db = Database()

def get_database():
    if db.client is None:
        raise HTTPException(status_code=503, detail="Database not connected. Please try again shortly.")
    return db.client[settings.MONGO_DB_NAME]

async def connect_to_mongo():
    logger.info(f"Connecting to MongoDB...")

    # Standard Motor + Atlas connection — works on Python 3.11/3.12 (Render runtime).
    # Motor handles TLS automatically for mongodb+srv:// URIs.
    db.client = AsyncIOMotorClient(settings.MONGO_URI)

    # Ping to verify the connection works before continuing
    await db.client.admin.command("ping")
    logger.info("MongoDB connected and pinged successfully.")

    database = db.client[settings.MONGO_DB_NAME]

    # Create indexes
    await database.subjects.create_index("slug", unique=True)
    await database.notes.create_index("slug", unique=True)
    await database.notes.create_index("subject_id")
    await database.thinkers.create_index("slug", unique=True)
    await database.important_questions.create_index("subject_id")
    await database.admin_users.create_index("email", unique=True)

    # Text search indexes
    try:
        await database.notes.create_index([("title", "text"), ("keywords", "text"), ("sections.body", "text")])
        await database.thinkers.create_index([("name", "text"), ("contribution", "text"), ("bio", "text")])
        await database.subjects.create_index([("name", "text"), ("description", "text")])
    except Exception as e:
        logger.warning(f"Text index creation warning (may already exist): {e}")

    logger.info("MongoDB indexes verified.")

async def close_mongo_connection():
    if db.client:
        db.client.close()
        logger.info("MongoDB connection closed.")
