from fastapi import APIRouter, Depends, HTTPException
from app.schemas.note import NoteCreate
from app.deps.auth import get_current_user
from app.db.client import get_db
from datetime import datetime
from bson import ObjectId
from typing import List

router = APIRouter(prefix="/notes", tags=["notes"])

@router.post("/", status_code=201)
async def create_note(payload: NoteCreate, current_user=Depends(get_current_user)):
    db = get_db()
    now = datetime.utcnow()
    doc = {
        "title": payload.title or "",
        "content": payload.content or "",
        "owner_id": ObjectId(current_user["user_id"]),
        "created_at": now,
        "updated_at": now,
    }
    res = await db.notes.insert_one(doc)
    doc["id"] = str(res.inserted_id)
    doc["owner_id"] = str(doc["owner_id"])
    return doc

@router.get("/", response_model=List[dict])
async def list_notes(current_user=Depends(get_current_user)):
    db = get_db()
    cursor = db.notes.find({"owner_id": ObjectId(current_user["user_id"])}).sort("updated_at", -1)
    out = []
    async for d in cursor:
        d["id"] = str(d["_id"])
        d["owner_id"] = str(d["owner_id"])
        out.append(d)
    return out

@router.get("/{note_id}")
async def get_note(note_id: str, current_user=Depends(get_current_user)):
    db = get_db()
    doc = await db.notes.find_one({"_id": ObjectId(note_id), "owner_id": ObjectId(current_user["user_id"])})
    if not doc:
        raise HTTPException(status_code=404, detail="Note not found")
    doc["id"] = str(doc["_id"])
    doc["owner_id"] = str(doc["owner_id"])
    return doc

@router.put("/{note_id}")
async def update_note(note_id: str, payload: NoteCreate, current_user=Depends(get_current_user)):
    db = get_db()
    res = await db.notes.update_one(
        {"_id": ObjectId(note_id), "owner_id": ObjectId(current_user["user_id"])},
        {"$set": {"title": payload.title or "", "content": payload.content or "", "updated_at": datetime.utcnow()}}
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Note not found")
    doc = await db.notes.find_one({"_id": ObjectId(note_id)})
    doc["id"] = str(doc["_id"])
    doc["owner_id"] = str(doc["owner_id"])
    return doc

@router.delete("/{note_id}", status_code=204)
async def delete_note(note_id: str, current_user=Depends(get_current_user)):
    db = get_db()
    res = await db.notes.delete_one({"_id": ObjectId(note_id), "owner_id": ObjectId(current_user["user_id"])})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Note not found")
    return {}
