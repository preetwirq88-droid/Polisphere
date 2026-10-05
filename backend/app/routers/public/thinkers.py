import logging
from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from app.database import get_database
from app.models.thinker import ThinkerResponse

router = APIRouter(prefix="/thinkers", tags=["Public Thinkers"])
logger = logging.getLogger(__name__)


def format_thinker(doc: dict) -> Optional[ThinkerResponse]:
    """
    Safely convert a raw MongoDB thinker document to ThinkerResponse.
    Returns None if the document is invalid (so callers can skip it).
    """
    try:
        # Build a clean dict — never pass raw ObjectId fields to Pydantic
        clean: dict = {
            "id": str(doc["_id"]),
            "slug": doc.get("slug", ""),
            "name": doc.get("name", ""),
            "portrait_url": doc.get("portrait_url", ""),
            "contribution": doc.get("contribution", ""),
            "bio": doc.get("bio", ""),
            "key_works": [str(w) for w in doc.get("key_works", [])],
            "related_note_ids": [
                str(rid) for rid in doc.get("related_note_ids", [])
            ],
            "related_subject_ids": [
                str(sid) for sid in doc.get("related_subject_ids", [])
            ],
            "created_at": doc.get("created_at"),
            "updated_at": doc.get("updated_at"),
        }
        return ThinkerResponse(**clean)
    except Exception as exc:
        logger.warning("Skipping malformed thinker doc %s: %s", doc.get("_id"), exc)
        return None


@router.get("", response_model=List[ThinkerResponse])
async def list_thinkers():
    db = get_database()
    cursor = db.thinkers.find().sort("name", 1)
    raw_docs = await cursor.to_list(length=100)
    results = []
    for doc in raw_docs:
        thinker = format_thinker(doc)
        if thinker is not None:
            results.append(thinker)
    return results


@router.get("/{slug}", response_model=ThinkerResponse)
async def get_thinker_by_slug(slug: str):
    db = get_database()
    doc = await db.thinkers.find_one({"slug": slug})
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Thinker not found"
        )
    thinker = format_thinker(doc)
    if thinker is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Thinker document is malformed",
        )
    return thinker
