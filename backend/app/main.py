from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import uvicorn
from app.routes import users, metrics, metric_records,departments, auth, dashboards
from app.models.base import Base
#from database import engine
from init_db import *
from app.models.models import Department
from app.config import DATABASE_URL
from sqlalchemy import create_engine
from app.models.base import SessionLocal
from app.auth.deps import get_current_user

import sys
print(sys.path)
Base.metadata.create_all(bind=engine)
app = FastAPI(
    title="Employee Wellness & Performance Tracker",
    description="API for tracking employee wellness indicators and performance metrics",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(metrics.router)
app.include_router(departments.router)
app.include_router(metric_records.router)
app.include_router(dashboards.router)

@app.on_event("startup")
async def startup_event():
    """Run tasks on application startup."""
    db = SessionLocal()
    try:
        # Seed metric definitions
        seed_departments(db)
        seed_admin_user(db)
        seed_supervisor_user(db)
        seed_employee_user(db)
        seed_metric_definitions(db, "metric_definitions.json")
    finally:
        db.close()
@app.get("/")
async def root():
    return {"message": "Welcome to Employee Wellness & Performance Tracker"}
for route in app.routes:
    print(route.path, route.name)
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)