from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import DATABASE_URL
from sqlalchemy.orm import Session
from app.models.base import SessionLocal
#from app.models.models import Department, DepartmentType
from app.models.models import RoleType, User, Department, DepartmentType, DepartmentRoleType, EmployeeRole
from app.models.models import MetricDefinition, MetricRecord  # Import all models
from app.utils.security import get_password_hash
from app.models.base import Base
import json
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.models import MetricDefinition, MetricTypeEnum

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created.")


def reset_metric_id_sequence(db: Session):
    db.execute(text("""
        SELECT setval(
            'metric_definitions_id_seq',
            COALESCE((SELECT MAX(id) FROM metric_definitions), 1),
            true
        );
    """))
    db.commit()

def seed_metric_definitions(db: Session, json_file: str):
    try:
        # Load the JSON data
        with open(json_file, "r") as file:
            metric_definitions = json.load(file)
        
        for metric in metric_definitions:
            # Convert metric_type to the Enum value
            metric_type = MetricTypeEnum[metric["metric_type"].upper()]
            
            # Check if the metric already exists
            existing_metric = db.query(MetricDefinition).filter(
                MetricDefinition.metric_name == metric["metric_name"]
            ).first()
            metric_formula = metric.get("metric_formula", None)
            if not existing_metric:
                # Create a new MetricDefinition object
                new_metric = MetricDefinition(
                    metric_name=metric["metric_name"],
                    metric_description=metric["metric_description"],
                    metric_type=metric_type,
                    department_id=metric["department_id"],
                    unit=metric["unit"],
                    metric_formula=metric_formula,
                    metric_formula_description=metric["metric_formula_description"],
                    is_aggregated=metric["is_aggregated"],
                    is_numeric=metric["is_numeric"],
                    value=metric["value"]
                )
                db.add(new_metric)
                print(f"✅ Added metric: {metric['metric_name']}")
            else:
                print(f"⚠️ Metric already exists: {metric['metric_name']}")
        
        # Commit the changes
        db.commit()
        print("✅ Metric definitions seeded successfully.")
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding metric definitions: {str(e)}")
    
def seed_departments(db: Session):
    departments_to_seed = [
        {"name": "US Postal Service", "type": DepartmentType.USPS, "description": "Handles mail delivery"},
        {"name": "Healthcare", "type": DepartmentType.HEALTHCARE, "description": "Federal health services"}
    ]
    print("Departments to seed:")
    print(departments_to_seed)   # Check the seed data
    print("Checking department type...")
    print(Department.__table__.columns['type'].type)
    for dep in departments_to_seed:
        try:
            # Check if department exists using name instead of type
            existing = db.query(Department).filter(Department.name == dep["name"]).first()
            
            if not existing:
                department = Department(**dep)
                db.add(department)
                db.commit()
                print(f"Seeded department: {department.name} with ID: {department.id}")
            else:
                print(f"Department {dep['name']} already exists.")
                
        except Exception as e:
            db.rollback()  # Rollback in case of error
            print(f"Error seeding department {dep['name']}: {str(e)}")
    
    print("🏢 Departments seeding completed.")
    

# TBD: Once Namita's changes are done this has to be revalidated with auth.
# no frontend code to call this function
def seed_admin_user(db: Session):
    try:
        existing_admin = db.query(User).filter(User.username == "admin").first()
        if existing_admin:
            print("Admin already exists.")
            return
        # Debug prints
        print("Available DepartmentRoleType values:", [e.value for e in DepartmentRoleType])
        print("Attempting to use:", DepartmentRoleType.ADMIN2.value)
        # ...rest of your code
        admin_user = User(
            username="admin",
            email="admin@example.com",
            hashed_password=get_password_hash("adminpassword123"),
            first_name="System",
            last_name="Admin",
            role=RoleType.ADMIN,
            department_role=DepartmentRoleType.ADMIN2, # Changed this line
            department_id=None,  # Admin might not be tied to a specific department
            employee_id="EMP001",
            is_active=True
        )
        db.add(admin_user)
        db.commit()
        print(f"✅ Admin user created: {admin_user.username}")
    finally:
        db.close()
# TBD: Once Namita's changes are done this has to be revalidated with auth and
# check by adding supervisors by admin and add employees by supervisors
# remove this function.
def seed_supervisor_user(db: Session):
    #db: Session = SessionLocal()
    supervisors_to_seed = [
        {
            "username": "jason",
            "email": "jason@example.com",
            "hashed_password": get_password_hash("jason123"),
            "first_name": "Jason",
            "last_name": "Smith",
            "role": RoleType.SUPERVISOR,
            "department_role": DepartmentRoleType.USPS_SUPERVISOR,
            "department_id": 1,  # Admin might not be tied to a specific department
            "role_id" : DepartmentRoleType["USPS_SUPERVISOR"].value,
            "employee_id": "EMP002",
            "is_active": True
        },
        {
            "username": "johnny",
            "email": "johnny@example.com",
            "hashed_password": get_password_hash("johnny123"),
            "first_name": "Johnny",
            "last_name": "Doe",
            "role": RoleType.SUPERVISOR,    
            "department_role": DepartmentRoleType.HEALTHCARE_SUPERVISOR,
            "department_id": 2,
            "role_id" : DepartmentRoleType["HEALTHCARE_SUPERVISOR"].value,
            "employee_id": "EMP008",
            "is_active": True
        }
    ]
    for supervisor in supervisors_to_seed:
        try:
            # Check if the employee already exists
            existing_supervisor = db.query(User).filter(User.username == supervisor["username"]).first()
            if existing_supervisor:
                print(f"⚠️ Employee {supervisor['username']} already exists.")
                continue

            # Create a new employee
            new_employee = User(**supervisor)
            db.add(new_employee)
            db.commit()
            print(f"✅ Supervisor user created: {new_employee.username}")
        except Exception as e:
            db.rollback()
            print(f"❌ Error seeding supervisor user {supervisor['username']}: {str(e)}")
        finally:
            db.close()

