"""
Settings API endpoints
Handles application settings and configuration
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any
from ..core.database import get_db
from ..core.models import Settings
from ..core.schemas import AppSettings, SettingsUpdate

router = APIRouter()

@router.get("/", response_model=Dict[str, Any])
async def get_settings(db: Session = Depends(get_db)):
    """Get application settings"""
    settings_record = db.query(Settings).filter(Settings.key == "app_settings").first()
    
    if not settings_record:
        # Return default settings if none exist
        default_settings = AppSettings()
        return default_settings.dict()
    
    return settings_record.value

@router.put("/", response_model=Dict[str, Any])
async def update_settings(settings_update: SettingsUpdate, db: Session = Depends(get_db)):
    """Update application settings"""
    settings_record = db.query(Settings).filter(Settings.key == "app_settings").first()
    
    if not settings_record:
        # Create new settings record
        settings_record = Settings(key="app_settings", value={})
        db.add(settings_record)
    
    # Get current settings
    current_settings = settings_record.value or {}
    
    # Update with new values
    update_data = settings_update.dict(exclude_unset=True)
    current_settings.update(update_data)
    
    # Validate the updated settings
    try:
        validated_settings = AppSettings(**current_settings)
        settings_record.value = validated_settings.dict()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid settings: {str(e)}")
    
    db.commit()
    return settings_record.value

@router.get("/levels")
async def get_levels(db: Session = Depends(get_db)):
    """Get training level configuration"""
    settings_record = db.query(Settings).filter(Settings.key == "app_settings").first()
    
    if not settings_record or not settings_record.value:
        # Return default levels
        default_settings = AppSettings()
        return default_settings.levels
    
    settings = AppSettings(**settings_record.value)
    return settings.levels

@router.put("/levels")
async def update_levels(levels: list, db: Session = Depends(get_db)):
    """Update training level configuration"""
    settings_record = db.query(Settings).filter(Settings.key == "app_settings").first()
    
    if not settings_record:
        settings_record = Settings(key="app_settings", value={})
        db.add(settings_record)
    
    # Get current settings
    current_settings = settings_record.value or {}
    current_settings["levels"] = levels
    
    # Validate the updated settings
    try:
        validated_settings = AppSettings(**current_settings)
        settings_record.value = validated_settings.dict()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid levels configuration: {str(e)}")
    
    db.commit()
    return {"message": "Levels updated successfully"}

@router.get("/theme")
async def get_theme(db: Session = Depends(get_db)):
    """Get current theme setting"""
    settings_record = db.query(Settings).filter(Settings.key == "app_settings").first()
    
    if not settings_record or not settings_record.value:
        return "light"
    
    return settings_record.value.get("theme", "light")

@router.put("/theme")
async def update_theme(theme: str, db: Session = Depends(get_db)):
    """Update theme setting"""
    if theme not in ["light", "dark"]:
        raise HTTPException(status_code=400, detail="Theme must be 'light' or 'dark'")
    
    settings_record = db.query(Settings).filter(Settings.key == "app_settings").first()
    
    if not settings_record:
        settings_record = Settings(key="app_settings", value={})
        db.add(settings_record)
    
    # Get current settings
    current_settings = settings_record.value or {}
    current_settings["theme"] = theme
    
    settings_record.value = current_settings
    db.commit()
    
    return {"message": "Theme updated successfully", "theme": theme}
