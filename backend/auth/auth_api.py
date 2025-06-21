from datetime import datetime, timedelta, timezone # Added timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
import models # Assuming models.User has id, name, password_hash, role attributes
# from passlib.context import CryptContext # Removed: bcrypt_context imported from .security
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordRequestForm # OAuth2PasswordBearer is Oauth2_b from .security
from db.database import get_db
from .auth_schemas import CreateUserModel, CreateUserResponseModel, Token
from sqlalchemy.orm import Session
import sqlalchemy.exc # Added for specific exception handling
from pydantic import BaseModel
from .security import bcrypt_context, Oauth2_b # Oauth2_b is OAuth2PasswordBearer instance
from dotenv import load_dotenv
import os
from .auth_controller import get_current_user, create_access_token, authenticate_user

load_dotenv() # Best to call this once at app startup

# Configuration - Enhanced with validation
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES_STR = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")

if not SECRET_KEY:
    raise ValueError("Missing SECRET_KEY environment variable.")
if not ALGORITHM:
    raise ValueError("Missing ALGORITHM environment variable.")
if not ACCESS_TOKEN_EXPIRE_MINUTES_STR:
    raise ValueError("Missing ACCESS_TOKEN_EXPIRE_MINUTES environment variable.")
try:
    ACCESS_TOKEN_EXPIRE_MINUTES = int(ACCESS_TOKEN_EXPIRE_MINUTES_STR)
except ValueError:
    raise ValueError("ACCESS_TOKEN_EXPIRE_MINUTES must be an integer.")


router = APIRouter(prefix="/auth", tags=["auth"])



@router.post("/login", response_model=Token)
def login_user(formData: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(formData.username, formData.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not isinstance(user, models.User):
         raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication process error.",
        )

    token_expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(user=user, time_delta=token_expires_delta)
    return {"access_token": token, "token_type": "bearer"}



@router.post("/create_user_merchendiser", response_model=CreateUserResponseModel, status_code=status.HTTP_201_CREATED)
def create_user_merchandiser(user_data: CreateUserModel, db: Session = Depends(get_db)):
    user_exists = db.query(models.User).filter_by(name=user_data.username).first()
    if user_exists:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"User '{user_data.username}' already exists")
    
    hashed_pass = bcrypt_context.hash(user_data.password)
    new_user = models.User(name=user_data.username, password_hash=hashed_pass, retail_partner_id=None, role='merchandiser')
    
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except sqlalchemy.exc.SQLAlchemyError as e:
        db.rollback()
        print(f"Database error: {e}") # For debugging
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error occurred while creating user.")
    except Exception as e: # Catch any other unexpected errors
        db.rollback()
        # In production, you would log the error 'e'
        print(f"Unexpected error: {e}") # For debugging
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred.")
        
    return CreateUserResponseModel(id=new_user.id, username=new_user.name, role=new_user.role)


@router.get("/", response_model=List[CreateUserResponseModel]) 
def all_users(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # 'current_user' can be used here if you need to check roles/permissions for listing all users
    # For example:
    # if current_user.role != "admin":
    #     raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view all users")

    all_users_db = db.query(models.User).all()
    response_users = []
    for user_db in all_users_db:
        response_users.append(
            CreateUserResponseModel(
                id=user_db.id,
                username=user_db.name, # Assuming models.User.name is the username field
                role=user_db.role
            )
        )
    return response_users
