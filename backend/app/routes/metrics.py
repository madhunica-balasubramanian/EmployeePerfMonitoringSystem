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
from fastapi import Query, Path
from datetime import date
from sqlalchemy import func, extract, cast, String, and_, or_


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


# Response model for metric data with time filter
class MetricRecordResponse(BaseModel):
    id: int
    metric_id: int
    metric_name: str
    metric_type: str
    value_numeric: Optional[float] = None
    value_text: Optional[str] = None
    recorded_at: date
    unit: Optional[str] = None

    class Config:
        orm_mode = True

# Response for aggregated metrics
class AggregatedMetricResponse(BaseModel):
    metric_id: int
    metric_name: str
    metric_type: str
    avg_value: Optional[float] = None
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    count: int
    unit: Optional[str] = None
    latest_value: Optional[float] = None
    latest_text_value: Optional[str] = None

    class Config:
        orm_mode = True

@router.get("/employee/my-metrics", response_model=List[MetricRecordResponse])
def get_my_metrics(
    metric_type: Optional[str] = Query(None, description="Filter by metric type (PERFORMANCE or WELLNESS)"),
    start_date: Optional[date] = Query(None, description="Filter metrics from this date"),
    end_date: Optional[date] = Query(None, description="Filter metrics until this date"),
    month: Optional[int] = Query(None, description="Filter by month (1-12)"),
    year: Optional[int] = Query(None, description="Filter by year"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    role: RoleType = Depends(get_current_user_role)
):
    if role != RoleType.EMPLOYEE:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only employees can view their own metrics.")

    # Start with a base query
    query = db.query(
        MetricRecord.id,
        MetricRecord.metric_id,
        MetricDefinition.metric_name,
        MetricRecord.metric_type,
        MetricRecord.value_numeric,
        MetricRecord.value_text,
        MetricRecord.recorded_at,
        MetricDefinition.unit
    ).join(
        MetricDefinition, 
        MetricRecord.metric_id == MetricDefinition.id
    ).filter(
        MetricRecord.user_id == current_user.id
    )

    # Apply filters
    if metric_type:
        query = query.filter(MetricRecord.metric_type == metric_type.upper())
    
    if start_date:
        query = query.filter(cast(MetricRecord.recorded_at, Date) >= start_date)
    
    if end_date:
        query = query.filter(cast(MetricRecord.recorded_at, Date) <= end_date)
    
    if month:
        query = query.filter(extract('month', MetricRecord.recorded_at) == month)
    
    if year:
        query = query.filter(extract('year', MetricRecord.recorded_at) == year)
    
    # Order by recorded_at descending
    query = query.order_by(MetricRecord.recorded_at.desc())
    
    # Execute query
    results = query.all()
    
    # Format response
    response = []
    for r in results:
        response.append({
            "id": r.id,
            "metric_id": r.metric_id,
            "metric_name": r.metric_name,
            "metric_type": r.metric_type,
            "value_numeric": r.value_numeric,
            "value_text": r.value_text,
            "recorded_at": r.recorded_at,
            "unit": r.unit
        })
    
    return response

@router.get("/employee/my-aggregated-metrics", response_model=List[AggregatedMetricResponse])
def get_my_aggregated_metrics(
    metric_type: Optional[str] = Query(None, description="Filter by metric type (PERFORMANCE or WELLNESS)"),
    start_date: Optional[date] = Query(None, description="Filter metrics from this date"),
    end_date: Optional[date] = Query(None, description="Filter metrics until this date"),
    month: Optional[int] = Query(None, description="Filter by month (1-12)"),
    year: Optional[int] = Query(None, description="Filter by year"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    role: RoleType = Depends(get_current_user_role)
):
    if role != RoleType.EMPLOYEE:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only employees can view their own metrics.")

    # Subquery to get the latest record for each metric
    latest_records_subquery = db.query(
        MetricRecord.metric_id,
        func.max(MetricRecord.recorded_at).label('latest_date')
    ).filter(
        MetricRecord.user_id == current_user.id
    ).group_by(
        MetricRecord.metric_id
    ).subquery()
    
    # Get the latest values
    latest_values = db.query(
        MetricRecord.metric_id,
        MetricRecord.value_numeric,
        MetricRecord.value_text
    ).join(
        latest_records_subquery,
        and_(
            MetricRecord.metric_id == latest_records_subquery.c.metric_id,
            MetricRecord.recorded_at == latest_records_subquery.c.latest_date
        )
    ).filter(
        MetricRecord.user_id == current_user.id
    ).subquery()

    # Base query for aggregation
    query = db.query(
        MetricRecord.metric_id,
        MetricDefinition.metric_name,
        MetricRecord.metric_type,
        func.avg(MetricRecord.value_numeric).label('avg_value'),
        func.min(MetricRecord.value_numeric).label('min_value'),
        func.max(MetricRecord.value_numeric).label('max_value'),
        func.count(MetricRecord.id).label('count'),
        MetricDefinition.unit,
        latest_values.c.value_numeric.label('latest_value'),
        latest_values.c.value_text.label('latest_text_value')
    ).join(
        MetricDefinition, 
        MetricRecord.metric_id == MetricDefinition.id
    ).outerjoin(
        latest_values,
        MetricRecord.metric_id == latest_values.c.metric_id
    ).filter(
        MetricRecord.user_id == current_user.id
    )

    # Apply filters
    if metric_type:
        query = query.filter(MetricRecord.metric_type == metric_type.upper())
    
    if start_date:
        query = query.filter(cast(MetricRecord.recorded_at, Date) >= start_date)
    
    if end_date:
        query = query.filter(cast(MetricRecord.recorded_at, Date) <= end_date)
    
    if month:
        query = query.filter(extract('month', MetricRecord.recorded_at) == month)
    
    if year:
        query = query.filter(extract('year', MetricRecord.recorded_at) == year)
    
    # Group by necessary columns
    query = query.group_by(
        MetricRecord.metric_id,
        MetricDefinition.metric_name,
        MetricRecord.metric_type,
        MetricDefinition.unit,
        latest_values.c.value_numeric,
        latest_values.c.value_text
    )
    
    # Execute query
    results = query.all()
    
    # Format response
    response = []
    for r in results:
        response.append({
            "metric_id": r.metric_id,
            "metric_name": r.metric_name,
            "metric_type": r.metric_type,
            "avg_value": r.avg_value,
            "min_value": r.min_value,
            "max_value": r.max_value,
            "count": r.count,
            "unit": r.unit,
            "latest_value": r.latest_value,
            "latest_text_value": r.latest_text_value
        })
    
    return response

@router.get("/employee/metrics-by-date/{record_date}", response_model=List[MetricRecordResponse])
def get_metrics_by_date(
    record_date: date = Path(..., description="Get metrics for specific date"),
    metric_type: Optional[str] = Query(None, description="Filter by metric type (PERFORMANCE or WELLNESS)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    role: RoleType = Depends(get_current_user_role)
):
    if role != RoleType.EMPLOYEE:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only employees can view their own metrics.")

    query = db.query(
        MetricRecord.id,
        MetricRecord.metric_id,
        MetricDefinition.metric_name,
        MetricRecord.metric_type,
        MetricRecord.value_numeric,
        MetricRecord.value_text,
        MetricRecord.recorded_at,
        MetricDefinition.unit
    ).join(
        MetricDefinition, 
        MetricRecord.metric_id == MetricDefinition.id
    ).filter(
        MetricRecord.user_id == current_user.id,
        cast(MetricRecord.recorded_at, Date) == record_date
    )

    if metric_type:
        query = query.filter(MetricRecord.metric_type == metric_type.upper())
    
    results = query.all()
    
    response = []
    for r in results:
        response.append({
            "id": r.id,
            "metric_id": r.metric_id,
            "metric_name": r.metric_name,
            "metric_type": r.metric_type,
            "value_numeric": r.value_numeric,
            "value_text": r.value_text,
            "recorded_at": r.recorded_at,
            "unit": r.unit
        })
    
    return response
    