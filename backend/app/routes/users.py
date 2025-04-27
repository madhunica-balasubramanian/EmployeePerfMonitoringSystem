# backend/app/routes/users.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.base import get_db
from app.models.models import User, RoleType, Department, DepartmentRoleType, DepartmentType
from pydantic import BaseModel, EmailStr
from datetime import datetime
from app.auth.deps import get_current_user_role, get_current_user
from app.utils.security import get_password_hash
from app.routes.departments import DepartmentCreate, DepartmentResponse

router = APIRouter(prefix="/api/v1/users", tags=["users"])

class UserBase(BaseModel):
    username: str
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: RoleType
    department_id: Optional[int] = None
    is_active: Optional [bool] = True
    
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: Optional[RoleType] = None
    department_id: Optional[int] = None
    department_role: Optional[DepartmentRoleType] = None
    password: Optional[str] = None  # Make this optional for update requests
    is_active: Optional [bool] = True

class UserCreate(UserBase):
    password: str
    department_role: DepartmentRoleType

class UserResponse(UserBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check permissions based on current_user role
    if current_user.role == RoleType.ADMIN:
        print("Admin Logged in!!!!")
        pass  # Admin can create any user

    elif current_user.role == RoleType.SUPERVISOR:
        if user.role != RoleType.EMPLOYEE:
            raise HTTPException(status_code=403, detail="Supervisors can only create Employees.")
        if user.department_id != current_user.department_id:
            raise HTTPException(status_code=403, detail="Supervisors can only add employees to their own department.")

    else:
        raise HTTPException(status_code=403, detail="You are not authorized to create users.")

    # Check if username exists
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already registered")

    # Check if email exists
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Auto-generate employee ID
    last_employee = db.query(User).filter(User.employee_id.like("EMP%"))\
        .order_by(User.employee_id.desc()).first()
    if last_employee and last_employee.employee_id:
        last_id = int(last_employee.employee_id[3:])
        new_employee_id = f"EMP{last_id + 1:03d}"
    else:
        new_employee_id = "EMP001"

    # Create new user
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=get_password_hash(user.password),
        first_name=user.first_name,
        last_name=user.last_name,
        role=user.role,
        department_id=user.department_id,
        department_role=user.department_role,
        employee_id=new_employee_id,
        is_active=user.is_active
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/supervisors", response_model=List[UserResponse])
def get_all_supervisors(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if current user is ADMIN
    if current_user.role != RoleType.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admins can view supervisors."
        )

    # Fetch all users with role SUPERVISOR
    supervisors = db.query(User).filter(User.role == RoleType.SUPERVISOR).all()
    
    return supervisors

@router.delete("/supervisors/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_supervisor(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Ensure the current user is an admin
    if current_user.role != RoleType.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can delete supervisors.")

    # Fetch the supervisor to be deleted
    supervisor = db.query(User).filter(User.id == user_id, User.role == RoleType.SUPERVISOR).first()

    if not supervisor:
        raise HTTPException(status_code=404, detail="Supervisor not found")

    # Delete supervisor
    db.delete(supervisor)
    db.commit()
    return {"detail": "Supervisor deleted successfully"}

@router.put("/supervisors/{user_id}", response_model=UserResponse, status_code=status.HTTP_200_OK)
def update_supervisor(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    print("Trying to Update SuperVisor ")
    # Ensure the current user is an admin
    if current_user.role != RoleType.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can update supervisors.")

    # Fetch the supervisor to be updated
    print(f"Supervisor ID: {user_id}")
    supervisor = db.query(User).filter(User.id == user_id, User.role == RoleType.SUPERVISOR).first()

    if not supervisor:
        raise HTTPException(status_code=404, detail="Supervisor not found")

    # Update supervisor details
    print("updating user details....")
    supervisor.username = user_update.username
    supervisor.email = user_update.email
    supervisor.first_name = user_update.first_name
    supervisor.last_name = user_update.last_name
    supervisor.department_id = user_update.department_id
    supervisor.department_role = user_update.department_role
    supervisor.is_active = user_update.is_active
    #Keep password from DB as password is required field.
    supervisor.hashed_password = get_password_hash(supervisor.hashed_password)
    # Commit changes
    db.commit()
    db.refresh(supervisor)
    return supervisor

@router.delete("/supervisors/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_supervisor(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Ensure the current user is an admin
    if current_user.role != RoleType.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can delete supervisors.")

    # Fetch the supervisor to be deleted
    supervisor = db.query(User).filter(User.id == user_id, User.role == RoleType.SUPERVISOR).first()

    if not supervisor:
        raise HTTPException(status_code=404, detail="Supervisor not found")

    # Delete supervisor
    db.delete(supervisor)
    db.commit()
    return {"detail": "Supervisor deleted successfully"}


@router.post("/employees", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def add_employee(
    employee: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Ensure the current user is a supervisor
    if current_user.role != RoleType.SUPERVISOR:
        raise HTTPException(status_code=403, detail="Only supervisors can add employees.")

    # Ensure the supervisor is adding the employee to the same department
    if employee.department_id != current_user.department_id:
        raise HTTPException(status_code=403, detail="Supervisors can only add employees to their own department.")

    # Ensure the employee role is set to EMPLOYEE
    if employee.role != RoleType.EMPLOYEE:
        raise HTTPException(status_code=400, detail="Supervisors can only add employees.")

    # Check if username or email already exists
    if db.query(User).filter(User.username == employee.username).first():
        raise HTTPException(status_code=400, detail="Username already registered")

    if db.query(User).filter(User.email == employee.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Auto-generate employee ID
    last_employee = db.query(User).filter(User.employee_id.like("EMP%"))\
        .order_by(User.employee_id.desc()).first()
    if last_employee and last_employee.employee_id:
        last_id = int(last_employee.employee_id[3:])
        new_employee_id = f"EMP{last_id + 1:03d}"
    else:
        new_employee_id = "EMP001"

    # Create new employee
    new_employee = User(
        username=employee.username,
        email=employee.email,
        hashed_password=get_password_hash(employee.password),
        first_name=employee.first_name,
        last_name=employee.last_name,
        role=employee.role,
        department_id=employee.department_id,
        department_role=employee.department_role,
        employee_id=new_employee_id,
        is_active=employee.is_active
    )

    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    return new_employee


@router.put("/employees/{user_id}", response_model=UserResponse, status_code=status.HTTP_200_OK)
def update_employee(
    user_id: int,
    employee_update: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Ensure the current user is a supervisor
    if current_user.role != RoleType.SUPERVISOR:
        raise HTTPException(status_code=403, detail="Only supervisors can update employees.")

    # Ensure the supervisor is updating an employee within their own department
    employee = db.query(User).filter(User.id == user_id, User.role == RoleType.EMPLOYEE).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    if employee.department_id != current_user.department_id:
        raise HTTPException(status_code=403, detail="Supervisors can only update employees in their own department.")

    # Update employee details
    employee.username = employee_update.username
    employee.email = employee_update.email
    employee.hashed_password=get_password_hash(employee.password),
    employee.first_name = employee_update.first_name
    employee.last_name = employee_update.last_name
    employee.department_role = employee_update.department_role
    employee.is_active = employee_update.is_active

    # Commit changes
    db.commit()
    db.refresh(employee)
    return employee


@router.delete("/employees/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Ensure the current user is a supervisor
    if current_user.role != RoleType.SUPERVISOR:
        raise HTTPException(status_code=403, detail="Only supervisors can delete employees.")

    # Ensure the supervisor is deleting an employee within their own department
    employee = db.query(User).filter(User.id == user_id, User.role == RoleType.EMPLOYEE).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    if employee.department_id != current_user.department_id:
        raise HTTPException(status_code=403, detail="Supervisors can only delete employees from their own department.")

    # Delete employee
    db.delete(employee)
    db.commit()
    return {"detail": "Employee deleted successfully"}

@router.get("/departments", response_model=List[DepartmentResponse])
def get_all_departments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only Admins can view departments
    if current_user.role != RoleType.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admins can view departments."
        )

    departments = db.query(Department).all()
    return departments

@router.post("/departments", response_model=DepartmentResponse, status_code=status.HTTP_201_CREATED)
def create_department(
    department: DepartmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != RoleType.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admins can create departments."
        )
    
    print("Admin trying to add new department!!!!")
    # Check if department name already exists
    existing_department = db.query(Department).filter(Department.name == department.name).first()
    if existing_department:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Department with this name already exists."
        )

    new_department = Department(
        name=department.name,
        type=department.type,
        description=department.description
    )
    db.add(new_department)
    db.commit()
    db.refresh(new_department)
    return new_department
