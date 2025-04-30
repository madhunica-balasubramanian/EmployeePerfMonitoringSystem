import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:cmpe202@localhost:5432/wellness_db")

# JWT Secret for authentication
SECRET_KEY = os.getenv("SECRET_KEY", "cmpe272")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Application settings
DEBUG = os.getenv("DEBUG", "True").lower() == "true"
API_PREFIX = "/api/v1"