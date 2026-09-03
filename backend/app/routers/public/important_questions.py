from fastapi import APIRouter, Query
from typing import List, Optional
from bson import ObjectId
from app.database import get_database
from app.models.important_question import ImportantQuestionResponse

router = APIRouter(prefix="/important-questions", tags=["Public Important Questions"])

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
async def list_important_questions(
    subject: Optional[str] = Query(None),
    subject_id: Optional[str] = Query(None),
    unit: Optional[int] = Query(None),
    topic: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None)
):
    db = get_database()
    query = {}
    
    if subject and subject != "all":
        subj_doc = await db.subjects.find_one({"$or": [{"slug": subject}, {"name": subject}]})
        if subj_doc:
            query["subject_id"] = subj_doc["_id"]
    elif subject_id and subject_id != "all":
        try:
            query["subject_id"] = ObjectId(subject_id)
        except Exception:
            return []
            
    if unit and unit > 0:
        query["unit_number"] = unit
        
    if topic and topic != "all":
        query["topic"] = {"$regex": topic, "$options": "i"}
        
    if difficulty and difficulty != "all":
        query["difficulty"] = difficulty.lower()

    cursor = db.important_questions.find(query).sort("created_at", -1)
    questions = await cursor.to_list(length=200)
    
    res = []
    for q in questions:
        res.append(await format_question(q))
    return res
