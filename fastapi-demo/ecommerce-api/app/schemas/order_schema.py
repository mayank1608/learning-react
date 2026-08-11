from pydantic import BaseModel
from typing import List, Optional


class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int


class CreateOrder(BaseModel):
    address_id: str


class OrderItemResponse(BaseModel):
    product_id: str
    quantity: int
    price: float


class OrderResponse(BaseModel):
    id: Optional[str] = None
    user_id: str
    total_amount: float
    status: str
    address_id: str
    items: List[OrderItemResponse]