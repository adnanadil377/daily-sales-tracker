from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
import models
from jose import JWTError, jwt
from db.database import get_db
from sqlalchemy.orm import Session
from .security import bcrypt_context, Oauth2_b
from dotenv import load_dotenv
import os

load_dotenv() 
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES_STR = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")

def authenticate_user(username: str, password: str, db: Session) -> models.User | bool:
    user = db.query(models.User).filter_by(name=username).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.password_hash):
        return False
    return user

def create_access_token(user: models.User, time_delta: timedelta) -> str:
    to_encode = {'sub': user.name, 'user_id': user.id, 'role': user.role}
    expires = datetime.now(timezone.utc) + time_delta
    to_encode.update({'exp': expires})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_user(token: str = Depends(Oauth2_b), db: Session = Depends(get_db)) -> models.User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str | None = payload.get('sub')
        user_id: int | None = payload.get('user_id')
        # role: str | None = payload.get('role') # Role from token, if needed directly

        if username is None or user_id is None:
            raise credentials_exception
        
        user = db.query(models.User).filter(models.User.id == user_id, models.User.name == username).first()
        if user is None:
            raise credentials_exception
        return user
    except JWTError:
        raise credentials_exception