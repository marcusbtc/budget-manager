import os
from datetime import datetime
from pathlib import Path

from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    create_engine,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./budget.db")

if DATABASE_URL.startswith("sqlite:///"):
    database_path = DATABASE_URL.removeprefix("sqlite:///")
    if database_path and database_path != ":memory:":
        database_directory = Path(database_path).expanduser().resolve().parent
        database_directory.mkdir(parents=True, exist_ok=True)

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    color = Column(String, default="#6366f1")
    icon = Column(String, default="tag")
    is_default = Column(Integer, default=1)

    entries = relationship("BudgetEntry", back_populates="category")


class BudgetEntry(Base):
    __tablename__ = "budget_entries"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    amount = Column(Float, nullable=False)
    description = Column(String, nullable=False)
    entry_date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    category = relationship("Category", back_populates="entries")


def init_db():
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if categories already exist
        if db.query(Category).count() == 0:
            default_categories = [
                Category(name="Groceries", color="#22c55e", icon="shopping-cart"),
                Category(name="Transport", color="#3b82f6", icon="car"),
                Category(name="Entertainment", color="#a855f7", icon="film"),
                Category(name="Utilities", color="#f59e0b", icon="zap"),
                Category(name="Salary", color="#10b981", icon="briefcase"),
                Category(name="Healthcare", color="#ef4444", icon="heart-pulse"),
                Category(name="Dining", color="#f97316", icon="utensils"),
                Category(name="Shopping", color="#ec4899", icon="shopping-bag"),
            ]
            db.add_all(default_categories)
            db.commit()
    finally:
        db.close()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
