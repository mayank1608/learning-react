from fastapi import APIRouter
from app.schemas.address_schema import (
    AddressCreate,
    AddressUpdate
)

router = APIRouter()


@router.post("")
async def create_address(
    payload: AddressCreate
):
    return {
        "success": True,
        "message": "Address Added"
    }


@router.get("")
async def get_addresses():
    return {
        "success": True,
        "message": "Address List"
    }


@router.put("/{address_id}")
async def update_address(
    address_id: str,
    payload: AddressUpdate
):
    return {
        "success": True,
        "message": "Address Updated"
    }


@router.delete("/{address_id}")
async def delete_address(
    address_id: str
):
    return {
        "success": True,
        "message": "Address Deleted"
    }