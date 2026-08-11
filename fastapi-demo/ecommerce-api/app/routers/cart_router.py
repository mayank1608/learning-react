from fastapi import APIRouter
from app.schemas.cart_schema import CartItemCreate

router = APIRouter()


@router.post("/add")
async def add_to_cart(
    payload: CartItemCreate
):
    return {
        "success": True,
        "message": "Added To Cart"
    }


@router.get("")
async def get_cart():
    return {
        "success": True,
        "message": "Cart Data"
    }


@router.put("/update")
async def update_cart(
    payload: CartItemCreate
):
    return {
        "success": True,
        "message": "Cart Updated"
    }


@router.delete("/remove/{product_id}")
async def remove_from_cart(
    product_id: str
):
    return {
        "success": True,
        "message": "Item Removed"
    }


@router.delete("/clear")
async def clear_cart():
    return {
        "success": True,
        "message": "Cart Cleared"
    }