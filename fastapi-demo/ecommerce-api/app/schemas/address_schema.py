from pydantic import BaseModel
from typing import Optional


class AddressCreate(BaseModel):
    full_name: str
    phone_number: str
    address_line_1: str
    address_line_2: Optional[str] = None
    city: str
    state: str
    country: str
    postal_code: str


class AddressUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    address_line_1: Optional[str] = None
    address_line_2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None


class AddressResponse(AddressCreate):
    id: Optional[str] = None