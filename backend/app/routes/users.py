# backend/app/routes/users.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.base import get_db
from app.models.models import User, RoleType, Department, DepartmentRoleType, DepartmentType
from pydantic import BaseModel, EmailStr
from datetime import datetime
from app.auth.deps import get_current_user_role, get_current_user
from app.auth.deps import is_admin, is_supervisor
from app.utils.security import get_password_hash
from app.routes.departments import DepartmentCreate, DepartmentResponse

router = APIRouter(prefix="/api/v1/users", tags=["users"])

# ======= Pydantic Models =======

class UserBase(BaseModel):
    username: str
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: RoleType
    role_id: Optional[int] = None   
    department_id: Optional[int] = None
    is_active: Optional[bool] = True
    
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: Optional[RoleType] = None
    department_id: Optional[int] = None
    role_id: Optional[int] = None
    department_role: Optional[DepartmentRoleType] = None
    password: Optional[str] = None
    is_active: Optional[bool] = True

class UserCreate(UserBase):
    password: str
    department_role: DepartmentRoleType
    role_id: Optional[int] = None 

class UserResponse(UserBase):
    id: int
    username: str
    email: str
    first_name: Optional[str]
    last_name: Optional[str]
    employee_id: Optional[str]
    role: str
    department_role: str
    is_active: Optional[bool]
    department: Optional[DepartmentResponse]  # ✅ Nested department info
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class EmployeeCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    department_role: DepartmentRoleType
    department_id: int
    role_id: Optional[int] = None 
    is_active: Optional[bool] = True
        
class SupervisorCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    department_role: DepartmentRoleType
    department_id: int
    role_id: Optional[int] = None 
    is_active: Optional[bool] = True

# ======= Helper Functions =======

def generate_employee_id(db: Session) -> str:
    """Generate a unique employee ID in the format 'EMP001', 'EMP002', etc."""
    last_employee = db.query(User).filter(User.employee_id.like("EMP%")).order_by(User.employee_id.desc()).first()
    if last_employee and last_employee.employee_id:
        last_id = int(last_employee.employee_id[3:])
        new_employee_id = f"EMP{last_id + 1:03d}"
    else:
        new_employee_id = "EMP001"
    return new_employee_id

def check_user_exists(db: Session, username: str, email: str) -> bool:
    """Check if a user with the given username or email already exists."""
    return db.query(User).filter(
        (User.username == username) | (User.email == email)
    ).first() is not None

# ======= Routes =======

# General routes
@router.get("/", response_model=List[UserResponse])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(User).offset(skip).limit(limit).all()
    return users

# Department routes
@router.get("/departments", response_model=List[DepartmentResponse])
def get_all_departments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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

# Supervisor routes
@router.get("/supervisors", response_model=List[UserResponse])
def get_all_supervisors(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != RoleType.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admins can view supervisors."
        )
    
    supervisors = db.query(User).filter(User.role == RoleType.SUPERVISOR).all()
    return supervisors

@router.post("/create_supervisor", status_code=status.HTTP_201_CREATED)
def create_supervisor(
    supervisor: SupervisorCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(is_admin)
):
    if check_user_exists(db, supervisor.username, supervisor.email):
        raise HTTPException(status_code=400, detail="Username or email already registered.")
    
    new_employee_id = generate_employee_id(db)

    # Create supervisor
    new_supervisor = User(
        username=supervisor.username,
        email=supervisor.email,
        hashed_password=get_password_hash(supervisor.password),
        first_name=supervisor.first_name,
        last_name=supervisor.last_name,
        role=RoleType.SUPERVISOR,
        department_role=supervisor.department_role,
        department_id=supervisor.department_id,
        employee_id=new_employee_id,
        is_active=supervisor.is_active
    )
    db.add(new_supervisor)
    db.commit()
    db.refresh(new_supervisor)

    return {"message": f"Supervisor {new_supervisor.username} created successfully", "employee_id": new_employee_id}

