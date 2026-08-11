from datetime import datetime


def create_category_document(
    name: str,
    description: str = None,
    image: str = None
):
    """
    Creates a MongoDB category document.

    Example:
    Mobiles, Laptops, Clothes, Shoes, etc.
    """

    return {
        "name": name,
        "description": description,
        "image": image,
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }