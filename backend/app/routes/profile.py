from typing import Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.models.models import User, RoleType
from app.auth.deps import get_current_user
from sqlalchemy.orm import joinedload
from sqlalchemy.orm import Session
from app.models.models import User
from app.models.base import get_db
from app.routes.departments import DepartmentResponse

router = APIRouter(prefix="/api/v1/profile", tags=["profile"])
#DEMO-TESTED
class UserProfileResponse(BaseModel):
    email: str
    first_name: Optional[str]
    last_name: Optional[str]
    role: str
    department_role: str  # enum will auto-convert to string
    department_id: int
    department: Optional[DepartmentResponse]  # ✅ Add this
    employee_id: Optional[str]

    class Config:
        orm_mode = True

@router.get("/me", response_model=UserProfileResponse)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User)\
        .options(joinedload(User.department))\
        .filter(User.id == current_user.id)\
        .first()

    return user