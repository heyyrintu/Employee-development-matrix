"""
Database seeding functionality
Populates the database with sample data for development and demo purposes
"""

import json
import os
from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from .models import Employee, TrainingColumn, Score, Settings, User
from .schemas import AppSettings

def get_sample_data():
    """Get sample data from JSON file or return default data"""
    seed_file = "/app/seed/sample_data.json"
    
    if os.path.exists(seed_file):
        with open(seed_file, 'r') as f:
            return json.load(f)
    
    # Default sample data if file doesn't exist
    return {
        "employees": [
            {"id": 1, "name": "Alexandra Mattson", "role": "Software Engineer", "dept": "Engineering", "avatar": "/avatars/a1.png"},
            {"id": 2, "name": "Aaron Katou", "role": "Business Analyst", "dept": "Product"},
            {"id": 3, "name": "Sarah Johnson", "role": "UX Designer", "dept": "Design", "avatar": "/avatars/sarah.jpg"},
            {"id": 4, "name": "Michael Chen", "role": "Data Scientist", "dept": "Engineering", "avatar": "/avatars/michael.jpg"},
            {"id": 5, "name": "Emily Rodriguez", "role": "Product Manager", "dept": "Product", "avatar": "/avatars/emily.jpg"},
            {"id": 6, "name": "David Wilson", "role": "DevOps Engineer", "dept": "Engineering"},
            {"id": 7, "name": "Lisa Thompson", "role": "Marketing Manager", "dept": "Marketing", "avatar": "/avatars/lisa.jpg"},
            {"id": 8, "name": "James Brown", "role": "QA Engineer", "dept": "Engineering"},
            {"id": 9, "name": "Maria Garcia", "role": "HR Specialist", "dept": "Human Resources", "avatar": "/avatars/maria.jpg"},
            {"id": 10, "name": "Robert Taylor", "role": "Sales Director", "dept": "Sales"},
            {"id": 11, "name": "Jennifer Lee", "role": "Frontend Developer", "dept": "Engineering", "avatar": "/avatars/jennifer.jpg"},
            {"id": 12, "name": "Christopher Davis", "role": "Backend Developer", "dept": "Engineering"}
        ],
        "columns": [
            {"id": "c1", "title": "Python Programming", "category": "Technical", "targetLevel": 2},
            {"id": "c2", "title": "Leadership Skills", "category": "Leadership", "targetLevel": 2},
            {"id": "c3", "title": "Agile Methodology", "category": "Process", "targetLevel": 2},
            {"id": "c4", "title": "Data Analysis", "category": "Technical", "targetLevel": 2},
            {"id": "c5", "title": "Communication", "category": "Soft Skills", "targetLevel": 2}
        ],
        "scores": [
            {"employeeId": 1, "columnId": "c1", "level": 2, "notes": "Completed advanced Python course", "updatedBy": "admin"},
            {"employeeId": 1, "columnId": "c2", "level": 1, "notes": "Attended leadership workshop", "updatedBy": "manager"},
            {"employeeId": 1, "columnId": "c3", "level": 2, "notes": "Certified Scrum Master", "updatedBy": "admin"},
            {"employeeId": 2, "columnId": "c1", "level": 0, "notes": "", "updatedBy": "admin"},
            {"employeeId": 2, "columnId": "c2", "level": 2, "notes": "Natural leader", "updatedBy": "manager"},
            {"employeeId": 2, "columnId": "c3", "level": 1, "notes": "Learning agile practices", "updatedBy": "manager"},
            {"employeeId": 3, "columnId": "c1", "level": 1, "notes": "Learning Python for data visualization", "updatedBy": "manager"},
            {"employeeId": 3, "columnId": "c2", "level": 2, "notes": "Excellent team leadership", "updatedBy": "admin"},
            {"employeeId": 3, "columnId": "c3", "level": 2, "notes": "Agile expert", "updatedBy": "admin"},
            {"employeeId": 4, "columnId": "c1", "level": 2, "notes": "Python expert", "updatedBy": "admin"},
            {"employeeId": 4, "columnId": "c2", "level": 1, "notes": "Developing leadership skills", "updatedBy": "manager"},
            {"employeeId": 4, "columnId": "c4", "level": 2, "notes": "Data analysis specialist", "updatedBy": "admin"},
            {"employeeId": 5, "columnId": "c2", "level": 2, "notes": "Strong product leadership", "updatedBy": "admin"},
            {"employeeId": 5, "columnId": "c3", "level": 2, "notes": "Agile product management", "updatedBy": "admin"},
            {"employeeId": 5, "columnId": "c5", "level": 2, "notes": "Excellent communication", "updatedBy": "manager"},
            {"employeeId": 6, "columnId": "c1", "level": 2, "notes": "Python for automation", "updatedBy": "admin"},
            {"employeeId": 6, "columnId": "c3", "level": 2, "notes": "DevOps agile practices", "updatedBy": "admin"},
            {"employeeId": 7, "columnId": "c2", "level": 2, "notes": "Marketing leadership", "updatedBy": "admin"},
            {"employeeId": 7, "columnId": "c5", "level": 2, "notes": "Strong communication skills", "updatedBy": "manager"},
            {"employeeId": 8, "columnId": "c1", "level": 1, "notes": "Learning Python for testing", "updatedBy": "manager"},
            {"employeeId": 8, "columnId": "c3", "level": 2, "notes": "QA agile processes", "updatedBy": "admin"},
            {"employeeId": 9, "columnId": "c2", "level": 2, "notes": "HR leadership", "updatedBy": "admin"},
            {"employeeId": 9, "columnId": "c5", "level": 2, "notes": "Excellent people skills", "updatedBy": "manager"},
            {"employeeId": 10, "columnId": "c2", "level": 2, "notes": "Sales leadership", "updatedBy": "admin"},
            {"employeeId": 10, "columnId": "c5", "level": 2, "notes": "Strong sales communication", "updatedBy": "manager"},
            {"employeeId": 11, "columnId": "c1", "level": 2, "notes": "Python for frontend tools", "updatedBy": "admin"},
            {"employeeId": 11, "columnId": "c3", "level": 1, "notes": "Learning agile frontend practices", "updatedBy": "manager"},
            {"employeeId": 12, "columnId": "c1", "level": 2, "notes": "Python backend expert", "updatedBy": "admin"},
            {"employeeId": 12, "columnId": "c3", "level": 2, "notes": "Agile backend development", "updatedBy": "admin"},
            {"employeeId": 12, "columnId": "c4", "level": 1, "notes": "Learning data analysis", "updatedBy": "manager"}
        ]
    }

