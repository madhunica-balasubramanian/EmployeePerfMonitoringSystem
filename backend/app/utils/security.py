from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "cmpe272project"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 10

# Generate a password hash for a given plain password.
# This function is used to securely store user passwords in the database.
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
# This function verifies a plain password against a hashed password.
# It uses the passlib library to check if the provided password matches the stored hash.
# This is useful for user authentication in web applications.
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
# This function creates a JWT access token for a given user.
# It takes a dictionary of user data and an optional expiration time.
# The token is signed with a secret key and an algorithm (HS256).
# The token can be used for authentication in web applications.
# The token contains the user data and an expiration time.
# The expiration time is set to 10 minutes by default, but can be customized.
# The token is returned as a string.
# The token can be used to authenticate the user in subsequent requests.
# The token should be included in the Authorization header of the request.
# The token can be verified using the same secret key and algorithm.
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt