"""
Employee Development Matrix - FastAPI Application
Main application entry point with CORS configuration and route registration
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.api import employees, columns, scores, settings, matrix
from app.core.database import engine, Base
from app.core.seed import seed_database

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Employee Development Matrix API",
    description="API for managing employee training progress and skill development",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8010", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(employees.router, prefix="/api/employees", tags=["employees"])
app.include_router(columns.router, prefix="/api/columns", tags=["columns"])
app.include_router(scores.router, prefix="/api/scores", tags=["scores"])
app.include_router(settings.router, prefix="/api/settings", tags=["settings"])
app.include_router(matrix.router, prefix="/api/matrix", tags=["matrix"])

DOCS_CSP = (
    "default-src 'self'; "
    "img-src 'self' data: https://fastapi.tiangolo.com https://cdn.jsdelivr.net; "
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; "
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
    "font-src 'self' data: https://cdn.jsdelivr.net; "
    "connect-src 'self'"
)


DOCS_PATH_PREFIXES = (
    "/docs",
    "/redoc",
    "/openapi.json",
    "/api/docs",
    "/api/redoc",
    "/api/openapi.json",
)


@app.middleware("http")
async def apply_docs_csp(request: Request, call_next):
    """Attach a relaxed CSP for documentation routes that require eval-heavy vendor scripts."""

    response = await call_next(request)
    if request.url.path.startswith(DOCS_PATH_PREFIXES):
        response.headers["Content-Security-Policy"] = DOCS_CSP
    return response

@app.get("/")
async def root():
    """Root endpoint - redirect to API docs"""
    return {"message": "Employee Development Matrix API", "docs": "/docs"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "employee-development-matrix"}

# Seed database on startup if empty
@app.on_event("startup")
async def startup_event():
    """Initialize database with seed data if empty"""
    try:
        await seed_database()
    except Exception as e:
        print(f"Warning: Could not seed database: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
