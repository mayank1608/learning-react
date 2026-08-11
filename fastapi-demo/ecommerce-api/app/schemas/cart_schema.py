from pydantic import BaseModel
from typing import List


class CartItemCreate(BaseModel):
    product_id: str
    quantity: int


class CartItemResponse(BaseModel):
    product_id: str
    quantity: int


class CartResponse(BaseModel):
    user_id: str
    items: List[CartItemResponse]