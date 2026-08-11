from app.core.database import db
from app.models.product_model import create_product_document

class ProductService:

    @staticmethod
    async def create(payload):
        
        new_product = create_product_document(
            name=payload.name,
            description=payload.description,
            price=payload.price,
            stock=payload.stock,
            category_id=payload.category_id,
            images=payload.images
            rating=0
        )

        result = await db.products.insert_one(
            new_product
        )

        return str(result.inserted_id)

    @staticmethod
    async def get_all():

        return await db.products.find().to_list(
            length=None
        )

    @staticmethod
    async def get_by_id(product_id: str):

        return await db.products.find_one(
            {"_id": product_id}
        )