from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean, Date, Text, Enum
from sqlalchemy.orm import relationship
import enum
from .base import BaseModel

class DepartmentType(enum.Enum):
    USPS = "USPS"
    HEALTHCARE = "HEALTHCARE"
    TRANSPORTATION = "TRANSPORTATION"

class RoleType(enum.Enum):
    POSTAL_WORKER = "POSTAL_WORKER"
    HEALTHCARE_STAFF = "HEALTHCARE_STAFF"
    TRANSPORTATION_STAFF = "TRANSPORTATION_STAFF"
    SUPERVISOR = "SUPERVISOR"
    ADMIN = "ADMIN"

class User(BaseModel):
    __tablename__ = "users"
    
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(100), nullable=False)
    first_name = Column(String(50))
    last_name = Column(String(50))
    role = Column(Enum(RoleType), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"))
    #the actual database primary key (auto-incremented)
    id = Column(Integer, primary_key=True, index=True)
    #your custom unique string (like "EMP001", "EMP002")
    employee_id = Column(String(20), unique=True, nullable=False)
    is_active = Column(Boolean, default=True)
    """
    How users and departments are related:
    - Each user belongs to one department.
    - Each department can have multiple users.
    - The relationship is established through the foreign key department_id in the User model.
    - The relationship is bidirectional, meaning you can access the users of a department 
       from the department model and vice versa.
    Example: dept = Department(name="Engineering", type=DepartmentType.TECH)
            user = User(
                    username="john",
                    email="john@example.com",
                    employee_id="EMP123",
                    role=RoleType.EMPLOYEE,
                    department=dept
                )
                user.department.name ➝ "Engineering" , dept.users ➝ list of all users in Engineering

    """
 # Relationships between users and other database models.
    department = relationship("Department", back_populates="users") #user.department.name
    wellness_metrics = relationship("WellnessMetric", back_populates="user") #user.wellness_metrics
    performance_metrics = relationship("PerformanceMetric", back_populates="user")#user.performance_metrics
    dashboards = relationship("Dashboard", back_populates="user") #user.dashboards
    #user.dashboards[0].layout ➝ JSON layout of the first dashboard of the user
    
    # Need to be updated with actual relationships and tables.
class Department(BaseModel):
    __tablename__ = "departments"
    #TBD
    
    # Relationships
    users = relationship("User", back_populates="department")
    #metrics_definitions = relationship("MetricDefinition", back_populates="department")

class MetricDefinition(BaseModel):
    __tablename__ = "metric_definitions"
    #TBD
    
    # Relationships
    department = relationship("Department", back_populates="metrics_definitions")

class WellnessMetric(BaseModel):
    __tablename__ = "wellness_metrics"
    
    #TBD
    
    # Relationships
    user = relationship("User", back_populates="wellness_metrics")
    #metric_definition = relationship("MetricDefinition")

class PerformanceMetric(BaseModel):
    __tablename__ = "performance_metrics"
    
    #TBD
    
    # Relationships
    user = relationship("User", back_populates="performance_metrics")
    #metric_definition = relationship("MetricDefinition")

class Dashboard(BaseModel):
    __tablename__ = "dashboards"
    
    name = Column(String(100), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    layout = Column(Text, nullable=False)  # JSON layout
    is_public = Column(Boolean, default=False)
    
    # Relationships
    user = relationship("User")