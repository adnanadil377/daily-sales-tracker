from fastapi import APIRouter
import models
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm


bcrypt_context=CryptContext(schemes=['bcrypt'] , deprecated="auto")
Oauth2_b=OAuth2PasswordBearer("/auth/login")

