from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import SessionLocal
from ..crud import get_active_hero_banners
from ..schemas import HeroBannerResponse

router = APIRouter(prefix="/api/v1", tags=["hero-banner"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/hero-banner", response_model=list[HeroBannerResponse])
def list_hero_banners(db: Session = Depends(get_db)):
    return get_active_hero_banners(db)
