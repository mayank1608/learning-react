from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas import ReviewResponse, ReviewCreate
from .. import crud
from .deps import get_current_user

router = APIRouter(prefix="/api/v1/reviews", tags=["reviews"])


@router.get("", response_model=list[ReviewResponse])
def list_reviews(product_id: int = Query(...), db: Session = Depends(get_db)):
    return crud.get_reviews(db, product_id)


@router.post("", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(data: ReviewCreate, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.create_review(db, user_id, data.product_id, data.rating, data.comment)
