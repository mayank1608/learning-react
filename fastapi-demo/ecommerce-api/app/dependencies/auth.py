from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from bson import ObjectId

from app.core.database import db
from app.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login"
)


async def get_current_user(
    token: str = Depends(oauth2_scheme)
):
    
    print('current user called')
    try:
        print('token', token)
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        print('payload', payload)
        
        
        if not payload:
            raise HTTPException(
                status_code=401,
                detail="Unauthorized"
            )


        user_id = payload.get("user_id")

        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid Token"
            )

        user = await db.users.find_one(
            {"_id": ObjectId(user_id)}
        )

        if not user:
            raise HTTPException(
                status_code=401,
                detail="User not found"
            )

        return user

    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )


async def admin_required(
    current_user=Depends(get_current_user)
):

    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Forbidden"
        )

    return current_user