from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.models.models import User, RoleType
from app.auth.deps import get_current_user

router = APIRouter(prefix="/api/v1/profile", tags=["profile"])

class UserProfileResponse(BaseModel):
    email: str
    first_name: str
    last_name: str
    role: RoleType
    department_role: str
    department_id: int
    employee_id: str

    class Config:
        orm_mode = True

@router.get("/me", response_model=UserProfileResponse)
def get_my_profile(
    current_user: User = Depends(get_current_user)
):
    return current_user