from fastapi import APIRouter
from fastapi import Depends

from app.dependencies.auth import get_current_user


router = APIRouter()


@router.get("/profile", dependencies=[Depends(get_current_user)])
async def get_profile(
    current_user = Depends(get_current_user)
):

    print('current_user')
    return {
        "success": True,
        "data": current_user
    }

@router.put("/profile")
async def update_profile():
    return {
        "success": True,
        "message": "Profile Updated"
    }


@router.delete("/profile")
async def delete_profile():
    return {
        "success": True,
        "message": "Account Deleted"
    }