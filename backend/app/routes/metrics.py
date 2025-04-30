from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.base import get_db
from app.models.models import User, RoleType, MetricDefinition, MetricRecord
from app.auth.deps import get_current_user  # Assumes you're using OAuth2/JWT
from pydantic import BaseModel, EmailStr
from datetime import datetime
from enum import Enum
from app.auth.deps import get_current_user_role
from datetime import datetime, timezone
from sqlalchemy import Date



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

# View my performance metrics 
@router.get("/performance-metrics")
def get_performance_metrics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user),
    role: RoleType = Depends(get_current_user_role)):
    if role == RoleType.EMPLOYEE:
        metrics = db.query(MetricDefinition).filter(
            MetricDefinition.metric_type == MetricTypeEnum.performance.value,
            MetricDefinition.department_id == current_user.department_id
        ).all()
        return metrics
        #return {"message": "Fetching performance metrics for the logged in Employee"}
    elif role == RoleType.SUPERVISOR:
        # Supervisor: Fetch all performance metrics for their department
       
        return {"message": "Fetching performance metrics of all employees- Supervisor"}
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    
# View my wellness metrics
@router.get("/wellness-metrics")
def get_wellness_metrics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user),
    role: RoleType = Depends(get_current_user_role)):
    if role == RoleType.EMPLOYEE:
        metrics = db.query(MetricDefinition).filter(
            MetricDefinition.metric_type == MetricTypeEnum.wellness.value,
            MetricDefinition.department_id == current_user.department_id
        ).all()
        return metrics
        #return {"message": "Fetching performance metrics for the logged in Employee"}
    elif role == RoleType.SUPERVISOR:
        # Supervisor: Fetch all performance metrics for their department
       
        return {"message": "Fetching wellness metrics- Supervisor"}
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    