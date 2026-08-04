from typing import List

from database import Category, get_db
from fastapi import APIRouter, Depends, HTTPException
from schemas import (
    CategoryCreate,
    CategoryResponse,
    CategoryUpdate,
)
from sqlalchemy.orm import Session

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("/", response_model=List[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()


@router.post("/", response_model=CategoryResponse)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    try:
        db_category = Category(**category.model_dump())
        db.add(db_category)
        db.commit()
        db.refresh(db_category)
        return db_category
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create category: {str(e)}")


@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(category_id: int, category: CategoryUpdate, db: Session = Depends(get_db)):
    try:
        db_category = db.query(Category).filter(Category.id == category_id).first()
        if not db_category:
            raise HTTPException(status_code=404, detail="Category not found")
        
        for key, value in category.model_dump(exclude_unset=True).items():
            setattr(db_category, key, value)
        
        db.commit()
        db.refresh(db_category)
        return db_category
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update category: {str(e)}")


@router.delete("/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    try:
        db_category = db.query(Category).filter(Category.id == category_id).first()
        if not db_category:
            raise HTTPException(status_code=404, detail="Category not found")
        
        db.delete(db_category)
        db.commit()
        return {"message": "Category deleted"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete category: {str(e)}")
