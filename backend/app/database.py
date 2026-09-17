from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
import logging
import ssl
import certifi

# ---------------------------------------------------------------------------
# Python 3.14 / OpenSSL 3.x SSL compatibility patch for MongoDB Atlas
# OpenSSL 3.x defaults to SECLEVEL=2 which breaks TLS handshake with Atlas.
# Lowering to SECLEVEL=1 restores compatibility without disabling encryption.
# ---------------------------------------------------------------------------
_original_create_default_context = ssl.create_default_context

def _patched_create_default_context(*args, **kwargs):
    ctx = _original_create_default_context(*args, **kwargs)
    try:
        ctx.set_ciphers("DEFAULT@SECLEVEL=1")
    except ssl.SSLError:
        pass
    return ctx

ssl.create_default_context = _patched_create_default_context
# ---------------------------------------------------------------------------

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None

db = Database()

def get_database():
    return db.client[settings.MONGO_DB_NAME]

async def connect_to_mongo():
    logger.info(f"Connecting to MongoDB at {settings.MONGO_URI}...")
    db.client = AsyncIOMotorClient(
        settings.MONGO_URI,
        tlsCAFile=certifi.where(),
        tlsAllowInvalidCertificates=False,
    )
    database = db.client[settings.MONGO_DB_NAME]
    
    # Create indexes
    await database.subjects.create_index("slug", unique=True)
    await database.notes.create_index("slug", unique=True)
    await database.notes.create_index("subject_id")
    await database.thinkers.create_index("slug", unique=True)
    await database.important_questions.create_index("subject_id")
    await database.admin_users.create_index("email", unique=True)
    
    # Text search indexes across notes, thinkers, subjects
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
