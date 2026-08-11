from fastapi import APIRouter
from app.schemas.review_schema import ReviewCreate

router = APIRouter()


@router.post("")
async def create_review(
    payload: ReviewCreate
):
    return {
        "success": True,
        "message": "Review Added"
    }


@router.get("/product/{product_id}")
async def get_product_reviews(
    product_id: str
):
    return {
        "success": True,
        "message": "Product Reviews"
    }


@router.delete("/{review_id}")
async def delete_review(
    review_id: str
):
    return {
        "success": True,
        "message": "Review Deleted"
    }