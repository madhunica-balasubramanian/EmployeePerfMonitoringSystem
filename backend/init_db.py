from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Base
from app.config import DATABASE_URL

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created.")

if __name__ == "__main__":
    init_db()
    print("✅ Database initialized.")
    # You can add any initial data population here if needed
    # Example: session = SessionLocal()