async def seed_database():
    """Seed the database with sample data"""
    db = SessionLocal()
    
    try:
        # Check if data already exists
        existing_employees = db.query(Employee).count()
        if existing_employees > 0:
            print("Database already seeded, skipping...")
            return
        
        print("Seeding database with sample data...")
        
        # Get sample data
        data = get_sample_data()
        
        # Create employees
        for emp_data in data["employees"]:
            employee = Employee(
                id=emp_data["id"],
                name=emp_data["name"],
                role=emp_data["role"],
                department=emp_data.get("dept"),
                avatar=emp_data.get("avatar")
            )
            db.add(employee)
        
        # Create training columns
        for col_data in data["columns"]:
            column = TrainingColumn(
                id=col_data["id"],
                title=col_data["title"],
                category=col_data["category"],
                target_level=col_data["targetLevel"]
            )
            db.add(column)
        
        # Create scores
        for score_data in data["scores"]:
            score = Score(
                employee_id=score_data["employeeId"],
                column_id=score_data["columnId"],
                level=score_data["level"],
                notes=score_data.get("notes", ""),
                updated_by=score_data.get("updatedBy", "admin")
            )
            db.add(score)
        
        # Create default settings
        default_settings = AppSettings()
        settings_record = Settings(
            key="app_settings",
            value=default_settings.dict(),
            description="Default application settings"
        )
        db.add(settings_record)
        
        # Create default users
        users = [
            User(username="admin", role="admin"),
            User(username="manager", role="manager"),
            User(username="employee", role="employee")
        ]
        for user in users:
            db.add(user)
        
        db.commit()
        print("Database seeded successfully!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()
