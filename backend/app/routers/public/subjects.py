from fastapi import APIRouter, HTTPException, status
from typing import List
from bson import ObjectId
from app.database import get_database
from app.models.subject import SubjectResponse

router = APIRouter(prefix="/subjects", tags=["Public Subjects"])

def format_subject(doc: dict) -> SubjectResponse:
    doc["id"] = str(doc["_id"])
    return SubjectResponse(**doc)

@router.get("", response_model=List[SubjectResponse])
async def list_subjects():
    db = get_database()
    cursor = db.subjects.find().sort("order", 1)
    subjects = await cursor.to_list(length=100)
    return [format_subject(s) for s in subjects]

@router.get("/{slug}", response_model=SubjectResponse)
async def get_subject_by_slug(slug: str):
    db = get_database()
    subject = await db.subjects.find_one({"slug": slug})
    if not subject:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subject not found")
    return format_subject(subject)
