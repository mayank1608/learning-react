from pydantic import BaseModel
from typing import Optional


class CategoryCreate(BaseModel):
    name: str


class CategoryUpdate(BaseModel):
    name: Optional[str] = None


class CategoryResponse(BaseModel):
    id: Optional[str] = None
    name: str