from pydantic import BaseModel

class CreateUserModel(BaseModel):
    username: str
    password: str
    class Config:
        from_attributes = True

class CreateUserResponseModel(BaseModel):
    id: int
    username: str
    role: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
