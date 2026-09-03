from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ImportantQuestionBase(BaseModel):
    subject_id: str
    unit_number: int
    topic: str
    difficulty: str = "intermediate"  # beginner | intermediate | advanced
    question: str
    note_id: Optional[str] = None

class ImportantQuestionCreate(ImportantQuestionBase):
    pass

class ImportantQuestionUpdate(BaseModel):
    subject_id: Optional[str] = None
    unit_number: Optional[int] = None
    topic: Optional[str] = None
    difficulty: Optional[str] = None
    question: Optional[str] = None
    note_id: Optional[str] = None

class ImportantQuestionResponse(ImportantQuestionBase):
    id: str
    created_at: Optional[datetime] = None
    subject_name: Optional[str] = None
