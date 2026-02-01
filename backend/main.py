from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db
from routers import budgets, categories, stats

app = FastAPI(title="Budget Manager API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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
