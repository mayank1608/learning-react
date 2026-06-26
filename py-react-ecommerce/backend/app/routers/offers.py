from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas import OfferResponse
from .. import crud

router = APIRouter(prefix="/api/v1/offers", tags=["offers"])


@router.get("", response_model=list[OfferResponse])
def get_offers(category_id: int | None = None, db: Session = Depends(get_db)):
    return crud.get_active_offers(db, category_id)
