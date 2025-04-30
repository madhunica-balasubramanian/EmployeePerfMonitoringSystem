from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import Date
from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel
from app.models.base import get_db
from app.models.models import User, RoleType, MetricDefinition, MetricRecord
from app.auth.deps import get_current_user, get_current_user_role


# Metrics that EMPLOYEES are NOT allowed to edit, based on their department
EMPLOYEE_RESTRICTED_METRICS = {
    "USPS": [12, 13, 14, 15],        # Metric IDs for USPS employees (from your DB)
    "HEALTHCARE": [20, 21, 25]        # Metric IDs for Healthcare employees (from your DB)
}

# Metrics that SUPERVISORS can edit, based on their department
SUPERVISOR_EDITABLE_METRICS = {
    "USPS": [14, 15],        # Customer Satisfaction Score, Aggregated Customer Feedback
    "HEALTHCARE": [20, 21, 25]  # Replace with correct Healthcare metric IDs
}

router = APIRouter(prefix="/api/v1/metric-records", tags=["metric-records"])

class UpdateMetricRequest(BaseModel):
    metric_id: int
    value_numeric: Optional[float] = None
    value_text: Optional[str] = None
    value_json: Optional[dict] = None
    
class MetricItem(BaseModel):
    metric_id: int
    value_numeric: Optional[float] = None
    value_text: Optional[str] = None
    value_json: Optional[dict] = None

class BulkMetricSubmitRequest(BaseModel):
    metrics: list[MetricItem]
    
class SupervisorMetricItem(BaseModel):
    metric_id: int
    value_numeric: Optional[float] = None
    value_text: Optional[str] = None
    value_json: Optional[dict] = None

class SupervisorBulkMetricUpdate(BaseModel):
    metrics: list[SupervisorMetricItem]
    
'''
@router.get("/view")
async def get_metrics():
    return {"message": "metric_records endpoint"}
'''

@router.post("/employee-submit-metrics")
def employee_submit_metrics(
    bulk_request: BulkMetricSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    role: RoleType = Depends(get_current_user_role)):
    if role != RoleType.EMPLOYEE:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only employees can submit metrics.")

    employee_department = current_user.department.type.value
    restricted_metrics = EMPLOYEE_RESTRICTED_METRICS.get(employee_department, [])
    today = datetime.now(timezone.utc).date()

    for metric_item in bulk_request.metrics:
        # Validate access
        if metric_item.metric_id in restricted_metrics:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"You are not allowed to update metric_id {metric_item.metric_id}"
            )

        # Ensure metric belongs to the employee's department
        metric = db.query(MetricDefinition).filter(
            MetricDefinition.id == metric_item.metric_id,
            MetricDefinition.department_id == current_user.department_id
        ).first()

        if not metric:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Metric ID {metric_item.metric_id} not found or not authorized."
            )

        # Fetch or create record
        record = db.query(MetricRecord).filter(
            MetricRecord.user_id == current_user.id,
            MetricRecord.metric_id == metric.id,
            MetricRecord.recorded_at.cast(Date) == today
        ).first()

        if not record:
            record = MetricRecord(
                user_id=current_user.id,
                metric_id=metric.id,
                metric_type=metric.metric_type,
                recorded_at=datetime.now(timezone.utc)
            )
            db.add(record)

        # Set values
        if metric_item.value_numeric is not None:
            record.value_numeric = metric_item.value_numeric
        if metric_item.value_text is not None:
            record.value_text = metric_item.value_text
        if metric_item.value_json is not None:
            record.value_json = metric_item.value_json

    db.commit()
    return {"message": "All metrics submitted successfully."}


@router.post("/supervisor-update-metric")
def supervisor_bulk_update_employee_metric(
    update_request: SupervisorBulkMetricUpdate,
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    role: RoleType = Depends(get_current_user_role)):
    #  Only SUPERVISORS allowed
    if role != RoleType.SUPERVISOR:
        raise HTTPException(status_code=403, detail="Only supervisors can update employee metrics.")

    supervisor_department = current_user.department.type.value 

    allowed_metrics = SUPERVISOR_EDITABLE_METRICS.get(supervisor_department, [])

    employee = db.query(User).filter(User.id == employee_id).first()
    if not employee or employee.department_id != current_user.department_id:
        raise HTTPException(status_code=403, detail="You are not allowed to update metrics of employees outside your department.")

    today = datetime.now(timezone.utc).date()

    for metric_item in update_request.metrics:
        if metric_item.metric_id not in allowed_metrics:
            raise HTTPException(
                status_code=403,
                detail=f"You are not allowed to edit metric_id {metric_item.metric_id}"
            )

        metric_def = db.query(MetricDefinition).filter(
            MetricDefinition.id == metric_item.metric_id,
            MetricDefinition.department_id == current_user.department_id
        ).first()
        if not metric_def:
            raise HTTPException(
                status_code=404,
                detail=f"Metric ID {metric_item.metric_id} not found or not authorized."
            )

        record = db.query(MetricRecord).filter(
            MetricRecord.user_id == employee.id,
            MetricRecord.metric_id == metric_item.metric_id,
            MetricRecord.recorded_at.cast(Date) == today
        ).first()

        if not record:
            record = MetricRecord(
                user_id=employee.id,
                metric_id=metric_item.metric_id,
                metric_type=metric_def.metric_type,
                recorded_at=datetime.now(timezone.utc)
            )
            db.add(record)

        if metric_item.value_numeric is not None:
            record.value_numeric = metric_item.value_numeric
        if metric_item.value_text is not None:
            record.value_text = metric_item.value_text
        if metric_item.value_json is not None:
            record.value_json = metric_item.value_json

    db.commit()
    return {"message": "Metrics updated successfully by Supervisor."}


@router.get("/employee/{employee_id}/metrics")
def view_employee_metrics(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    role: RoleType = Depends(get_current_user_role)):
    if role != RoleType.SUPERVISOR:
        raise HTTPException(status_code=403, detail="Only supervisors can view employee metrics.")

    employee = db.query(User).filter(User.id == employee_id).first()

    if not employee or employee.department_id != current_user.department_id:
        raise HTTPException(status_code=403, detail="You are not allowed to view this employee’s metrics.")

    records = db.query(MetricRecord).filter(
        MetricRecord.user_id == employee_id
    ).all()

    return records


@router.get("/my-performance-metrics")
def get_my_performance_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    role: RoleType = Depends(get_current_user_role)):
    if role != RoleType.EMPLOYEE:
        raise HTTPException(status_code=403, detail="Only employees can view their metrics.")

    # Join MetricRecord with MetricDefinition to get names
    records = db.query(MetricRecord).join(MetricDefinition).filter(
        MetricRecord.user_id == current_user.id,
        MetricDefinition.metric_type == "performance"
    ).all()

    return records


@router.get("/my-wellness-metrics")
def get_my_wellness_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    role: RoleType = Depends(get_current_user_role)):
    if role != RoleType.EMPLOYEE:
        raise HTTPException(status_code=403, detail="Only employees can view their metrics.")

    records = db.query(MetricRecord).join(MetricDefinition).filter(
        MetricRecord.user_id == current_user.id,
        MetricDefinition.metric_type == "wellness"
    ).all()

    return records




#@router.post("/submit-perf-data")
#@router.post("/submit-wellness-data")