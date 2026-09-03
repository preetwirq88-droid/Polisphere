from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Unit(BaseModel):
    unit_number: int
    title: str

class SubjectBase(BaseModel):
    slug: str
    name: str
    description: str
    icon: str = "school"
    order: int = 1
    units: List[Unit] = []

class SubjectCreate(SubjectBase):
    pass

class SubjectUpdate(BaseModel):
    slug: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    order: Optional[int] = None
    units: Optional[List[Unit]] = None

class SubjectResponse(SubjectBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
