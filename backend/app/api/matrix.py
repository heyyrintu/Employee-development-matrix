"""
Matrix API endpoints
Provides complete matrix data and analytics
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from ..core.database import get_db
from ..core.models import Employee, TrainingColumn, Score, Settings
from ..core.schemas import MatrixData, MatrixCell, AnalyticsData, SkillDistribution

router = APIRouter()

@router.get("/", response_model=MatrixData)
async def get_matrix(
    department: Optional[str] = None,
    role: Optional[str] = None,
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    """Get complete matrix data with optional filtering"""
    # Get employees with filtering
    employee_query = db.query(Employee)
    if active_only:
        employee_query = employee_query.filter(Employee.is_active == True)
    if department:
        employee_query = employee_query.filter(Employee.department == department)
    if role:
        employee_query = employee_query.filter(Employee.role == role)
    
    employees = employee_query.all()
    
    # Get training columns
    columns = db.query(TrainingColumn).filter(TrainingColumn.is_active == True).order_by(
        TrainingColumn.sort_order, TrainingColumn.title
    ).all()
    
    # Get all scores for the filtered employees
    employee_ids = [emp.id for emp in employees]
    scores = db.query(Score).filter(Score.employee_id.in_(employee_ids)).all()
    
    # Convert scores to MatrixCell format
    matrix_cells = []
    for score in scores:
        matrix_cells.append(MatrixCell(
            employee_id=score.employee_id,
            column_id=score.column_id,
            level=score.level,
            notes=score.notes,
            updated_by=score.updated_by,
            updated_at=score.updated_at
        ))
    
    # Get settings
    settings_record = db.query(Settings).filter(Settings.key == "app_settings").first()
    settings = settings_record.value if settings_record else {}
    
    return MatrixData(
        employees=employees,
        columns=columns,
        scores=matrix_cells,
        settings=settings
    )

@router.get("/analytics", response_model=AnalyticsData)
async def get_analytics(
    department: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get analytics data for the dashboard"""
    # Get all scores
    query = db.query(Score)
    if department:
        # Filter by department through employees
        employee_ids = db.query(Employee.id).filter(Employee.department == department).all()
        employee_ids = [emp[0] for emp in employee_ids]
        query = query.filter(Score.employee_id.in_(employee_ids))
    
    scores = query.all()
    
    # Calculate skill distribution
    level_counts = {}
    for score in scores:
        level = score.level
        level_counts[level] = level_counts.get(level, 0) + 1
    
    total_scores = len(scores)
    skill_distribution = []
    
    # Get level configuration from settings
    settings_record = db.query(Settings).filter(Settings.key == "app_settings").first()
    levels_config = []
    if settings_record and settings_record.value and "levels" in settings_record.value:
        levels_config = settings_record.value["levels"]
    else:
        # Default levels
        levels_config = [
            {"level": 0, "label": "Not Trained", "color": "#ef4444"},
            {"level": 1, "label": "In Progress", "color": "#f59e0b"},
            {"level": 2, "label": "Complete", "color": "#10b981"}
        ]
    
    for level_config in levels_config:
        level = level_config["level"]
        count = level_counts.get(level, 0)
        percentage = (count / total_scores * 100) if total_scores > 0 else 0
        
        skill_distribution.append(SkillDistribution(
            level=level,
            label=level_config["label"],
            count=count,
            percentage=round(percentage, 2),
            color=level_config["color"]
        ))
    
    # Calculate completion rate
    completed = level_counts.get(2, 0)
    completion_rate = (completed / total_scores * 100) if total_scores > 0 else 0
    
    # Get total counts
    total_employees = db.query(Employee).filter(Employee.is_active == True).count()
    if department:
        total_employees = db.query(Employee).filter(
            Employee.is_active == True,
            Employee.department == department
        ).count()
    
    total_trainings = db.query(TrainingColumn).filter(TrainingColumn.is_active == True).count()
    
    # Get top skills (most completed)
    column_completion = {}
    for score in scores:
        if score.level == 2:  # Completed
            column_completion[score.column_id] = column_completion.get(score.column_id, 0) + 1
    
    # Get column names for top skills
    top_skills = []
    for column_id, count in sorted(column_completion.items(), key=lambda x: x[1], reverse=True)[:5]:
        column = db.query(TrainingColumn).filter(TrainingColumn.id == column_id).first()
        if column:
            top_skills.append({
                "column_id": column_id,
                "title": column.title,
                "completed_count": count
            })
    
    # Get recent activity (last 10 score updates)
    recent_scores = db.query(Score).order_by(Score.updated_at.desc()).limit(10).all()
    recent_activity = []
    for score in recent_scores:
        employee = db.query(Employee).filter(Employee.id == score.employee_id).first()
        column = db.query(TrainingColumn).filter(TrainingColumn.id == score.column_id).first()
        if employee and column:
            recent_activity.append({
                "employee_name": employee.name,
                "column_title": column.title,
                "level": score.level,
                "updated_at": score.updated_at,
                "updated_by": score.updated_by
            })
    
    return AnalyticsData(
        skill_distribution=skill_distribution,
        total_employees=total_employees,
        total_trainings=total_trainings,
        completion_rate=round(completion_rate, 2),
        top_skills=top_skills,
        recent_activity=recent_activity
    )

@router.get("/export/csv")
async def export_matrix_csv(
    department: Optional[str] = None,
    role: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Export matrix data as CSV"""
    import csv
    import io
    from fastapi.responses import StreamingResponse
    
    # Get matrix data
    matrix_data = await get_matrix(department=department, role=role, db=db)
    
    # Create CSV content
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header row
    header = ["Employee ID", "Name", "Role", "Department"]
    for column in matrix_data.columns:
        header.append(column.title)
    writer.writerow(header)
    
    # Write data rows
    for employee in matrix_data.employees:
        row = [employee.id, employee.name, employee.role, employee.department or ""]
        
        # Get scores for this employee
        employee_scores = {score.column_id: score.level for score in matrix_data.scores 
                          if score.employee_id == employee.id}
        
        for column in matrix_data.columns:
            level = employee_scores.get(column.id, 0)
            row.append(level)
        
        writer.writerow(row)
    
    output.seek(0)
    
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode('utf-8')),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=matrix_export.csv"}
    )

@router.get("/export/json")
async def export_matrix_json(
    department: Optional[str] = None,
    role: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Export matrix data as JSON"""
    matrix_data = await get_matrix(department=department, role=role, db=db)
    return matrix_data
