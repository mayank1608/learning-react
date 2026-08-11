from datetime import datetime


def create_review_document(
    user_id: str,
    product_id: str,
    rating: int,
    comment: str
):
    """
    Creates a MongoDB review document.

    One user can review a product.
    Later we can prevent duplicate review for same product by same user.
    """

    return {
        "user_id": user_id,
        "product_id": product_id,
        "rating": rating,
        "comment": comment,
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }