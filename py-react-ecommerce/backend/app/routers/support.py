from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas import FAQResponse, SupportTicketCreate, SupportTicketResponse
from .. import crud
from .deps import get_current_user, security
from fastapi.security import HTTPAuthorizationCredentials
from jose import JWTError, jwt
import os

SECRET_KEY = os.getenv("SECRET_KEY", "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7")
ALGORITHM = "HS256"

router = APIRouter(prefix="/api/v1/support", tags=["support"])


@router.get("/faqs", response_model=list[FAQResponse])
def get_faqs(category: str | None = None, db: Session = Depends(get_db)):
    return crud.get_faqs(db, category)


@router.post("/tickets", response_model=SupportTicketResponse, status_code=status.HTTP_201_CREATED)
def create_ticket(data: SupportTicketCreate, db: Session = Depends(get_db)):
    return crud.create_support_ticket(db, None, data.name, data.email, data.subject, data.message)
