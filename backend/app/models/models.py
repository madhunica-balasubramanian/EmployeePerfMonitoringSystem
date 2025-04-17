from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean, Date, Text, Enum, DateTime
from sqlalchemy.orm import relationship
import enum
#from .base import BaseModel
from app.models.base import Base

class DepartmentType(enum.Enum):
    USPS = "USPS"
    HEALTHCARE = "HEALTHCARE"
    TRANSPORTATION = "TRANSPORTATION"

class RoleType(enum.Enum):
    EMPLOYEE = "EMPLOYEE"
    #HEALTHCARE_STAFF = "HEALTHCARE_STAFF"
    #TRANSPORTATION_STAFF = "TRANSPORTATION_STAFF"
    SUPERVISOR = "SUPERVISOR"
    ADMIN = "ADMIN"

class User(Base):
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
class Department(Base):
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True)  # Add a primary key
    name = Column(String(100), nullable=False)  # Example column for department name
    type = Column(Enum(DepartmentType), nullable=False)  # Example column for department type
    
    # Relationships
    users = relationship("User", back_populates="department")
    metrics_definitions = relationship("MetricDefinition", back_populates="department")
    
class MetricDefinition(Base):
    __tablename__ = "metric_definitions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    metric_type = Column(String(20), nullable=False)  # could also use Enum('performance', 'wellness')
    department_id = Column(Integer, ForeignKey("departments.id"))
    unit = Column(String(20))  # e.g., %, count, hours, index
    is_numeric = Column(Boolean, default=True)

    # Relationships
    department = relationship("Department", back_populates="metrics_definitions")
    records = relationship("MetricRecord", back_populates="metric")

class MetricTypeEnum(str, enum.Enum):
    performance = "performance"
    wellness = "wellness"

class Metrics(Base):
    __tablename__ = "metrics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    metric_id = Column(Integer, ForeignKey("metric_definitions.id"), nullable=False)
    
    metric_type = Column(Enum(MetricTypeEnum), nullable=False)

    value_numeric = Column(Float, nullable=True)
    value_text = Column(Text, nullable=True)
    value_json = Column(Text, nullable=True)  # for complex structures (optional)

    recorded_at = Column(DateTime(timezone=True))#, server_default=func.now())
    notes = Column(Text)

    # Relationships
    user = relationship("User", back_populates="metrics")
    metric_definition = relationship("MetricDefinition")

"""
class Dashboard(Base):
    __tablename__ = "dashboards"
    
    name = Column(String(100), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    layout = Column(Text, nullable=False)  # JSON layout
    is_public = Column(Boolean, default=False)
    
    # Relationships
    user = relationship("User")
    """