from pydantic import BaseModel
from typing import List


class WishlistAdd(BaseModel):
    product_id: str


class WishlistResponse(BaseModel):
    user_id: str
    product_ids: List[str]