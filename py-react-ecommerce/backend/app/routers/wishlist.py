from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas import WishlistCreate, WishlistResponse
from .. import crud
from .deps import get_current_user

router = APIRouter(prefix="/api/v1/wishlist", tags=["wishlist"])


@router.get("", response_model=list[WishlistResponse])
def get_wishlist(user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.get_wishlist(db, user_id)


@router.post("", response_model=WishlistResponse, status_code=status.HTTP_201_CREATED)
def add_to_wishlist(data: WishlistCreate, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    item = crud.add_to_wishlist(db, user_id, data.product_id)
    return item


@router.delete("/{wishlist_id}", status_code=status.HTTP_200_OK)
def remove_from_wishlist(wishlist_id: int, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    item = crud.remove_from_wishlist(db, wishlist_id, user_id)
    if not item:
        raise HTTPException(status_code=404, detail="Wishlist item not found")
    return {"message": "Removed from wishlist"}


@router.post("/{wishlist_id}/move-to-cart", status_code=status.HTTP_200_OK)
def move_to_cart(wishlist_id: int, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    from ..models import Wishlist as WishlistModel
    item = db.query(WishlistModel).filter(WishlistModel.id == wishlist_id, WishlistModel.user_id == user_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Wishlist item not found")
    crud.add_to_cart(db, user_id, item.product_id, 1)
    crud.remove_from_wishlist(db, wishlist_id, user_id)
    return {"message": "Moved to cart"}
