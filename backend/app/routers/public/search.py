from fastapi import APIRouter, Query
from typing import List, Dict, Any
from app.database import get_database

router = APIRouter(prefix="/search", tags=["Public Search"])

@router.get("")
async def search_all(q: str = Query("", min_length=1)):
    db = get_database()
    
    notes_cursor = db.notes.find(
        {"$or": [
            {"title": {"$regex": q, "$options": "i"}},
            {"keywords": {"$regex": q, "$options": "i"}},
            {"sections.body": {"$regex": q, "$options": "i"}}
        ], "status": {"$ne": "draft"}},
        {"title": 1, "slug": 1, "difficulty": 1, "unit_number": 1}
    ).limit(8)
    
    thinkers_cursor = db.thinkers.find(
        {"$or": [
            {"name": {"$regex": q, "$options": "i"}},
            {"contribution": {"$regex": q, "$options": "i"}}
        ]},
        {"name": 1, "slug": 1, "contribution": 1, "portrait_url": 1}
    ).limit(5)

    subjects_cursor = db.subjects.find(
        {"$or": [
            {"name": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}}
        ]},
        {"name": 1, "slug": 1, "icon": 1}
    ).limit(5)

    notes = await notes_cursor.to_list(length=8)
    thinkers = await thinkers_cursor.to_list(length=5)
    subjects = await subjects_cursor.to_list(length=5)

    return {
        "query": q,
        "notes": [{"id": str(n["_id"]), "title": n["title"], "slug": n["slug"], "difficulty": n.get("difficulty")} for n in notes],
        "thinkers": [{"id": str(t["_id"]), "name": t["name"], "slug": t["slug"], "contribution": t.get("contribution"), "portrait_url": t.get("portrait_url")} for t in thinkers],
        "subjects": [{"id": str(s["_id"]), "name": s["name"], "slug": s["slug"], "icon": s.get("icon")} for s in subjects]
    }
