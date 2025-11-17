from fastapi import FastAPI
from app.routes import auth, notes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="DAsh Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(notes.router)
