from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.models.base import get_db
from app.models.models import MetricTypeEnum, User, RoleType, MetricDefinition, MetricRecord
from app.models.models import MetricDefinitionRole, EmployeeRole
from app.auth.deps import get_current_user, get_current_user_role
from app.models.base import get_db
from datetime import datetime, date
from sqlalchemy import func, extract

router = APIRouter(prefix="/api/v1/dashboard", tags=["dashboard"])

@router.get("/view-aggregate-metrics")
async def get_aggregated_metrics(
    type: str = Query(default=None, regex="^(PERFORMANCE|WELLNESS)?$"),
    date_filter: str = Query(default=None, description="Use YYYY-MM-DD or YYYY-MM or YYYY"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    role: RoleType = Depends(get_current_user_role)
):
    if role != RoleType.SUPERVISOR:
        raise HTTPException(status_code=403, detail="Only supervisors can view dashboards.")

    if not date_filter:
        raise HTTPException(status_code=400, detail="You must provide a date, month, or year.")

    query = db.query(
        MetricDefinition.metric_type,
        MetricDefinition.metric_name,
        func.sum(MetricRecord.value_numeric).label("total")
    ).join(MetricDefinition, MetricRecord.metric_id == MetricDefinition.id)\
     .join(User, User.id == MetricRecord.user_id)\
     .filter(User.department_id == current_user.department_id)

    # Filter by metric type
    if type:
        query = query.filter(MetricDefinition.metric_type == type)

    # Apply time filtering
    try:
        if len(date_filter) == 10:  # YYYY-MM-DD
            dt = datetime.strptime(date_filter, "%Y-%m-%d").date()
            query = query.filter(func.DATE(MetricRecord.recorded_at) == dt)
        elif len(date_filter) == 7:  # YYYY-MM
            dt = datetime.strptime(date_filter, "%Y-%m")
            query = query.filter(
                extract("year", MetricRecord.recorded_at) == dt.year,
                extract("month", MetricRecord.recorded_at) == dt.month
            )
        elif len(date_filter) == 4:  # YYYY
            dt = int(date_filter)
            query = query.filter(extract("year", MetricRecord.recorded_at) == dt)
        else:
            raise ValueError("Invalid date format")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid date_filter: {str(e)}")

    query = query.group_by(MetricDefinition.metric_type, MetricDefinition.metric_name)

    results = query.all()

    return [
        {
            "metric_type": r.metric_type,
            "metric_name": r.metric_name,
            "total": r.total
        }
        for r in results
    ]
