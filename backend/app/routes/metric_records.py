from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import Date
from datetime import datetime, timezone, date
from typing import Optional
from pydantic import model_validator

from pydantic import BaseModel
from app.models.base import get_db
from app.models.models import MetricTypeEnum, User, RoleType, MetricDefinition, MetricRecord
from app.models.models import MetricDefinitionRole, EmployeeRole
from app.auth.deps import get_current_user, get_current_user_role



# Metrics that SUPERVISORS can edit, based on their department
SUPERVISOR_EDITABLE_METRICS = {
    "USPS": [15, 16],        # Customer Satisfaction Score, Aggregated Customer Feedback
    "HEALTHCARE": [21, 22, 26]  # Replace with correct Healthcare metric IDs
}

router = APIRouter(prefix="/api/v1/metric-records", tags=["metric-records"])

class UpdateMetricRequest(BaseModel):
    metric_id: int
    value_numeric: Optional[float] = None
    value_text: Optional[str] = None
    value_json: Optional[dict] = None
    
class MetricInput(BaseModel):
    metric_id: int
    value_numeric: Optional[float] = None
    value_text: Optional[str] = None
    value_json: Optional[dict] = None

class BulkMetricSubmitRequest(BaseModel):
    date: date
    metrics: list[MetricInput]
    
    @model_validator(mode='after')
    def check_value_ranges(self) -> 'BulkMetricSubmitRequest':
        metrics = self.metrics
        for metric in metrics:
            if metric.metric_id in {10, 11, 12} and metric.value_numeric is not None:
                if not (1 <= metric.value_numeric <= 10):
                    raise ValueError(
                        f"Metric ID {metric.metric_id} value must be between 1 and 10. Got {metric.value_numeric}."
                    )
        return self
    
class SupervisorMetricItem(BaseModel):
    metric_id: int
    value_numeric: Optional[float] = None
    value_text: Optional[str] = None
    value_json: Optional[dict] = None

class SupervisorBulkMetricUpdate(BaseModel):
    metrics: list[SupervisorMetricItem]
    
class MetricDefinitionResponse(BaseModel):
    id: int
    metric_name: str
    metric_type: MetricTypeEnum
    unit: str | None = None

    class Config:
        orm_mode = True


@router.get("/employee/available-metrics", response_model=list[MetricDefinitionResponse])
def get_available_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    role: RoleType = Depends(get_current_user_role)
):
    if role != RoleType.EMPLOYEE:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only employees can view metrics.")

    # Fetch metric IDs allowed for this employee's role
    print("User Role:", current_user.role_id)
    print("User Department:", current_user.department_id)
    role_metric_ids = db.query(MetricDefinitionRole.metric_id).filter(
        MetricDefinitionRole.role_id == current_user.role_id
    ).all()
    metric_ids = [m[0] for m in role_metric_ids]

    if not metric_ids:
        return []

    # Fetch matching metrics from the employee's department
    metrics = db.query(MetricDefinition).filter(
        MetricDefinition.id.in_(metric_ids),
        MetricDefinition.department_id == current_user.department_id
    ).all()

    return metrics

def get_metrics_by_type(
    metric_type: str,
    db: Session,
    current_user: User
) -> list[MetricDefinition]:
    # Fetch metric IDs allowed for this employee's role
    role_metric_ids = db.query(MetricDefinitionRole.metric_id).filter(
        MetricDefinitionRole.role_id == current_user.role_id
    ).all()
    metric_ids = [m[0] for m in role_metric_ids]

    if not metric_ids:
        return []

    # Fetch matching metrics of specific type and department
    metrics = db.query(MetricDefinition).filter(
        MetricDefinition.id.in_(metric_ids),
        MetricDefinition.department_id == current_user.department_id,
        MetricDefinition.metric_type == metric_type
    ).all()

    return metrics

@router.get("/employee/performance-metrics", response_model=list[MetricDefinitionResponse])
def get_performance_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    role: RoleType = Depends(get_current_user_role)
):
    if role != RoleType.EMPLOYEE:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only employees can view metrics.")
    return get_metrics_by_type("PERFORMANCE", db, current_user)


@router.get("/employee/wellness-metrics", response_model=list[MetricDefinitionResponse])
def get_wellness_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    role: RoleType = Depends(get_current_user_role)
):
    if role != RoleType.EMPLOYEE:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only employees can view metrics.")
    return get_metrics_by_type("WELLNESS", db, current_user)


@router.post("/employee-submit-metrics")
def employee_submit_metrics(
    request: BulkMetricSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    role: RoleType = Depends(get_current_user_role)):
    if role != RoleType.EMPLOYEE:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only employees can submit metrics.")

    submission_date = request.date  # date field from payload
    
    employee_department = current_user.department.type.value
    for metric_item in request.metrics:
        # Optional: validate access to metric_id
        metric = db.query(MetricDefinition).filter(
            MetricDefinition.id == metric_item.metric_id,
            MetricDefinition.department_id == current_user.department_id
        ).first()

        if not metric:
            raise HTTPException(404, detail=f"Metric ID {metric_item.metric_id} not found.")

        # Upsert record for that date
        record = db.query(MetricRecord).filter(
            MetricRecord.user_id == current_user.id,
            MetricRecord.metric_id == metric.id,
            MetricRecord.recorded_at.cast(Date) == submission_date
        ).first()

        if not record:
            record = MetricRecord(
                user_id=current_user.id,
                metric_id=metric.id,
                metric_type=metric.metric_type,
                recorded_at=submission_date
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
    return {"message": f"Metrics submitted for {submission_date}"}


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





"""
#@router.post("/submit-perf-data")
#@router.post("/submit-wellness-data")
"""