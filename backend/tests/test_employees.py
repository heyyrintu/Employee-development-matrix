"""
Tests for employee API endpoints
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import get_db, Base
from app.core.models import Employee

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

def test_create_employee(setup_database):
    """Test creating a new employee"""
    employee_data = {
        "name": "John Doe",
        "role": "Software Engineer",
        "department": "Engineering",
        "avatar": "https://example.com/avatar.jpg"
    }
    
    response = client.post("/api/employees/", json=employee_data)
    assert response.status_code == 200
    
    data = response.json()
    assert data["name"] == employee_data["name"]
    assert data["role"] == employee_data["role"]
    assert data["department"] == employee_data["department"]
    assert data["avatar"] == employee_data["avatar"]
    assert "id" in data

def test_get_employees(setup_database):
    """Test getting list of employees"""
    # Create test employee
    employee_data = {
        "name": "Jane Smith",
        "role": "Product Manager",
        "department": "Product"
    }
    client.post("/api/employees/", json=employee_data)
    
    response = client.get("/api/employees/")
    assert response.status_code == 200
    
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Jane Smith"

def test_get_employee_by_id(setup_database):
    """Test getting employee by ID"""
    # Create test employee
    employee_data = {
        "name": "Bob Johnson",
        "role": "Designer",
        "department": "Design"
    }
    create_response = client.post("/api/employees/", json=employee_data)
    employee_id = create_response.json()["id"]
    
    response = client.get(f"/api/employees/{employee_id}")
    assert response.status_code == 200
    
    data = response.json()
    assert data["name"] == "Bob Johnson"
    assert data["id"] == employee_id

def test_update_employee(setup_database):
    """Test updating an employee"""
    # Create test employee
    employee_data = {
        "name": "Alice Brown",
        "role": "Developer",
        "department": "Engineering"
    }
    create_response = client.post("/api/employees/", json=employee_data)
    employee_id = create_response.json()["id"]
    
    # Update employee
    update_data = {
        "name": "Alice Green",
        "role": "Senior Developer"
    }
    response = client.put(f"/api/employees/{employee_id}", json=update_data)
    assert response.status_code == 200
    
    data = response.json()
    assert data["name"] == "Alice Green"
    assert data["role"] == "Senior Developer"

def test_delete_employee(setup_database):
    """Test deleting an employee"""
    # Create test employee
    employee_data = {
        "name": "Charlie Wilson",
        "role": "Tester",
        "department": "QA"
    }
    create_response = client.post("/api/employees/", json=employee_data)
    employee_id = create_response.json()["id"]
    
    # Delete employee
    response = client.delete(f"/api/employees/{employee_id}")
    assert response.status_code == 200
    
    # Verify employee is soft deleted
    get_response = client.get(f"/api/employees/{employee_id}")
    assert get_response.status_code == 200
    assert get_response.json()["is_active"] == False
