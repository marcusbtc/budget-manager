from datetime import datetime, timedelta
from typing import List, Optional

from database import BudgetEntry, Category, get_db
from fastapi import APIRouter, Depends, Query
from schemas import BudgetStats, CategoryStat, MonthlyTrend
from sqlalchemy import func
from sqlalchemy.orm import Session

router = APIRouter(prefix="/stats", tags=["stats"])


def parse_date(date_str: Optional[str]) -> Optional[datetime]:
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        return None


@router.get("/summary", response_model=BudgetStats)
def get_summary(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    query = db.query(BudgetEntry)
    
    if start_date:
        query = query.filter(BudgetEntry.entry_date >= parse_date(start_date))
    if end_date:
        query = query.filter(BudgetEntry.entry_date <= parse_date(end_date) + timedelta(days=1))
    
    entries = query.all()
    
    total_income = sum(e.amount for e in entries if e.amount > 0)
    total_expenses = sum(abs(e.amount) for e in entries if e.amount < 0)
    
    return BudgetStats(
        total_balance=total_income - total_expenses,
        total_income=total_income,
        total_expenses=total_expenses,
        entry_count=len(entries)
    )


@router.get("/by-category", response_model=List[CategoryStat])
def get_by_category(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    query = db.query(
        Category.id.label("category_id"),
        Category.name.label("category_name"),
        Category.color.label("category_color"),
        func.sum(BudgetEntry.amount).label("total_amount"),
        func.count(BudgetEntry.id).label("entry_count")
    ).join(BudgetEntry)
    
    if start_date:
        query = query.filter(BudgetEntry.entry_date >= parse_date(start_date))
    if end_date:
        query = query.filter(BudgetEntry.entry_date <= parse_date(end_date) + timedelta(days=1))
    
    results = query.group_by(Category.id).all()
    
    return [CategoryStat(**dict(r._mapping)) for r in results]


@router.get("/monthly-trend")
def get_monthly_trend(
    months: int = Query(6, description="Number of months to show"),
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    trends = []
    
    if start_date and end_date:
        start = parse_date(start_date)
        end = parse_date(end_date)
        current = start.replace(day=1)
        
        while current <= end:
            month_end = (current + timedelta(days=32)).replace(day=1)
            
            entries = db.query(BudgetEntry).filter(
                BudgetEntry.entry_date >= current,
                BudgetEntry.entry_date < month_end
            ).all()
            
            income = sum(e.amount for e in entries if e.amount > 0)
            expenses = sum(abs(e.amount) for e in entries if e.amount < 0)
            
            trends.append(MonthlyTrend(
                month=current.strftime("%b %Y"),
                total_income=income,
                total_expenses=expenses,
                net_balance=income - expenses
            ))
            
            current = month_end
    else:
        now = datetime.utcnow()
        
        for i in range(months - 1, -1, -1):
            month_date = now - timedelta(days=30 * i)
            month_start = month_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            month_end = (month_start + timedelta(days=32)).replace(day=1)
            
            entries = db.query(BudgetEntry).filter(
                BudgetEntry.entry_date >= month_start,
                BudgetEntry.entry_date < month_end
            ).all()
            
            income = sum(e.amount for e in entries if e.amount > 0)
            expenses = sum(abs(e.amount) for e in entries if e.amount < 0)
            
            trends.append(MonthlyTrend(
                month=month_start.strftime("%b %Y"),
                total_income=income,
                total_expenses=expenses,
                net_balance=income - expenses
            ))
    
    return trends
