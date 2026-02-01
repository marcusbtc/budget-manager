from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class CategoryBase(BaseModel):
    name: str
    color: str = "#6366f1"
    icon: str = "tag"


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None


class CategoryResponse(CategoryBase):
    id: int
    is_default: int

    class Config:
        from_attributes = True


class BudgetEntryBase(BaseModel):
    category_id: int
    amount: float
    description: str
    entry_date: Optional[datetime] = None


class BudgetEntryCreate(BudgetEntryBase):
    pass


class BudgetEntryUpdate(BaseModel):
    category_id: Optional[int] = None
    amount: Optional[float] = None
    description: Optional[str] = None
    entry_date: Optional[datetime] = None


class BudgetEntryResponse(BudgetEntryBase):
    id: int
    created_at: datetime
    updated_at: datetime
    category: Optional[CategoryResponse] = None

    class Config:
        from_attributes = True


class BudgetStats(BaseModel):
    total_balance: float
    total_income: float
    total_expenses: float
    entry_count: int


class CategoryStat(BaseModel):
    category_id: int
    category_name: str
    category_color: str
    total_amount: float
    entry_count: int


class MonthlyTrend(BaseModel):
    month: str
    total_income: float
    total_expenses: float
    net_balance: float
