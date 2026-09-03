from fastapi import APIRouter, HTTPException, status
from typing import List
from bson import ObjectId
from app.database import get_database
from app.models.thinker import ThinkerResponse

router = APIRouter(prefix="/thinkers", tags=["Public Thinkers"])

def format_thinker(doc: dict) -> ThinkerResponse:
    doc["id"] = str(doc["_id"])
    if "related_note_ids" in doc and doc["related_note_ids"]:
        doc["related_note_ids"] = [str(rid) for rid in doc["related_note_ids"]]
    if "related_subject_ids" in doc and doc["related_subject_ids"]:
        doc["related_subject_ids"] = [str(sid) for sid in doc["related_subject_ids"]]
    return ThinkerResponse(**doc)

@router.get("", response_model=List[ThinkerResponse])
async def list_thinkers():
    db = get_database()
    cursor = db.thinkers.find().sort("name", 1)
    thinkers = await cursor.to_list(length=100)
    return [format_thinker(t) for t in thinkers]

@router.get("/{slug}", response_model=ThinkerResponse)
async def get_thinker_by_slug(slug: str):
    db = get_database()
    thinker = await db.thinkers.find_one({"slug": slug})
    if not thinker:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Thinker not found")
    return format_thinker(thinker)