# once backend logic is implemented to add supervisors by admin and add employees by supervisors, remove this function.
def seed_employee_user(db: Session):
    employees_to_seed = [
        {
            "username": "patrick",
            "email": "patrick@example.com",
            "hashed_password": get_password_hash("patrick123"),
            "first_name": "Patrick",
            "last_name": "Smith",
            "role": RoleType.EMPLOYEE,
            "department_role": DepartmentRoleType.USPS_MAIL_CARRIER,
            "department_id": 1,
            "role_id" : DepartmentRoleType["USPS_MAIL_CARRIER"].value,
            "employee_id": "EMP004",
            "is_active": True
        },
           {
            "username": "Robert",
            "email": "robert@example.com",
            "hashed_password": get_password_hash("michael123"),
            "first_name": "Robert",
            "last_name": "Ross",
            "role": RoleType.EMPLOYEE,
            "department_role": DepartmentRoleType.USPS_OFFICE_ADMIN,
            "department_id": 1,
            "role_id" : DepartmentRoleType["USPS_OFFICE_ADMIN"].value,
            "employee_id": "EMP007",
            "is_active": True
        },
        {
            "username": "jane",
            "email": "jane@example.com",
            "hashed_password": get_password_hash("jane123"),
            "first_name": "Jane",
            "last_name": "Doe",
            "role": RoleType.EMPLOYEE,
            "department_role": DepartmentRoleType.HEALTHCARE_NURSE,
            "department_id": 2,
            "role_id" : DepartmentRoleType["HEALTHCARE_NURSE"].value,
            "employee_id": "EMP005",
            "is_active": True
        },
        {
            "username": "michael",
            "email": "michael@example.com",
            "hashed_password": get_password_hash("michael123"),
            "first_name": "Michael",
            "last_name": "Johnson",
            "role": RoleType.EMPLOYEE,
            "department_role": DepartmentRoleType.HEALTHCARE_ADMIN,
            "department_id": 2,
            "role_id" : DepartmentRoleType["HEALTHCARE_ADMIN"].value,
            "employee_id": "EMP006",
            "is_active": True
        }
    ]
    for employee in employees_to_seed:
        try:
            # Check if the employee already exists
            existing_employee = db.query(User).filter(User.username == employee["username"]).first()
            if existing_employee:
                print(f"⚠️ Employee {employee['username']} already exists.")
                continue

            # Create a new employee
            new_employee = User(**employee)
            db.add(new_employee)
            db.commit()
            print(f"✅ Supervisor user created: {new_employee.username}")
        except Exception as e:
            db.rollback()
            print(f"❌ Error seeding employee user {employee['username']}: {str(e)}")
 
        finally:
            db.close()
            
def seed_roles(db: Session):
    roles = [
        (1, "USPS_MAIL_CARRIER", "Postal worker responsible for mail and parcel delivery"),
        (2, "USPS_OFFICE_ADMIN", "Administrative staff in USPS office"),
        (3, "USPS_SUPERVISOR", "Supervisor in USPS department"),
        (4, "HEALTHCARE_NURSE", "Registered Nurse"),
        (5, "HEALTHCARE_ADMIN", "Healthcare administrative staff"),
        (6, "HEALTHCARE_SUPERVISOR", "Healthcare department supervisor"),
        (7, "TRANSPORTATION_DRIVER", "Vehicle driver"),
        (8, "TRANSPORTATION_DISPATCHER", "Transportation logistics coordinator"),
        (9, "IT_SUPPORT_TECHNICIAN", "IT support and maintenance staff"),
        (10, "FINANCE_ANALYST", "Financial analysis and reporting")
    ]

    for role_id, role_name, role_desc in roles:
        existing = db.query(EmployeeRole).filter_by(role_id=role_id).first()
        if not existing:
            db.add(EmployeeRole(role_id=role_id, role_name=role_name, role_description=role_desc))
            print(f"✅ Seeded role: {role_name}")
        else:
            print(f"⚠️ Role already exists: {role_name}")
    
    db.commit()


def seed_metric_definition_roles(db: Session):
    # Mapping of (department_id, role_id) -> applicable metric_ids
    role_metric_mappings = {
        (1, 1): [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        (1, 2): [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
        (2, 4): [21, 22, 23, 18, 27, 29, 30, 9, 10, 11, 12, 31, 32],
        (2, 5): [18, 19, 20, 24, 25, 26, 27, 33, 34, 35, 9, 10, 11, 12]
    }

    for (dept_id, role_id), metric_ids in role_metric_mappings.items():
        for metric_id in metric_ids:
            db.execute(text("""
                INSERT INTO metric_definition_roles (metric_id, role_id)
                SELECT :metric_id, :role_id
                WHERE NOT EXISTS (
                    SELECT 1 FROM metric_definition_roles
                    WHERE metric_id = :metric_id AND role_id = :role_id
                )
            """), {"metric_id": metric_id, "role_id": role_id})
            print(f"✔️ Mapped metric {metric_id} to role {role_id}")

    db.commit()
    print("✅ Role-metric mapping complete.")


if __name__ == "__main__":
    init_db()
    print("✅ Database initialized.")
    # You can add any initial data population here if needed
    # Example: session = SessionLocal()