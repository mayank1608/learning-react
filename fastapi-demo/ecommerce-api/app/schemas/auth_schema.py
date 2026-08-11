from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "Bearer"     
       
class LoginResponse(BaseModel):
    success: bool
    message: str
    data: TokenResponse


    