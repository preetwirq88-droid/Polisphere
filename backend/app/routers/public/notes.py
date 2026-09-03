from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
from bson import ObjectId
from app.database import get_database
from app.models.note import NoteResponse

router = APIRouter(prefix="/notes", tags=["Public Notes"])

async def format_note(doc: dict) -> NoteResponse:
    doc["id"] = str(doc["_id"])
    doc["subject_id"] = str(doc["subject_id"])
    if "related_note_ids" in doc and doc["related_note_ids"]:
        doc["related_note_ids"] = [str(rid) for rid in doc["related_note_ids"]]
    
    # Attach subject_name
    db = get_database()
    try:
        subject = await db.subjects.find_one({"_id": ObjectId(doc["subject_id"])})
        if subject:
            doc["subject_name"] = subject.get("name")
    except Exception:
        pass
        
    return NoteResponse(**doc)

@router.get("", response_model=List[NoteResponse])
async def list_notes(
    subject_id: Optional[str] = Query(None),
    subject_slug: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None)
):
    db = get_database()
    query = {"status": {"$ne": "draft"}} # Hide drafts from public
    
    if status_filter and status_filter != "all":
        query["status"] = status_filter
        
    if difficulty and difficulty != "all":
        query["difficulty"] = difficulty
        
    if subject_slug:
        subject = await db.subjects.find_one({"slug": subject_slug})
        if subject:
            query["subject_id"] = subject["_id"]
    elif subject_id:
        try:
            query["subject_id"] = ObjectId(subject_id)
        except Exception:
            return []

    cursor = db.notes.find(query).sort("created_at", -1)
    notes = await cursor.to_list(length=100)
    
    res = []
    for n in notes:
        res.append(await format_note(n))
    return res

@router.get("/{slug}", response_model=NoteResponse)
async def get_note_by_slug(slug: str):
    db = get_database()
    note = await db.notes.find_one({"slug": slug})
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    return await format_note(note)
