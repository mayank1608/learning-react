from fastapi import APIRouter
from app.schemas.order_schema import CreateOrder

router = APIRouter()


@router.post("")
async def create_order(
    payload: CreateOrder
):
    return {
        "success": True,
        "message": "Order Created"
    }


@router.get("")
async def get_orders():
    return {
        "success": True,
        "message": "Orders List"
    }


@router.get("/{order_id}")
async def get_order(
    order_id: str
):
    return {
        "success": True,
        "message": "Order Details"
    }


@router.put("/{order_id}/cancel")
async def cancel_order(
    order_id: str
):
    return {
        "success": True,
        "message": "Order Cancelled"
    }