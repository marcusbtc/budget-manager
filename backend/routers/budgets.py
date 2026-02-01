from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from database import get_db, BudgetEntry
from schemas import BudgetEntryCreate, BudgetEntryUpdate, BudgetEntryResponse

router = APIRouter(prefix="/budgets", tags=["budgets"])


def parse_date(date_str: Optional[str]) -> Optional[datetime]:
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid date format: {date_str}. Expected YYYY-MM-DD"
        )


@router.get("/", response_model=List[BudgetEntryResponse])
def list_entries(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    query = db.query(BudgetEntry)
    
    if start_date:
        query = query.filter(BudgetEntry.entry_date >= parse_date(start_date))
    if end_date:
        query = query.filter(BudgetEntry.entry_date <= parse_date(end_date) + timedelta(days=1))
    
    return query.all()


@router.post("/", response_model=BudgetEntryResponse)
def create_entry(entry: BudgetEntryCreate, db: Session = Depends(get_db)):
    try:
        db_entry = BudgetEntry(**entry.model_dump())
        db.add(db_entry)
        db.commit()
        db.refresh(db_entry)
        return db_entry
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create entry: {str(e)}")


@router.put("/{entry_id}", response_model=BudgetEntryResponse)
def update_entry(entry_id: int, entry: BudgetEntryUpdate, db: Session = Depends(get_db)):
    try:
        db_entry = db.query(BudgetEntry).filter(BudgetEntry.id == entry_id).first()
        if not db_entry:
            raise HTTPException(status_code=404, detail="Entry not found")
        
        for key, value in entry.model_dump(exclude_unset=True).items():
            setattr(db_entry, key, value)
        
        db_entry.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_entry)
        return db_entry
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update entry: {str(e)}")


@router.delete("/{entry_id}")
def delete_entry(entry_id: int, db: Session = Depends(get_db)):
    try:
        db_entry = db.query(BudgetEntry).filter(BudgetEntry.id == entry_id).first()
        if not db_entry:
            raise HTTPException(status_code=404, detail="Entry not found")
        
        db.delete(db_entry)
        db.commit()
        return {"message": "Entry deleted"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete entry: {str(e)}")
