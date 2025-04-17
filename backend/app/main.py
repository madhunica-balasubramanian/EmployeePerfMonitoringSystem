from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import uvicorn
from app.routes import users, metrics, departments, dashboards
from app.models.base import Base
from database import engine

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
app.include_router(users.router)
app.include_router(metrics.router)
app.include_router(departments.router)
app.include_router(dashboards.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Employee Wellness & Performance Tracker"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)