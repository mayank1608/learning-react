from fastapi import APIRouter
from app.schemas.product_schema import (
    ProductCreate,
    ProductUpdate
)

router = APIRouter()


@router.post("")
async def create_product(
    payload: ProductCreate
):
    return {
        "success": True,
        "message": "Product Created"
    }


@router.get("")
async def get_products(
    page: int = 1,
    limit: int = 10,
    search: str = ""
):
    return {
        "success": True,
        "message": "Products List"
    }


@router.get("/{product_id}")
async def get_product(
    product_id: str
):
    return {
        "success": True,
        "message": "Product Details"
    }


@router.put("/{product_id}")
async def update_product(
    product_id: str,
    payload: ProductUpdate
):
    return {
        "success": True,
        "message": "Product Updated"
    }


@router.delete("/{product_id}")
async def delete_product(
    product_id: str
):
    return {
        "success": True,
        "message": "Product Deleted"
    }