@router.put("/supervisors/{user_id}", response_model=UserResponse, status_code=status.HTTP_200_OK)
def update_supervisor(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != RoleType.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can update supervisors.")

    supervisor = db.query(User).filter(User.id == user_id, User.role == RoleType.SUPERVISOR).first()
    if not supervisor:
        raise HTTPException(status_code=404, detail="Supervisor not found")

    # Update fields if provided
    if user_update.username is not None:
        supervisor.username = user_update.username
    if user_update.email is not None:
        supervisor.email = user_update.email
    if user_update.first_name is not None:
        supervisor.first_name = user_update.first_name
    if user_update.last_name is not None:
        supervisor.last_name = user_update.last_name
    if user_update.department_id is not None:
        supervisor.department_id = user_update.department_id
    if user_update.department_role is not None:
        supervisor.department_role = user_update.department_role
    if user_update.is_active is not None:
        supervisor.is_active = user_update.is_active
    if user_update.password is not None:
        supervisor.hashed_password = get_password_hash(user_update.password)

    db.commit()
    db.refresh(supervisor)
    return supervisor

@router.delete("/delete_supervisor/{supervisor_id}", status_code=status.HTTP_200_OK)
def delete_supervisor(
    supervisor_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(is_admin)
):
    supervisor = db.query(User).filter(User.id == supervisor_id).first()

    if not supervisor:
        raise HTTPException(status_code=404, detail="Supervisor not found.")

    if supervisor.role != RoleType.SUPERVISOR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete supervisors."
        )

    db.delete(supervisor)
    db.commit()

    return {"message": f"Supervisor {supervisor.username} deleted successfully."}

# Employee routes
@router.post("/create_employee", status_code=201)
def create_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db),
    supervisor_user: User = Depends(is_supervisor)
):
    if check_user_exists(db, employee.username, employee.email):
        raise HTTPException(status_code=400, detail="Username or email already registered.")
    
    # Ensure supervisor can only add employees to their own department
    if employee.department_id != supervisor_user.department_id:
        raise HTTPException(status_code=403, detail="Supervisors can only add employees to their own department.")
    
    new_employee_id = generate_employee_id(db)
    
    # Create new employee
    new_employee = User(
        username=employee.username,
        email=employee.email,
        hashed_password=get_password_hash(employee.password),
        first_name=employee.first_name,
        last_name=employee.last_name,
        role=RoleType.EMPLOYEE,  # Always employee
        department_role=employee.department_role,
        department_id=employee.department_id,
        role_id=employee.role_id,
        employee_id=new_employee_id,
        is_active=employee.is_active
    )
    
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)

    return {"message": f"Employee {new_employee.username} created successfully!", "employee_id": new_employee_id}

@router.put("/employees/{user_id}", response_model=UserResponse, status_code=status.HTTP_200_OK)
def update_employee(
    user_id: int,
    employee_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != RoleType.SUPERVISOR:
        raise HTTPException(status_code=403, detail="Only supervisors can update employees.")

    employee = db.query(User).filter(User.id == user_id, User.role == RoleType.EMPLOYEE).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    if employee.department_id != current_user.department_id:
        raise HTTPException(status_code=403, detail="Supervisors can only update employees in their own department.")

    # Update fields if provided
    if employee_update.username is not None:
        employee.username = employee_update.username
    if employee_update.email is not None:
        employee.email = employee_update.email
    if employee_update.password is not None:
        employee.hashed_password = get_password_hash(employee_update.password)
    if employee_update.first_name is not None:
        employee.first_name = employee_update.first_name
    if employee_update.last_name is not None:
        employee.last_name = employee_update.last_name
    if employee_update.department_role is not None:
        employee.department_role = employee_update.department_role
    if employee_update.is_active is not None:
        employee.is_active = employee_update.is_active

    db.commit()
    db.refresh(employee)
    return employee

@router.delete("/delete_employee/{employee_id}", status_code=status.HTTP_200_OK)
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    supervisor_user: User = Depends(is_supervisor)
):
    employee = db.query(User).filter(User.id == employee_id).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found.")

    if employee.role != RoleType.EMPLOYEE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete employees."
        )
        
    # Ensure supervisor can only delete employees from their own department
    if employee.department_id != supervisor_user.department_id:
        raise HTTPException(status_code=403, detail="Supervisors can only delete employees from their own department.")

    db.delete(employee)
    db.commit()

    return {"message": f"Employee {employee.username} deleted successfully."}

# Legacy routes with unified functionality - Keeping for backwards compatibility
@router.post("/register-employee", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check permissions based on current_user role
    if current_user.role == RoleType.ADMIN:
        pass  # Admin can create any user
    elif current_user.role == RoleType.SUPERVISOR:
        if user.role != RoleType.EMPLOYEE:
            raise HTTPException(status_code=403, detail="Supervisors can only create Employees.")
        if user.department_id != current_user.department_id:
            raise HTTPException(status_code=403, detail="Supervisors can only add employees to their own department.")
    else:
        raise HTTPException(status_code=403, detail="You are not authorized to create users.")

    if check_user_exists(db, user.username, user.email):
        raise HTTPException(status_code=400, detail="Username or email already registered")

    new_employee_id = generate_employee_id(db)

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
        role_id=user.role_id,
        employee_id=new_employee_id,
        is_active=user.is_active
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user