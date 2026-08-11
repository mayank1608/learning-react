from datetime import datetime


def create_cart_item_document(
    product_id: str,
    quantity: int,
    price: float
):
    """
    Creates a cart item object.
    This will be stored inside cart.items array.
    """

    return {
        "product_id": product_id,
        "quantity": quantity,
        "price": price
    }


def create_cart_document(
    user_id: str,
    items: list = None
):
    """
    Creates a cart document for a user.

    Each user should have one cart.
    """

    if items is None:
        items = []

    return {
        "user_id": user_id,
        "items": items,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }