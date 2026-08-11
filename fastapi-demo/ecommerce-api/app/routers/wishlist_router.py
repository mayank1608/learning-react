from fastapi import APIRouter
from app.schemas.wishlist_schema import WishlistAdd

router = APIRouter()


@router.post("/add")
async def add_to_wishlist(
    payload: WishlistAdd
):
    return {
        "success": True,
        "message": "Product Added To Wishlist"
    }


@router.delete("/remove/{product_id}")
async def remove_from_wishlist(
    product_id: str
):
    return {
        "success": True,
        "message": "Product Removed"
    }


@router.get("")
async def get_wishlist():
    return {
        "success": True,
        "message": "Wishlist Data"
    }