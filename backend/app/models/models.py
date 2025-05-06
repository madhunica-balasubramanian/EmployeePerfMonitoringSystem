from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean, Date, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.types import Enum as SQLEnum  # Correct enum for SQLAlchemy
import enum  # Python enum
from app.models.base import Base
from sqlalchemy import JSON

class DepartmentType(str, enum.Enum):
    USPS = "USPS"
    HEALTHCARE = "HEALTHCARE"
    TRANSPORTATION = "TRANSPORTATION"
    IT_SUPPORT = "IT_SUPPORT"
    FINANCE = "FINANCE"


class RoleType(str, enum.Enum):
    EMPLOYEE = "EMPLOYEE"
    SUPERVISOR = "SUPERVISOR"
    ADMIN = "ADMIN"
    
"""class DepartmentRoleType(str, enum.Enum):
    SUPERVISOR = "SUPERVISOR"
    # Healthcare roles
    HEALTHCARE_SUPERVISOR = "HEALTHCARE_SUPERVISOR"
    HEALTHCARE_ADMIN = "HEALTHCARE_ADMIN"
    HEALTHCARE_NURSE = "HEALTHCARE_NURSE"
    
    # USPS roles
    USPS_SUPERVISOR = "USPS_SUPERVISOR"
    USPS_MAIL_CARRIER = "USPS_MAIL_CARRIER"
    USPS_OFFICE_ADMIN = "USPS_OFFICE_ADMIN"
    
    # Transportation roles can be added as needed
    TRANSPORTATION_DRIVER = "TRANSPORTATION_DRIVER"
    TRANSPORTATION_DISPATCHER = "TRANSPORTATION_DISPATCHER"
    ADMIN2 = "ADMIN2"
    """
import enum

"""
class DepartmentRoleType(enum.Enum):
    USPS_MAIL_CARRIER = 1
    USPS_OFFICE_ADMIN = 2
    HEALTHCARE_NURSE = 3
    HEALTHCARE_ADMIN = 4

    # The rest can follow in any order
    SUPERVISOR = 5
    HEALTHCARE_SUPERVISOR = 6
    USPS_SUPERVISOR = 7
    TRANSPORTATION_DRIVER = 8
    TRANSPORTATION_DISPATCHER = 9
    ADMIN2 = 10
    """
class DepartmentRoleType(str, enum.Enum):
    USPS_MAIL_CARRIER = "USPS_MAIL_CARRIER"
    USPS_OFFICE_ADMIN = "USPS_OFFICE_ADMIN"
    HEALTHCARE_NURSE = "HEALTHCARE_NURSE"
    HEALTHCARE_ADMIN = "HEALTHCARE_ADMIN"

    SUPERVISOR = "SUPERVISOR"
    HEALTHCARE_SUPERVISOR = "HEALTHCARE_SUPERVISOR"
    USPS_SUPERVISOR = "USPS_SUPERVISOR"
    TRANSPORTATION_DRIVER = "TRANSPORTATION_DRIVER"
    TRANSPORTATION_DISPATCHER = "TRANSPORTATION_DISPATCHER"
    ADMIN2 = "ADMIN2"


class MetricTypeEnum(str, enum.Enum):
    PERFORMANCE = "performance"
    WELLNESS = "wellness"
    

    
