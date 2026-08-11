from fastapi import APIRouter
from app.schemas.category_schema import (
    CategoryCreate,
    CategoryUpdate
)

router = APIRouter()


@router.post("")
async def create_category(
    payload: CategoryCreate
):
    return {
        "success": True,
        "message": "Category Created"
    }


@router.get("")
async def get_categories():
    return {
        "success": True,
        "message": "Categories List"
    }


@router.get("/{category_id}")
async def get_category(
    category_id: str
):
    return {
        "success": True,
        "message": "Category Details"
    }


@router.put("/{category_id}")
async def update_category(
    category_id: str,
    payload: CategoryUpdate
):
    return {
        "success": True,
        "message": "Category Updated"
    }


@router.delete("/{category_id}")
async def delete_category(
    category_id: str
):
    return {
        "success": True,
        "message": "Category Deleted"
    }