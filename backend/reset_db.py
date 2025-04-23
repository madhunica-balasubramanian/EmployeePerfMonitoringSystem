from app.models.base import Base
from init_db import engine

# Drop all tables
Base.metadata.drop_all(bind=engine)
print("✅ All tables dropped")

# Recreate all tables
Base.metadata.create_all(bind=engine)
print("✅ All tables recreated")
