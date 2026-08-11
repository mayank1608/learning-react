from datetime import datetime


def create_product_document(
    name: str,
    description: str,
    price: float,
    stock: int,
    category_id: str,
    images: list = None,
    brand: str = None
):
    """
    Creates a MongoDB product document.

    Product belongs to one category.
    category_id will store MongoDB ObjectId as string initially.
    """

    if images is None:
        images = []

    return {
        "name": name,
        "description": description,
        "price": price,
        "stock": stock,
        "category_id": category_id,
        "brand": brand,
        "images": images,
        "rating": 0,
        "num_reviews": 0,
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }