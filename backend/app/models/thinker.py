from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ThinkerBase(BaseModel):
    slug: str
    name: str
    portrait_url: str
    contribution: str
    key_works: List[str] = []
    bio: str
    related_note_ids: List[str] = []
    related_subject_ids: List[str] = []

class ThinkerCreate(ThinkerBase):
    pass

class ThinkerUpdate(BaseModel):
    slug: Optional[str] = None
    name: Optional[str] = None
    portrait_url: Optional[str] = None
    contribution: Optional[str] = None
    key_works: Optional[List[str]] = None
    bio: Optional[str] = None
    related_note_ids: Optional[List[str]] = None
    related_subject_ids: Optional[List[str]] = None

class ThinkerResponse(ThinkerBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
