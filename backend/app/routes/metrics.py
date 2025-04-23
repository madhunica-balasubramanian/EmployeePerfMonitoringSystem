from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.base import get_db
from app.models.models import User, RoleType, MetricDefinition
from app.auth.deps import get_current_user  # Assumes you're using OAuth2/JWT
from pydantic import BaseModel, EmailStr
from datetime import datetime
from enum import Enum
from app.auth.deps import get_current_user_role

router = APIRouter(prefix="/api/v1/metrics", tags=["metrics"])


# we have two metric types for each employee: performance and wellness
# each metric type has its own set of metrics
# performance metrics are related to the employee's work performance
# wellness metrics are related to the employee's health and well-being
# each metric type has its own set of metrics

class MetricTypeEnum(str, Enum):
    performance = "performance"
    wellness = "wellness"
    
class MetricResponse(BaseModel):
    metric_id: int
    metric_name: str
    metric_description: Optional[str]
    metric_type: str
    department_id: int
    unit: Optional[str]
    metric_formula: Optional[str]
    metric_formula_description: Optional[str]
    is_numerical: bool
    is_aggregated: bool
    value: Optional[dict]

    class Config:
        orm_mode = True
        
# Example usage from frontend -  GET /api/v1/metrics?metric_type=wellness
# Example usage from frontend -  GET /api/v1/metrics?metric_type=performance
# Example usage from frontend -  GET /api/v1/metrics?metric_type=wellness&department_id=1
# Example usage from frontend -  GET /api/v1/metrics?metric_type=performance&department_id=1


@router.get("/performance-metrics")
def get_performance_metrics(role: RoleType = Depends(get_current_user_role)):
    if role == RoleType.EMPLOYEE:
        return {"message": "Fetching performance metrics for Employee"}
    elif role == RoleType.SUPERVISOR:
        return {"message": "Fetching performance metrics for Supervisor"}
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    
