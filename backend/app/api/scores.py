"""
Scores API endpoints
Handles CRUD operations for employee training scores
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..core.database import get_db
from ..core.models import Score, Employee, TrainingColumn
from ..core.schemas import Score as ScoreSchema, ScoreCreate, ScoreUpdate

router = APIRouter()

@router.get("/", response_model=List[ScoreSchema])
async def get_scores(
    skip: int = Query(0, ge=0),
    limit: int = Query(1000, ge=1, le=10000),
    employee_id: Optional[int] = None,
    column_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get list of scores with optional filtering"""
    query = db.query(Score)
    
    if employee_id:
        query = query.filter(Score.employee_id == employee_id)
    
    if column_id:
        query = query.filter(Score.column_id == column_id)
    
    scores = query.offset(skip).limit(limit).all()
    return scores

@router.get("/{score_id}", response_model=ScoreSchema)
async def get_score(score_id: int, db: Session = Depends(get_db)):
    """Get a specific score by ID"""
    score = db.query(Score).filter(Score.id == score_id).first()
    if not score:
        raise HTTPException(status_code=404, detail="Score not found")
    return score

@router.post("/", response_model=ScoreSchema)
async def create_or_update_score(score: ScoreCreate, db: Session = Depends(get_db)):
    """Create or update a score for an employee and training column"""
    # Check if employee exists
    employee = db.query(Employee).filter(Employee.id == score.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Check if training column exists
    column = db.query(TrainingColumn).filter(TrainingColumn.id == score.column_id).first()
    if not column:
        raise HTTPException(status_code=404, detail="Training column not found")
    
    # Check if score already exists
    existing_score = db.query(Score).filter(
        Score.employee_id == score.employee_id,
        Score.column_id == score.column_id
    ).first()
    
    if existing_score:
        # Update existing score
        update_data = score.dict(exclude={'employee_id', 'column_id'})
        for field, value in update_data.items():
            setattr(existing_score, field, value)
        db.commit()
        db.refresh(existing_score)
        return existing_score
    else:
        # Create new score
        db_score = Score(**score.dict())
        db.add(db_score)
        db.commit()
        db.refresh(db_score)
        return db_score

@router.put("/{score_id}", response_model=ScoreSchema)
async def update_score(
    score_id: int, 
    score_update: ScoreUpdate, 
    db: Session = Depends(get_db)
):
    """Update an existing score"""
    db_score = db.query(Score).filter(Score.id == score_id).first()
    if not db_score:
        raise HTTPException(status_code=404, detail="Score not found")
    
    # Update only provided fields
    update_data = score_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_score, field, value)
    
    db.commit()
    db.refresh(db_score)
    return db_score

@router.delete("/{score_id}")
async def delete_score(score_id: int, db: Session = Depends(get_db)):
    """Delete a score"""
    db_score = db.query(Score).filter(Score.id == score_id).first()
    if not db_score:
        raise HTTPException(status_code=404, detail="Score not found")
    
    db.delete(db_score)
    db.commit()
    return {"message": "Score deleted successfully"}

@router.get("/employee/{employee_id}/summary")
async def get_employee_summary(employee_id: int, db: Session = Depends(get_db)):
    """Get summary of all scores for an employee"""
    # Check if employee exists
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    scores = db.query(Score).filter(Score.employee_id == employee_id).all()
    
    # Calculate summary statistics
    total_scores = len(scores)
    completed = len([s for s in scores if s.level == 2])
    in_progress = len([s for s in scores if s.level == 1])
    not_trained = len([s for s in scores if s.level == 0])
    
    completion_rate = (completed / total_scores * 100) if total_scores > 0 else 0
    
    return {
        "employee_id": employee_id,
        "total_scores": total_scores,
        "completed": completed,
        "in_progress": in_progress,
        "not_trained": not_trained,
        "completion_rate": round(completion_rate, 2)
    }

@router.get("/column/{column_id}/summary")
async def get_column_summary(column_id: str, db: Session = Depends(get_db)):
    """Get summary of all scores for a training column"""
    # Check if column exists
    column = db.query(TrainingColumn).filter(TrainingColumn.id == column_id).first()
    if not column:
        raise HTTPException(status_code=404, detail="Training column not found")
    
    scores = db.query(Score).filter(Score.column_id == column_id).all()
    
    # Calculate summary statistics
    total_scores = len(scores)
    completed = len([s for s in scores if s.level == 2])
    in_progress = len([s for s in scores if s.level == 1])
    not_trained = len([s for s in scores if s.level == 0])
    
    completion_rate = (completed / total_scores * 100) if total_scores > 0 else 0
    
    return {
        "column_id": column_id,
        "total_scores": total_scores,
        "completed": completed,
        "in_progress": in_progress,
        "not_trained": not_trained,
        "completion_rate": round(completion_rate, 2)
    }