class User(Base):
    __tablename__ = "users"
    
    # The actual database primary key (auto-incremented)
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # User identification fields
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(100), nullable=False)
    first_name = Column(String(50))
    last_name = Column(String(50))
    
    # The employee ID is a unique identifier for each user (custom string like "EMP001")
    employee_id = Column(String(20), unique=True, nullable=False)
    
    # Role and department information
    role = Column(SQLEnum(RoleType, name="role_type_enum"), nullable=False)
    department_role = Column(SQLEnum(DepartmentRoleType, name="department_role_enum"), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"))
    
    is_active = Column(Boolean, default=True)
    
    #Add this foreign key to link to EmployeeRole
    role_id = Column(Integer, ForeignKey("employee_roles.role_id"))


    # Relationships
    department = relationship("Department", back_populates="users")
    metric_records = relationship("MetricRecord", back_populates="user")
    #dashboards = relationship("Dashboard", back_populates="user")
    employee_role = relationship("EmployeeRole", back_populates="users")  # Add this relationship
    # Relationships
    #department = relationship("Department", back_populates="users")
    #metric_records = relationship("MetricRecord", back_populates="user")
    #dashboards = relationship("Dashboard", back_populates="user")
    

class Department(Base):
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    type = Column(SQLEnum(DepartmentType, name="department_type_enum"), nullable=False)
    description = Column(String(255), nullable=True)
    
    # Relationships
    users = relationship("User", back_populates="department")
    metrics_definitions = relationship("MetricDefinition", back_populates="department")
    
class MetricDefinition(Base):
    __tablename__ = "metric_definitions"

    id = Column(Integer, primary_key=True, index=True)
    metric_name = Column(String(100), nullable=False)
    metric_description = Column(Text)
    metric_type = Column(SQLEnum(MetricTypeEnum, name="metric_type_enum"), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"))
    unit = Column(String(20))  # e.g., %, count, hours, index
    metric_formula = Column(Text)  # e.g., "SUM(value) / COUNT(value)"
    metric_formula_description = Column(Text)  # e.g., "Average of all values"
    is_aggregated = Column(Boolean, default=False)
    is_numeric = Column(Boolean, default=True)
    value = Column(Text)  # JSON or text representation of the metric value
    
    # Relationships
    department = relationship("Department", back_populates="metrics_definitions")
    records = relationship("MetricRecord", back_populates="metric_definition")
    employee_roles = relationship("MetricDefinitionRole", back_populates="metric_definition")  # Add this relationship

class MetricRecord(Base):
    __tablename__ = "metric_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    metric_id = Column(Integer, ForeignKey("metric_definitions.id"), nullable=False)
    
    metric_type = Column(SQLEnum(MetricTypeEnum, name="metric_type_enum"), nullable=False)
    value_numeric = Column(Float, nullable=True)
    value_json = Column(JSON, nullable=True)
    value_text = Column(Text, nullable=True)
    #value_json = Column(Text, nullable=True)  # for complex structures (optional)

    recorded_at = Column(DateTime(timezone=True))
    notes = Column(Text)

    # Relationships
    user = relationship("User", back_populates="metric_records")
    metric_definition = relationship("MetricDefinition", back_populates="records")
    
"""
CREATE TABLE employee_roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL UNIQUE,
    role_description TEXT
);

"""
class EmployeeRole(Base):
    __tablename__ = "employee_roles"
    
    role_id = Column(Integer, primary_key=True, index=True)
    role_name = Column(String(100), nullable=False, unique=True)
    role_description = Column(Text)
    
    # Relationships
    users = relationship("User", back_populates="employee_role")
    metrics = relationship("MetricDefinitionRole", back_populates="employee_role")  # Add this relationship
    # This relationship allows you to access all users associated with a specific role.
    # For example, if you have a role "Manager", you can get all users with that role.

"""
CREATE TABLE metric_definition_roles (
    metric_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    PRIMARY KEY (metric_id, role_id),
    FOREIGN KEY (metric_id) REFERENCES metric_definitions(id),
    FOREIGN KEY (role_id) REFERENCES employee_roles(role_id)
);
"""
class MetricDefinitionRole(Base):
    __tablename__ = "metric_definition_roles"
    
    metric_id = Column(Integer, ForeignKey("metric_definitions.id"), primary_key=True)
    role_id = Column(Integer, ForeignKey("employee_roles.role_id"), primary_key=True)
    
    # Relationships
    metric_definition = relationship("MetricDefinition", back_populates="employee_roles")
    employee_role = relationship("EmployeeRole", back_populates="metrics")
    # This relationship allows you to access all metrics associated with a specific role.
    # For example, if you have a role "Manager", you can get all metrics that are relevant to that role.
    # This is useful for filtering metrics based on the user's role.