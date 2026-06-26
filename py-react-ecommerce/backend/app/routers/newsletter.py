from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas import NewsletterSubscribe, NewsletterResponse
from .. import crud

router = APIRouter(prefix="/api/v1/newsletter", tags=["newsletter"])


@router.post("/subscribe", response_model=NewsletterResponse, status_code=status.HTTP_201_CREATED)
def subscribe(data: NewsletterSubscribe, db: Session = Depends(get_db)):
    subscriber = crud.subscribe_newsletter(db, data.email)
    if subscriber is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already subscribed",
        )
    return subscriber
