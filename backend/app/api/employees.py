"""
Employee API endpoints
Handles CRUD operations for employees
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..core.database import get_db
from ..core.models import Employee
from ..core.schemas import Employee as EmployeeSchema, EmployeeCreate, EmployeeUpdate

router = APIRouter()

@router.get("/", response_model=List[EmployeeSchema])
async def get_employees(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    department: Optional[str] = None,
    role: Optional[str] = None,
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    """Get list of employees with optional filtering"""
    query = db.query(Employee)
    
    if active_only:
        query = query.filter(Employee.is_active == True)
    
    if department:
        query = query.filter(Employee.department == department)
    
    if role:
        query = query.filter(Employee.role == role)
    
    employees = query.offset(skip).limit(limit).all()
    return employees

@router.get("/{employee_id}", response_model=EmployeeSchema)
async def get_employee(employee_id: int, db: Session = Depends(get_db)):
    """Get a specific employee by ID"""
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@router.post("/", response_model=EmployeeSchema)
async def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    """Create a new employee"""
    # Check if employee with same name already exists
    existing = db.query(Employee).filter(Employee.name == employee.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Employee with this name already exists")
    
    db_employee = Employee(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

@router.put("/{employee_id}", response_model=EmployeeSchema)
async def update_employee(
    employee_id: int, 
    employee_update: EmployeeUpdate, 
    db: Session = Depends(get_db)
):
    """Update an existing employee"""
    db_employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Update only provided fields
    update_data = employee_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_employee, field, value)
    
    db.commit()
    db.refresh(db_employee)
    return db_employee

@router.delete("/{employee_id}")
async def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    """Delete an employee (soft delete by setting is_active=False)"""
    db_employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Soft delete
    db_employee.is_active = False
    db.commit()
    return {"message": "Employee deleted successfully"}

@router.get("/departments/list")
async def get_departments(db: Session = Depends(get_db)):
    """Get list of all departments"""
    departments = db.query(Employee.department).filter(
        Employee.department.isnot(None),
        Employee.is_active == True
    ).distinct().all()
    return [dept[0] for dept in departments]

@router.get("/roles/list")
async def get_roles(db: Session = Depends(get_db)):
    """Get list of all roles"""
    roles = db.query(Employee.role).filter(
        Employee.is_active == True
    ).distinct().all()
    return [role[0] for role in roles]
