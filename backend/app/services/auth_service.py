#from sqlalchemy.orm import Session
#from app.models.models import User
#from app.utils.security import verify_password

# This function authenticates a user by checking the provided email and password against the database.
# If the credentials are valid, it returns the user object; otherwise, it returns None.
# This is useful for login functionality in web applications.
# It uses SQLAlchemy to query the database for the user with the given email.
# The password is verified using a utility function (verify_password) that checks the hashed password.
# The function is designed to be used in conjunction with FastAPI's dependency injection system.
# It takes a SQLAlchemy session, email, and password as parameters.

#def authenticate_user(db: Session, email: str, password: str):
    #user = db.query(User).filter(User.email == email).first()
    #if not user:
    #    return None
    #if not verify_password(password, user.hashed_password):
    #    return None
    #return user