from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.utils.security import create_access_token  # Corrected the module path if 'utils' is the correct folder
from app.services.auth_service import authenticate_user
from app.models.base import get_db

#router = APIRouter()
# The above code defines a FastAPI router for authentication, specifically for user login.
# It uses OAuth2 password flow for authentication and generates a JWT token upon successful login.
# The authenticate_user function checks the provided credentials against the database.
# If the credentials are valid, a JWT token is created and returned to the user.
# The token can then be used for subsequent requests to access protected resources.
# The code also handles errors, returning a 401 Unauthorized status if the credentials are invalid.
# This is a basic implementation and can be extended with features like token expiration,
# refresh tokens, and more.
"""
@router.post("/login")

def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    token = create_access_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}
"""