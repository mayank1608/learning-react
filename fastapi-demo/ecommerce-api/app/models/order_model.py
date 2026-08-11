from datetime import datetime


ORDER_STATUS = {
    "PENDING": "PENDING",
    "PROCESSING": "PROCESSING",
    "SHIPPED": "SHIPPED",
    "DELIVERED": "DELIVERED",
    "CANCELLED": "CANCELLED"
}


PAYMENT_STATUS = {
    "PENDING": "PENDING",
    "PAID": "PAID",
    "FAILED": "FAILED",
    "REFUNDED": "REFUNDED"
}


def create_order_document(
    user_id: str,
    address_id: str,
    total_amount: float,
    payment_method: str = "COD"
):
    """
    Creates an order document.

    Order contains high-level information.
    Actual product details will be stored in order_items collection.
    """

    return {
        "user_id": user_id,
        "address_id": address_id,
        "total_amount": total_amount,
        "status": ORDER_STATUS["PENDING"],
        "payment_method": payment_method,
        "payment_status": PAYMENT_STATUS["PENDING"],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
