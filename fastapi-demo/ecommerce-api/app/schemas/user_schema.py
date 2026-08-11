from pydantic import BaseModel, EmailStr, Field


class UserRegisterRequest(BaseModel):
    first_name: str = Field(..., min_length=2, max_length=50)
    last_name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    role: str


class RegisterResponse(BaseModel):
    success: bool
    message: str
    data: UserResponse