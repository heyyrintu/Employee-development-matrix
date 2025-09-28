"""
Tests for matrix API endpoints
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import get_db, Base
from app.core.models import Employee, TrainingColumn, Score

# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="function")
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def sample_data(setup_database):
    """Create sample data for testing"""
    db = TestingSessionLocal()
    
    # Create employees
    employees = [
        Employee(name="John Doe", role="Engineer", department="Engineering"),
        Employee(name="Jane Smith", role="Manager", department="Product"),
    ]
    for emp in employees:
        db.add(emp)
    
    # Create training columns
    columns = [
        TrainingColumn(id="c1", title="Python", category="Technical", target_level=2),
        TrainingColumn(id="c2", title="Leadership", category="Soft Skills", target_level=2),
    ]
    for col in columns:
        db.add(col)
    
    db.commit()
    
    # Create scores
    scores = [
        Score(employee_id=1, column_id="c1", level=2, notes="Completed"),
        Score(employee_id=1, column_id="c2", level=1, notes="In progress"),
        Score(employee_id=2, column_id="c1", level=0, notes="Not started"),
        Score(employee_id=2, column_id="c2", level=2, notes="Completed"),
    ]
    for score in scores:
        db.add(score)
    
    db.commit()
    db.close()

def test_get_matrix(sample_data):
    """Test getting complete matrix data"""
    response = client.get("/api/matrix/")
    assert response.status_code == 200
    
    data = response.json()
    assert "employees" in data
    assert "columns" in data
    assert "scores" in data
    assert "settings" in data
    
    assert len(data["employees"]) == 2
    assert len(data["columns"]) == 2
    assert len(data["scores"]) == 4

def test_get_matrix_with_filters(sample_data):
    """Test getting matrix data with filters"""
    # Filter by department
    response = client.get("/api/matrix/?department=Engineering")
    assert response.status_code == 200
    
    data = response.json()
    assert len(data["employees"]) == 1
    assert data["employees"][0]["department"] == "Engineering"

def test_get_analytics(sample_data):
    """Test getting analytics data"""
    response = client.get("/api/matrix/analytics/")
    assert response.status_code == 200
    
    data = response.json()
    assert "skill_distribution" in data
    assert "total_employees" in data
    assert "total_trainings" in data
    assert "completion_rate" in data
    assert "top_skills" in data
    assert "recent_activity" in data
    
    assert data["total_employees"] == 2
    assert data["total_trainings"] == 2

def test_export_csv(sample_data):
    """Test CSV export"""
    response = client.get("/api/matrix/export/csv")
    assert response.status_code == 200
    assert response.headers["content-type"] == "text/csv; charset=utf-8"

def test_export_json(sample_data):
    """Test JSON export"""
    response = client.get("/api/matrix/export/json")
    assert response.status_code == 200
    
    data = response.json()
    assert "employees" in data
    assert "columns" in data
    assert "scores" in data
