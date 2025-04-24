from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.models.base import get_db
from app.models.models import User
from app.config import SECRET_KEY, ALGORITHM
from passlib.context import CryptContext
from app.models.models import RoleType
from app.models.models import User

#Password hashing
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    print("get_current_user loaded")
    print("Raw token received:", token)  # Debug print
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        username: str = payload.get("sub") 
        #if user_id is None:
            #raise HTTPException(
            #    status_code=status.HTTP_401_UNAUTHORIZED,
            #    detail="Invalid User Id",
            #    headers={"WWW-Authenticate": "Bearer"},
            #)
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if user_id:
        user = db.query(User).filter(User.id == user_id).first()
    elif (username):
        user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user

async def get_current_user_role(token: str = Depends(OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login"))):
    try:
        print("Token received:", token)  # Debug print
        print(f"SECRET_KEY: {SECRET_KEY}")
        print(f"ALGORITHM: {ALGORITHM}")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"Decoded payload:, {payload}")  # Debug print
        role = payload.get("role")
        if role is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid roletype")
        return RoleType(role)
    except JWTError:
        print ("Invalid Token info - got JWTerror ")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# Role-based authorization functions
def is_employee(user: User = Depends(get_current_active_user)):
    if user.role not in ["employee"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return user

def is_supervisor(user: User = Depends(get_current_active_user)):
    if user.role not in ["supervisor"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return user

def is_admin(user: User = Depends(get_current_active_user)):
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return user