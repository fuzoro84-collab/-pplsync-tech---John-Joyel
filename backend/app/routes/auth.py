from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.user import UserCreate, UserLogin, UserPublic
from app.db.client import get_db
from app.core.security import hash_password, verify_password, create_access_token
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", status_code=201)
async def register(payload: UserCreate):
    db = get_db()
    if await db.users.find_one({"email": payload.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    now = datetime.utcnow()
    doc = {
        "name": payload.name,
        "email": payload.email,
        "hashed_password": hash_password(payload.password),
        "created_at": now,
        "updated_at": now,
    }
    res = await db.users.insert_one(doc)
    return {"message": "user created", "user_id": str(res.inserted_id)}

@router.post("/login")
async def login(payload: UserLogin):
    db = get_db()
    user = await db.users.find_one({"email": payload.email})
    if not user or not verify_password(payload.password, user.get("hashed_password","")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user_id = str(user["_id"])
    token = create_access_token(subject=user_id)
    user_public = UserPublic(user_id=user_id, user_name=user["name"], user_email=user["email"])
    return {"access_token": token, "token_type": "bearer", "user": user_public}
