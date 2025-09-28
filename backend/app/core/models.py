"""
SQLAlchemy models for the Employee Development Matrix
Defines database schema for employees, training columns, scores, and settings
"""

from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Employee(Base):
    """Employee model - represents individual employees"""
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    role = Column(String(100), nullable=False)
    department = Column(String(100), nullable=True)
    avatar = Column(String(500), nullable=True)  # URL to avatar image
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    scores = relationship("Score", back_populates="employee", cascade="all, delete-orphan")

class TrainingColumn(Base):
    """Training column model - represents training modules/skills"""
    __tablename__ = "training_columns"
    
    id = Column(String(50), primary_key=True, index=True)  # Custom ID like "c1", "c2"
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)
    target_level = Column(Integer, default=2)  # Default target level
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)  # For column ordering
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    scores = relationship("Score", back_populates="training_column", cascade="all, delete-orphan")

class Score(Base):
    """Score model - represents employee progress on specific training"""
    __tablename__ = "scores"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    column_id = Column(String(50), ForeignKey("training_columns.id"), nullable=False)
    level = Column(Integer, nullable=False)  # 0=Not Trained, 1=In Progress, 2=Complete
    notes = Column(Text, nullable=True)
    updated_by = Column(String(100), nullable=True)  # Who updated this score
    updated_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    employee = relationship("Employee", back_populates="scores")
    training_column = relationship("TrainingColumn", back_populates="scores")

class Settings(Base):
    """Application settings model - stores customizable configuration"""
    __tablename__ = "settings"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, nullable=False, index=True)
    value = Column(JSON, nullable=False)  # Store complex settings as JSON
    description = Column(Text, nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

class User(Base):
    """User model - for authentication (simplified for demo)"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    role = Column(String(20), nullable=False, default="employee")  # admin, manager, employee
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
