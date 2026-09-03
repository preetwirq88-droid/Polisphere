from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from datetime import datetime, timezone
from bson import ObjectId
from app.database import get_database
from app.deps import get_current_admin
from app.models.thinker import ThinkerCreate, ThinkerUpdate, ThinkerResponse

router = APIRouter(prefix="/admin/thinkers", tags=["Admin Thinkers"])

def format_thinker(doc: dict) -> ThinkerResponse:
    doc["id"] = str(doc["_id"])
    if "related_note_ids" in doc and doc["related_note_ids"]:
        doc["related_note_ids"] = [str(rid) for rid in doc["related_note_ids"]]
    if "related_subject_ids" in doc and doc["related_subject_ids"]:
        doc["related_subject_ids"] = [str(sid) for sid in doc["related_subject_ids"]]
    return ThinkerResponse(**doc)

@router.get("", response_model=List[ThinkerResponse])
async def admin_list_thinkers(admin: dict = Depends(get_current_admin)):
    db = get_database()
    cursor = db.thinkers.find().sort("name", 1)
    thinkers = await cursor.to_list(length=100)
    return [format_thinker(t) for t in thinkers]

@router.post("", response_model=ThinkerResponse, status_code=status.HTTP_201_CREATED)
async def admin_create_thinker(payload: ThinkerCreate, admin: dict = Depends(get_current_admin)):
    db = get_database()
    existing = await db.thinkers.find_one({"slug": payload.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Thinker with this slug already exists")
        
    doc = payload.model_dump()
    if payload.related_note_ids:
        doc["related_note_ids"] = [ObjectId(rid) for rid in payload.related_note_ids if ObjectId.is_valid(rid)]
    if payload.related_subject_ids:
        doc["related_subject_ids"] = [ObjectId(sid) for sid in payload.related_subject_ids if ObjectId.is_valid(sid)]

    doc["created_at"] = datetime.now(timezone.utc)
    doc["updated_at"] = datetime.now(timezone.utc)
    
    result = await db.thinkers.insert_one(doc)
    created = await db.thinkers.find_one({"_id": result.inserted_id})
    return format_thinker(created)

@router.put("/{thinker_id}", response_model=ThinkerResponse)
async def admin_update_thinker(thinker_id: str, payload: ThinkerUpdate, admin: dict = Depends(get_current_admin)):
    db = get_database()
    try:
        oid = ObjectId(thinker_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid thinker_id")
        
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    if "related_note_ids" in update_data:
        update_data["related_note_ids"] = [ObjectId(rid) for rid in update_data["related_note_ids"] if ObjectId.is_valid(rid)]
    if "related_subject_ids" in update_data:
        update_data["related_subject_ids"] = [ObjectId(sid) for sid in update_data["related_subject_ids"] if ObjectId.is_valid(sid)]

    update_data["updated_at"] = datetime.now(timezone.utc)
    
    result = await db.thinkers.update_one({"_id": oid}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Thinker not found")
        
    updated = await db.thinkers.find_one({"_id": oid})
    return format_thinker(updated)

@router.delete("/{thinker_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_thinker(thinker_id: str, admin: dict = Depends(get_current_admin)):
    db = get_database()
    try:
        oid = ObjectId(thinker_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid thinker_id")
        
    result = await db.thinkers.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Thinker not found")
