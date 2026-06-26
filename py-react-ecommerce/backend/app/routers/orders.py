from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas import OrderCreate, OrderResponse
from .. import crud
from .deps import get_current_user

router = APIRouter(prefix="/api/v1/orders", tags=["orders"])


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(data: OrderCreate, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    order = crud.create_order(db, user_id, data.address_id, data.payment_method, data.coupon_code)
    if not order:
        raise HTTPException(status_code=400, detail="Cart is empty")
    return order


@router.get("", response_model=list[OrderResponse])
def get_orders(user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.get_user_orders(db, user_id)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    order = crud.get_order_by_id(db, order_id, user_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
