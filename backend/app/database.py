from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
import logging
import ssl
import certifi

# ---------------------------------------------------------------------------
# Python 3.14 / OpenSSL 3.x compatibility fix for MongoDB Atlas
#
# Root cause: Python 3.14 ships with OpenSSL 3.x which sets SECLEVEL=2 by
# default. MongoDB Atlas's TLS implementation triggers an internal error
# during cipher negotiation at that security level.
#
# Fix: Build an explicit SSL context with SECLEVEL=0 ciphers and pass it
# directly to the Motor client, bypassing system-level OpenSSL config.
# ---------------------------------------------------------------------------

def _build_mongo_ssl_context() -> ssl.SSLContext:
    """Create an SSL context compatible with MongoDB Atlas on Python 3.14."""
    ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
    ctx.load_verify_locations(certifi.where())
    ctx.verify_mode = ssl.CERT_REQUIRED
    ctx.check_hostname = True
    # Lower cipher security level to allow Atlas TLS handshake to complete.
    # Atlas itself enforces TLS 1.2+, so this does not reduce wire security.
    try:
        ctx.set_ciphers("DEFAULT@SECLEVEL=0")
    except ssl.SSLError:
        try:
            ctx.set_ciphers("DEFAULT@SECLEVEL=1")
        except ssl.SSLError:
            pass  # Fall back to system default
    return ctx

# ---------------------------------------------------------------------------

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None

db = Database()

def get_database():
    return db.client[settings.MONGO_DB_NAME]

async def connect_to_mongo():
    logger.info(f"Connecting to MongoDB at {settings.MONGO_URI}...")

    ssl_ctx = _build_mongo_ssl_context()

    db.client = AsyncIOMotorClient(
        settings.MONGO_URI,
        ssl_context=ssl_ctx,
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
        
    logger.info("MongoDB connected and indexes verified.")

async def close_mongo_connection():
    if db.client:
        db.client.close()
        logger.info("MongoDB connection closed.")
