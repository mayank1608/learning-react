from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas import CouponApply, CouponResponse
from .. import crud
from .deps import get_current_user

router = APIRouter(prefix="/api/v1/coupons", tags=["coupons"])


@router.post("/validate", response_model=CouponResponse)
def validate_coupon(
    data: CouponApply,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cart_items = crud.get_cart_items(db, user_id)
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    subtotal = sum(item.product.price * item.quantity for item in cart_items if item.product)
    coupon = crud.validate_coupon(db, data.code, subtotal)
    if not coupon:
        raise HTTPException(status_code=404, detail="Invalid or expired coupon")
    return coupon
