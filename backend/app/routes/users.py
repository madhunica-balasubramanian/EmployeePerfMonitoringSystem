from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.base import get_db
from app.models.models import User, RoleType, DepartmentRoleType, DepartmentType
from pydantic import BaseModel, EmailStr
from datetime import datetime
from app.auth.deps import get_current_user_role


router = APIRouter(prefix="/api/v1/users", tags=["users"])

# Pydantic models for request/response
class UserBase(BaseModel):
    username: str
    email: EmailStr
    first_name: str = None
    last_name: str = None
    role: RoleType
    department_id: Optional[int] = None
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if username exists
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Check if email exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Auto-generate employee ID
    last_employee = db.query(User).filter(User.employee_id.like("EMP%")).order_by(User.employee_id.desc()).first()
    if last_employee and last_employee.employee_id:
        # Extract the numeric part and increment it
        last_id = int(last_employee.employee_id[3:])  # Remove "EMP" prefix
        new_employee_id = f"EMP{last_id + 1:03d}"  # Format as EMP001, EMP002, etc.
    else:
        # Start with EMP001 if no employees exist
        new_employee_id = "EMP001"
        
    # Create new user (in production, hash the password)
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=user.password,  # In production, use hashing
        first_name=user.first_name,
        last_name=user.last_name,
        role=user.role,
        department_id=user.department_id,
        employee_id=new_employee_id,
        #id=user.employee_id,  # Assuming employee_id is passed in the request
        is_active=user.is_active
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/", response_model=List[UserResponse])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.get("/protected-route")
def protected_route(role: RoleType = Depends(get_current_user_role)):
    if role == RoleType.EMPLOYEE:
        return {"message": "Welcome, Employee!"}
    elif role == RoleType.SUPERVISOR:
        return {"message": "Welcome, Supervisor!"}
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    
@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user: UserBase, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update user attributes
    for key, value in user.dict().items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(db_user)
    db.commit()
    return None