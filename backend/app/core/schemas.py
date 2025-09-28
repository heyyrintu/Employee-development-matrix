"""
Pydantic schemas for request/response validation
Defines data models for API input/output
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    """User role enumeration"""
    ADMIN = "admin"
    MANAGER = "manager"
    EMPLOYEE = "employee"

# Employee schemas
class EmployeeBase(BaseModel):
    """Base employee schema with common fields"""
    name: str = Field(..., min_length=1, max_length=100)
    role: str = Field(..., min_length=1, max_length=100)
    department: Optional[str] = Field(None, max_length=100)
    avatar: Optional[str] = Field(None, max_length=500)

class EmployeeCreate(EmployeeBase):
    """Schema for creating new employees"""
    pass

class EmployeeUpdate(BaseModel):
    """Schema for updating employees"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    role: Optional[str] = Field(None, min_length=1, max_length=100)
    department: Optional[str] = Field(None, max_length=100)
    avatar: Optional[str] = Field(None, max_length=500)
    is_active: Optional[bool] = None

class Employee(EmployeeBase):
    """Schema for employee responses"""
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Training column schemas
class TrainingColumnBase(BaseModel):
    """Base training column schema"""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    category: Optional[str] = Field(None, max_length=100)
    target_level: int = Field(2, ge=0, le=5)  # 0-5 levels
    sort_order: int = Field(0, ge=0)

class TrainingColumnCreate(TrainingColumnBase):
    """Schema for creating training columns"""
    id: Optional[str] = None  # Auto-generated if not provided

class TrainingColumnUpdate(BaseModel):
    """Schema for updating training columns"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    category: Optional[str] = Field(None, max_length=100)
    target_level: Optional[int] = Field(None, ge=0, le=5)
    sort_order: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None

class TrainingColumn(TrainingColumnBase):
    """Schema for training column responses"""
    id: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Score schemas
class ScoreBase(BaseModel):
    """Base score schema"""
    level: int = Field(..., ge=0, le=5)  # 0-5 levels
    notes: Optional[str] = None
    updated_by: Optional[str] = Field(None, max_length=100)

class ScoreCreate(ScoreBase):
    """Schema for creating/updating scores"""
    employee_id: int
    column_id: str

class ScoreUpdate(BaseModel):
    """Schema for updating scores"""
    level: Optional[int] = Field(None, ge=0, le=5)
    notes: Optional[str] = None
    updated_by: Optional[str] = Field(None, max_length=100)

class Score(ScoreBase):
    """Schema for score responses"""
    id: int
    employee_id: int
    column_id: str
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Matrix schemas
class MatrixCell(BaseModel):
    """Individual cell in the matrix"""
    employee_id: int
    column_id: str
    level: int
    notes: Optional[str] = None
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = None

class MatrixData(BaseModel):
    """Complete matrix data structure"""
    employees: List[Employee]
    columns: List[TrainingColumn]
    scores: List[MatrixCell]
    settings: Dict[str, Any]

# Settings schemas
class LevelConfig(BaseModel):
    """Configuration for training levels"""
    level: int
    label: str
    color: str
    description: Optional[str] = None

class AppSettings(BaseModel):
    """Application settings structure"""
    levels: List[LevelConfig] = Field(default_factory=lambda: [
        LevelConfig(level=0, label="Not Trained", color="#ef4444", description="No training completed"),
        LevelConfig(level=1, label="In Progress", color="#f59e0b", description="Training in progress"),
        LevelConfig(level=2, label="Complete", color="#10b981", description="Training completed")
    ])
    theme: str = "light"  # light, dark
    default_target_level: int = 2
    completion_method: str = "average"  # average, weighted
    show_avatars: bool = True
    compact_view: bool = False

class SettingsUpdate(BaseModel):
    """Schema for updating settings"""
    levels: Optional[List[LevelConfig]] = None
    theme: Optional[str] = None
    default_target_level: Optional[int] = None
    completion_method: Optional[str] = None
    show_avatars: Optional[bool] = None
    compact_view: Optional[bool] = None

# User schemas
class UserBase(BaseModel):
    """Base user schema"""
    username: str = Field(..., min_length=3, max_length=50)
    role: UserRole = UserRole.EMPLOYEE

class UserCreate(UserBase):
    """Schema for creating users"""
    pass

class User(UserBase):
    """Schema for user responses"""
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Analytics schemas
class SkillDistribution(BaseModel):
    """Skill distribution data for charts"""
    level: int
    label: str
    count: int
    percentage: float
    color: str

class AnalyticsData(BaseModel):
    """Analytics dashboard data"""
    skill_distribution: List[SkillDistribution]
    total_employees: int
    total_trainings: int
    completion_rate: float
    top_skills: List[Dict[str, Any]]
    recent_activity: List[Dict[str, Any]]
