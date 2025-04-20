from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import DATABASE_URL
from sqlalchemy.orm import Session
from app.models.base import SessionLocal
#from app.models.models import Department, DepartmentType
from app.models.models import RoleType, User, Department, DepartmentType, DepartmentRoleType
from app.models.models import MetricDefinition, MetricRecord  # Import all models
from app.utils.security import get_password_hash
from app.models.base import Base

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created.")
    
def seed_departments(db: Session):
    departments_to_seed = [
        {"name": "US Postal Service", "type": DepartmentType.USPS, "description": "Handles mail delivery"},
        {"name": "Healthcare", "type": DepartmentType.HEALTHCARE, "description": "Federal health services"},
        {"name": "Transportation", "type": DepartmentType.TRANSPORTATION, "description": "Transport and aviation"},
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
    try:
        existing_supervisor = db.query(User).filter(User.username == "jason").first()
        if existing_supervisor:
            print("Supervisor already exists.")
            return

        supervisor_user = User(
            username="jason",
            email="jason@example.com",
            hashed_password=get_password_hash("jason123"),
            first_name="Jason",
            last_name="Smith",
            role=RoleType.SUPERVISOR,
            department_role=DepartmentRoleType.USPS_SUPERVISOR,
            department_id=1,  # Admin might not be tied to a specific department
            employee_id="EMP002",
            is_active=True
        )

        db.add(supervisor_user)
        db.commit()
        print(f"✅ Supervisor user created: {supervisor_user.username}")
    finally:
        db.close()

# once backend logic is implemented to add supervisors by admin and add employees by supervisors, remove this function.
def seed_employee_user(db: Session):
    #db: Session = SessionLocal()
    try:
        existing_employee = db.query(User).filter(User.username == "patrick").first()
        if existing_employee:
            print("Employee already exists.")
            return

        employee_user = User(
            username="patrick",
            email="patrick@example.com",
            hashed_password=get_password_hash("patrick123"),
            first_name="Patrick",
            last_name="Smith",
            role=RoleType.EMPLOYEE,
            department_role=DepartmentRoleType.USPS_MAIL_CARRIER,
            department_id=1,  # Admin might not be tied to a specific department
            employee_id="EMP003",
            is_active=True
        )

        db.add(employee_user)
        db.commit()
        print(f"✅ Supervisor user created: {employee_user.username}")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
    print("✅ Database initialized.")
    # You can add any initial data population here if needed
    # Example: session = SessionLocal()