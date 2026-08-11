from datetime import datetime


def create_wishlist_document(
    user_id: str,
    product_ids: list = None
):
    """
    Creates a wishlist document for a user.

    Each user should have one wishlist.
    """

    if product_ids is None:
        product_ids = []

    return {
        "user_id": user_id,
        "product_ids": product_ids,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }