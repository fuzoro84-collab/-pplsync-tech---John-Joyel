from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class NoteCreate(BaseModel):
    title: Optional[str] = ""
    content: Optional[str] = ""

class NoteInDB(BaseModel):
    id: str
    title: str
    content: str
    owner_id: str
    created_at: datetime
    updated_at: datetime
