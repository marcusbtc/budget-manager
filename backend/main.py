import os

from database import SessionLocal, init_db
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import budgets, categories, stats
from sqlalchemy import text

app = FastAPI(title="Budget Manager API", version="1.0.0")

cors_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ALLOW_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(budgets.router, prefix="/api/v1")
app.include_router(categories.router, prefix="/api/v1")
app.include_router(stats.router, prefix="/api/v1")


@app.on_event("startup")
def startup():
    init_db()


@app.get("/")
def root():
    return {"message": "Budget Manager API", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/ready")
def ready():
    with SessionLocal() as session:
        session.execute(text("SELECT 1"))
    return {"status": "ready"}
