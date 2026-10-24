from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import HTTPException
from app.config import settings
import certifi
import logging
from urllib.parse import urlparse, quote_plus, unquote_plus, urlunparse

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None

db = Database()

def get_database():
    if db.client is None:
        raise HTTPException(status_code=503, detail="Database not connected. Please try again shortly.")
    return db.client[settings.MONGO_DB_NAME]


def _encode_mongo_uri(uri: str) -> str:
    """
    Safely percent-encode the username and password in a MongoDB URI so that
    special characters (e.g. @, :, /, +, #) don't confuse the PyMongo URI
    parser.

    The function is idempotent: it first decodes any existing percent-encoding
    with unquote_plus, then re-encodes with quote_plus. This means:
      - A plain-text password with special chars is encoded correctly.
      - An already-encoded password is NOT double-encoded.
      - A clean alphanumeric password is returned unchanged.

    All other URI components (scheme, host, path, query, fragment) are
    preserved exactly as-is. No credentials are logged.
    """
    try:
        parsed = urlparse(uri)
        # Only act when credentials are present in the URI
        if not (parsed.username and parsed.password):
            return uri

        # Normalise: decode any existing percent-encoding first, then
        # re-encode cleanly. quote_plus(unquote_plus(x)) is idempotent.
        encoded_user = quote_plus(unquote_plus(parsed.username))
        encoded_pass = quote_plus(unquote_plus(parsed.password))

        # Reconstruct netloc: user:pass@host[:port]
        host_part = parsed.hostname or ""
        if parsed.port:
            host_part = f"{host_part}:{parsed.port}"
        new_netloc = f"{encoded_user}:{encoded_pass}@{host_part}"

        # Rebuild the full URI, preserving scheme, path, query, fragment
        return urlunparse((
            parsed.scheme,
            new_netloc,
            parsed.path,
            parsed.params,
            parsed.query,
            parsed.fragment,
        ))
    except Exception as exc:
        logger.warning("URI credential encoding failed, using original URI: %s", exc)
    return uri


async def connect_to_mongo():
    logger.info("Connecting to MongoDB...")

    # Encode special characters in URI credentials before passing to Motor.
    # Render (and some platforms) store env vars verbatim; passwords with
    # characters like @, :, / must be percent-encoded per RFC 3986.
    safe_uri = _encode_mongo_uri(settings.MONGO_URI)
    # Log only the host portion — never the credentials
    host_hint = safe_uri.split("@")[-1][:60] if "@" in safe_uri else "no-credentials-in-uri"
    logger.info("Connecting to MongoDB host: %s", host_hint)

    # Create client first, but only assign to db.client after a successful ping.
    # This ensures get_database() returns a proper 503 (not an unhandled 500) if
    # the Atlas cluster is unreachable.
    client = AsyncIOMotorClient(
        safe_uri,
        serverSelectionTimeoutMS=10000,
        tlsCAFile=certifi.where(),
    )

    # Ping to verify the connection works before we expose the client
    await client.admin.command("ping")
    logger.info("MongoDB connected and pinged successfully.")

    # Only assign after successful ping
    db.client = client

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
