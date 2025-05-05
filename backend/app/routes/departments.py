from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.models.models import Department
from app.models.base import get_db
from pydantic import BaseModel
from app.models.models import DepartmentType  # if needed for typing
from app.auth.deps import is_admin
from enum import Enum

router = APIRouter(prefix="/api/v1/departments", tags=["departments"])

class DepartmentType(str, Enum):
    USPS             = "USPS"
    HEALTHCARE       = "HEALTHCARE"
    HOMELANDSECURITY = "HOMELANDSECURITY"
    TRANSPORTATION   = "TRANSPORTATION"
    # Add other types if you have more

# Pydantic Request Schema for creating a department
class DepartmentCreate(BaseModel):
    name: str
    type: DepartmentType
    description: str = None
    
# Pydantic Response Schema
class DepartmentResponse(BaseModel):
    id: int
    name: str
    type: DepartmentType
    description: str = None

    class Config:
        orm_mode = True
    
@router.get("/view")
async def get_metrics():
    return {"message": "Departments endpoint"}

@router.post("/create_department", status_code=status.HTTP_201_CREATED)
def create_department(
    department: DepartmentCreate,
    db: Session = Depends(get_db),
    admin_user: Depends = Depends(is_admin)):
    # Check if department name already exists
    existing = db.query(Department).filter(Department.name == department.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Department with this name already exists.")

    # Create the new department
    new_department = Department(
        name=department.name,
        type=department.type,
        description=department.description
    )
    db.add(new_department)
    db.commit()
    db.refresh(new_department)

    return {"message": f"Department '{new_department.name}' created successfully!", "department_id": new_department.id}

# Get all departments
@router.get("/view", response_model=List[DepartmentResponse])
def get_departments(db: Session = Depends(get_db)):
    departments = db.query(Department).all()
    return departments
