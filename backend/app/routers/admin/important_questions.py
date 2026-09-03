from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from datetime import datetime, timezone
from bson import ObjectId
from app.database import get_database
from app.deps import get_current_admin
from app.models.important_question import ImportantQuestionCreate, ImportantQuestionUpdate, ImportantQuestionResponse

router = APIRouter(prefix="/admin/important-questions", tags=["Admin Important Questions"])

async def format_question(doc: dict) -> ImportantQuestionResponse:
    doc["id"] = str(doc["_id"])
    doc["subject_id"] = str(doc["subject_id"])
    if doc.get("note_id"):
        doc["note_id"] = str(doc["note_id"])
        
    db = get_database()
    try:
        subject = await db.subjects.find_one({"_id": ObjectId(doc["subject_id"])})
        if subject:
            doc["subject_name"] = subject.get("name")
    except Exception:
        pass
        
    return ImportantQuestionResponse(**doc)

@router.get("", response_model=List[ImportantQuestionResponse])
async def admin_list_important_questions(admin: dict = Depends(get_current_admin)):
    db = get_database()
    cursor = db.important_questions.find().sort("created_at", -1)
    questions = await cursor.to_list(length=200)
    res = []
    for q in questions:
        res.append(await format_question(q))
    return res

@router.post("", response_model=ImportantQuestionResponse, status_code=status.HTTP_201_CREATED)
async def admin_create_important_question(payload: ImportantQuestionCreate, admin: dict = Depends(get_current_admin)):
    db = get_database()
    doc = payload.model_dump()
    try:
        doc["subject_id"] = ObjectId(payload.subject_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid subject_id")
        
    if payload.note_id:
        try:
            doc["note_id"] = ObjectId(payload.note_id)
        except Exception:
            doc["note_id"] = None

    doc["created_at"] = datetime.now(timezone.utc)
    
    result = await db.important_questions.insert_one(doc)
    created = await db.important_questions.find_one({"_id": result.inserted_id})
    return await format_question(created)

@router.put("/{question_id}", response_model=ImportantQuestionResponse)
async def admin_update_important_question(question_id: str, payload: ImportantQuestionUpdate, admin: dict = Depends(get_current_admin)):
    db = get_database()
    try:
        oid = ObjectId(question_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid question_id")
        
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    if "subject_id" in update_data:
        try:
            update_data["subject_id"] = ObjectId(update_data["subject_id"])
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid subject_id")
            
    if "note_id" in update_data and update_data["note_id"]:
        try:
            update_data["note_id"] = ObjectId(update_data["note_id"])
        except Exception:
            update_data["note_id"] = None

    result = await db.important_questions.update_one({"_id": oid}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Question not found")
        
    updated = await db.important_questions.find_one({"_id": oid})
    return await format_question(updated)

@router.delete("/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_important_question(question_id: str, admin: dict = Depends(get_current_admin)):
    db = get_database()
    try:
        oid = ObjectId(question_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid question_id")
        
    result = await db.important_questions.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Question not found")
