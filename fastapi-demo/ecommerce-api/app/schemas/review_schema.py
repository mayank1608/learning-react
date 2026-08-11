from pydantic import BaseModel
from typing import Optional


class ReviewCreate(BaseModel):
    product_id: str
    rating: int
    comment: str


class ReviewResponse(BaseModel):
    id: Optional[str] = None
    product_id: str
    user_id: str
    rating: int
    comment: str