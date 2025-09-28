"""
Training columns API endpoints
Handles CRUD operations for training modules/skills
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..core.database import get_db
from ..core.models import TrainingColumn
from ..core.schemas import TrainingColumn as TrainingColumnSchema, TrainingColumnCreate, TrainingColumnUpdate

router = APIRouter()

@router.get("/", response_model=List[TrainingColumnSchema])
async def get_columns(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    category: Optional[str] = None,
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    """Get list of training columns with optional filtering"""
    query = db.query(TrainingColumn)
    
    if active_only:
        query = query.filter(TrainingColumn.is_active == True)
    
    if category:
        query = query.filter(TrainingColumn.category == category)
    
    # Order by sort_order, then by title
    columns = query.order_by(TrainingColumn.sort_order, TrainingColumn.title).offset(skip).limit(limit).all()
    return columns

@router.get("/{column_id}", response_model=TrainingColumnSchema)
async def get_column(column_id: str, db: Session = Depends(get_db)):
    """Get a specific training column by ID"""
    column = db.query(TrainingColumn).filter(TrainingColumn.id == column_id).first()
    if not column:
        raise HTTPException(status_code=404, detail="Training column not found")
    return column

@router.post("/", response_model=TrainingColumnSchema)
async def create_column(column: TrainingColumnCreate, db: Session = Depends(get_db)):
    """Create a new training column"""
    # Generate ID if not provided
    if not column.id:
        # Find the next available ID
        last_column = db.query(TrainingColumn).order_by(TrainingColumn.id.desc()).first()
        if last_column and last_column.id.startswith('c'):
            try:
                last_num = int(last_column.id[1:])
                column.id = f"c{last_num + 1}"
            except ValueError:
                column.id = "c1"
        else:
            column.id = "c1"
    
    # Check if column with same ID already exists
    existing = db.query(TrainingColumn).filter(TrainingColumn.id == column.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Training column with this ID already exists")
    
    db_column = TrainingColumn(**column.dict())
    db.add(db_column)
    db.commit()
    db.refresh(db_column)
    return db_column

@router.put("/{column_id}", response_model=TrainingColumnSchema)
async def update_column(
    column_id: str, 
    column_update: TrainingColumnUpdate, 
    db: Session = Depends(get_db)
):
    """Update an existing training column"""
    db_column = db.query(TrainingColumn).filter(TrainingColumn.id == column_id).first()
    if not db_column:
        raise HTTPException(status_code=404, detail="Training column not found")
    
    # Update only provided fields
    update_data = column_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_column, field, value)
    
    db.commit()
    db.refresh(db_column)
    return db_column

@router.delete("/{column_id}")
async def delete_column(column_id: str, db: Session = Depends(get_db)):
    """Delete a training column (soft delete by setting is_active=False)"""
    db_column = db.query(TrainingColumn).filter(TrainingColumn.id == column_id).first()
    if not db_column:
        raise HTTPException(status_code=404, detail="Training column not found")
    
    # Soft delete
    db_column.is_active = False
    db.commit()
    return {"message": "Training column deleted successfully"}

@router.get("/categories/list")
async def get_categories(db: Session = Depends(get_db)):
    """Get list of all training categories"""
    categories = db.query(TrainingColumn.category).filter(
        TrainingColumn.category.isnot(None),
        TrainingColumn.is_active == True
    ).distinct().all()
    return [cat[0] for cat in categories]

@router.put("/{column_id}/reorder")
async def reorder_column(
    column_id: str, 
    new_order: int, 
    db: Session = Depends(get_db)
):
    """Update the sort order of a training column"""
    db_column = db.query(TrainingColumn).filter(TrainingColumn.id == column_id).first()
    if not db_column:
        raise HTTPException(status_code=404, detail="Training column not found")
    
    db_column.sort_order = new_order
    db.commit()
    return {"message": "Column order updated successfully"}
