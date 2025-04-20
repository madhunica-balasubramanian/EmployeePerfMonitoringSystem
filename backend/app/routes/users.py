from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.base import get_db
from app.models.models import User, RoleType, DepartmentRoleType, DepartmentType
from pydantic import BaseModel, EmailStr
from datetime import datetime

router = APIRouter(prefix="/api/v1/users", tags=["users"])

# TBD- I  have removed my testing code for now without the required post and get , user registration wont work.
# to avoid messing with your logic, I am keeping my changes locally.
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

#@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
#def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if username exists

    
    # Check if email exists

    
    # Create new user (in production, hash the password)

    #return new_user

#@router.get("/", response_model=List[UserResponse])
#def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
 

#@router.get("/{user_id}", response_model=UserResponse)
#def get_user(user_id: int, db: Session = Depends(get_db)):
  

#@router.put("/{user_id}", response_model=UserResponse)
#def update_user(user_id: int, user: UserBase, db: Session = Depends(get_db)):
   

#@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
#def delete_user(user_id: int, db: Session = Depends(get_db)):
  