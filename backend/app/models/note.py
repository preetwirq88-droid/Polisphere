from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class NoteSection(BaseModel):
    anchor: str
    heading: str
    body: str

class ComparisonRow(BaseModel):
    label: str
    values: List[str]

class ComparisonTable(BaseModel):
    title: str
    columns: List[str]
    rows: List[ComparisonRow]

class NoteBase(BaseModel):
    slug: str
    title: str
    subject_id: str
    unit_number: int
    difficulty: str = "introductory"  # introductory | advanced
    status: str = "published"         # draft | in_progress | published
    breadcrumb_trail: List[str] = ["Subjects", "Political Theory"]
    sections: List[NoteSection] = []
    comparison_table: Optional[ComparisonTable] = None
    related_note_ids: List[str] = []
    reading_time_minutes: int = 10
    keywords: List[str] = []

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    slug: Optional[str] = None
    title: Optional[str] = None
    subject_id: Optional[str] = None
    unit_number: Optional[int] = None
    difficulty: Optional[str] = None
    status: Optional[str] = None
    breadcrumb_trail: Optional[List[str]] = None
    sections: Optional[List[NoteSection]] = None
    comparison_table: Optional[ComparisonTable] = None
    related_note_ids: Optional[List[str]] = None
    reading_time_minutes: Optional[int] = None
    keywords: Optional[List[str]] = None

class NoteResponse(NoteBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    subject_name: Optional[str] = None
