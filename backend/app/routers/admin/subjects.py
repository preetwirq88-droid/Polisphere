from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from datetime import datetime, timezone
from bson import ObjectId
from app.database import get_database
from app.deps import get_current_admin
from app.models.subject import SubjectCreate, SubjectUpdate, SubjectResponse

router = APIRouter(prefix="/admin/subjects", tags=["Admin Subjects"])

def format_subject(doc: dict) -> SubjectResponse:
    doc["id"] = str(doc["_id"])
    return SubjectResponse(**doc)

@router.get("", response_model=List[SubjectResponse])
async def admin_list_subjects(admin: dict = Depends(get_current_admin)):
    db = get_database()
    cursor = db.subjects.find().sort("order", 1)
    subjects = await cursor.to_list(length=100)
    return [format_subject(s) for s in subjects]

@router.post("", response_model=SubjectResponse, status_code=status.HTTP_201_CREATED)
async def admin_create_subject(payload: SubjectCreate, admin: dict = Depends(get_current_admin)):
    db = get_database()
    existing = await db.subjects.find_one({"slug": payload.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Subject with this slug already exists")
        
    doc = payload.model_dump()
    doc["created_at"] = datetime.now(timezone.utc)
    doc["updated_at"] = datetime.now(timezone.utc)
    
    result = await db.subjects.insert_one(doc)
    created = await db.subjects.find_one({"_id": result.inserted_id})
    return format_subject(created)

@router.put("/{subject_id}", response_model=SubjectResponse)
async def admin_update_subject(subject_id: str, payload: SubjectUpdate, admin: dict = Depends(get_current_admin)):
    db = get_database()
    try:
        oid = ObjectId(subject_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid subject_id")
        
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc)
    
    result = await db.subjects.update_one({"_id": oid}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Subject not found")
        
    updated = await db.subjects.find_one({"_id": oid})
    return format_subject(updated)

@router.delete("/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_subject(subject_id: str, admin: dict = Depends(get_current_admin)):
    db = get_database()
    try:
        oid = ObjectId(subject_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid subject_id")
        
    result = await db.subjects.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Subject not found")
