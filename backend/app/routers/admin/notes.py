from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from datetime import datetime, timezone
from bson import ObjectId
from app.database import get_database
from app.deps import get_current_admin
from app.models.note import NoteCreate, NoteUpdate, NoteResponse

router = APIRouter(prefix="/admin/notes", tags=["Admin Notes"])

async def format_note(doc: dict) -> NoteResponse:
    doc["id"] = str(doc["_id"])
    doc["subject_id"] = str(doc["subject_id"])
    if "related_note_ids" in doc and doc["related_note_ids"]:
        doc["related_note_ids"] = [str(rid) for rid in doc["related_note_ids"]]
    
    db = get_database()
    try:
        subject = await db.subjects.find_one({"_id": ObjectId(doc["subject_id"])})
        if subject:
            doc["subject_name"] = subject.get("name")
    except Exception:
        pass
        
    return NoteResponse(**doc)

@router.get("", response_model=List[NoteResponse])
async def admin_list_notes(admin: dict = Depends(get_current_admin)):
    db = get_database()
    cursor = db.notes.find().sort("created_at", -1)
    notes = await cursor.to_list(length=200)
    res = []
    for n in notes:
        res.append(await format_note(n))
    return res

@router.post("", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
async def admin_create_note(payload: NoteCreate, admin: dict = Depends(get_current_admin)):
    db = get_database()
    existing = await db.notes.find_one({"slug": payload.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Note with this slug already exists")
        
    doc = payload.model_dump()
    try:
        doc["subject_id"] = ObjectId(payload.subject_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid subject_id")
        
    if payload.related_note_ids:
        doc["related_note_ids"] = [ObjectId(rid) for rid in payload.related_note_ids if ObjectId.is_valid(rid)]
    else:
        doc["related_note_ids"] = []

    doc["created_at"] = datetime.now(timezone.utc)
    doc["updated_at"] = datetime.now(timezone.utc)
    
    result = await db.notes.insert_one(doc)
    created = await db.notes.find_one({"_id": result.inserted_id})
    return await format_note(created)

@router.put("/{note_id}", response_model=NoteResponse)
async def admin_update_note(note_id: str, payload: NoteUpdate, admin: dict = Depends(get_current_admin)):
    db = get_database()
    try:
        oid = ObjectId(note_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid note_id")
        
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    if "subject_id" in update_data:
        try:
            update_data["subject_id"] = ObjectId(update_data["subject_id"])
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid subject_id")
            
    if "related_note_ids" in update_data:
        update_data["related_note_ids"] = [ObjectId(rid) for rid in update_data["related_note_ids"] if ObjectId.is_valid(rid)]
        
    update_data["updated_at"] = datetime.now(timezone.utc)
    
    result = await db.notes.update_one({"_id": oid}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Note not found")
        
    updated = await db.notes.find_one({"_id": oid})
    return await format_note(updated)

@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_note(note_id: str, admin: dict = Depends(get_current_admin)):
    db = get_database()
    try:
        oid = ObjectId(note_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid note_id")
        
    result = await db.notes.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Note not found")
