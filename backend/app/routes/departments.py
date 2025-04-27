from fastapi import APIRouter
from pydantic import BaseModel
from enum import Enum

router = APIRouter(prefix="/api/v1/departments", tags=["departments"])

class DepartmentType(str, Enum):
    USPS = "USPS"
    HEALTHCARE = "HEALTHCARE"
    # Add other types if you have more

class DepartmentCreate(BaseModel):
    name: str
    type: DepartmentType
    description: str = None  # Optional field

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