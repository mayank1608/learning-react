import os

from fastapi import APIRouter, Depends, HTTPException, status
from jose import JWTError, jwt
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas import CartItemCreate, CartItemResponse, CartItemUpdate
from .. import crud

SECRET_KEY = os.getenv("SECRET_KEY", "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7")
ALGORITHM = "HS256"

security = HTTPBearer()

router = APIRouter(prefix="/api/v1/cart", tags=["cart"])


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return int(user_id)
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


@router.get("", response_model=list[CartItemResponse])
def get_cart(user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.get_cart_items(db, user_id)


@router.post("", response_model=CartItemResponse, status_code=status.HTTP_201_CREATED)
def add_to_cart(
    item: CartItemCreate,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cart_item = crud.add_to_cart(db, user_id, item.product_id, item.quantity)
    return cart_item


@router.delete("/{item_id}", status_code=status.HTTP_200_OK)
def remove_from_cart(
    item_id: int,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = crud.remove_from_cart(db, item_id, user_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")
    return {"detail": "Item removed from cart"}


@router.put("/{item_id}", response_model=CartItemResponse)
def update_cart_item(
    item_id: int,
    data: CartItemUpdate,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = crud.update_cart_item(db, item_id, user_id, data.quantity)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")
    return item
