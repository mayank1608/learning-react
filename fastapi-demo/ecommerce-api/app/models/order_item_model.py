from datetime import datetime


def create_order_item_document(
    order_id: str,
    product_id: str,
    product_name: str,
    quantity: int,
    price: float,
    image: str = None
):
    """
    Creates an order item document.

    Why store product_name and price here?

    Because product price/name may change later.
    But old order history should remain unchanged.
    """

    return {
        "order_id": order_id,
        "product_id": product_id,
        "product_name": product_name,
        "quantity": quantity,
        "price": price,
        "image": image,
        "created_at": datetime.utcnow()
    }