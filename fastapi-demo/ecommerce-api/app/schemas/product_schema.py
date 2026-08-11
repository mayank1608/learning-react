from pydantic import BaseModel
from typing import Optional, List


class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    stock: int
    category_id: str
    images: List[str] = []


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    category_id: Optional[str] = None
    images: Optional[List[str]] = None


class ProductResponse(BaseModel):
    id: Optional[str] = None
    name: str
    description: str
    price: float
    stock: int
    category_id: str
    images: List[str]
    rating: float = 0