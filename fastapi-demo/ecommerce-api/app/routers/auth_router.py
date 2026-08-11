from fastapi import APIRouter, HTTPException
from app.schemas.user_schema import UserRegisterRequest, RegisterResponse
from app.schemas.auth_schema import LoginRequest, LoginResponse
from app.services.auth_service import AuthService
from app.exceptions.custom_exceptions import InvalidCredentialsException, UserAlreadyExistsException

router = APIRouter()


@router.post("/register", response_model=RegisterResponse)
async def register(
    payload: UserRegisterRequest
):
    try:

        user = await AuthService.register(
            payload
        )

        return {
            "success": True,
            "message": "User registered successfully",
            "data": user
        }

    except UserAlreadyExistsException as e:

        raise HTTPException(
            status_code=409,
            detail=str(e)
        )

    except Exception:

        raise HTTPException(
            status_code=500,
            detail="Internal Server Error"
        )
        
@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest):
    # print("payload", payload)
    try:
        
        user = await AuthService.login(
            payload
        )
        
        return {
            "success": True,
            "message": "User Logged in successfully",
            "data": user
        }
    
    
    except InvalidCredentialsException as e:

        raise HTTPException(
            status_code=401,
            detail=str(e)
        )

        