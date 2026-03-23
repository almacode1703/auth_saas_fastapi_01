from pydantic import BaseModel

class RegisterUser(BaseModel):
    username: str
    name:str
    email: str
    password: str

class LoginUser(BaseModel):
    email: str
    password: str
    