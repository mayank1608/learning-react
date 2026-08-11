from app.core.database import db


class CategoryService:

    @staticmethod
    async def create(payload):

        category = {
            "name": payload.name
        }

        result = await db.categories.insert_one(
            category
        )

        return str(result.inserted_id)

    @staticmethod
    async def get_all():
        return await db.categories.find().to_list(
            length=None
        )

    @staticmethod
    async def get_by_id(category_id: str):
        return await db.categories.find_one(
            {"_id": category_id}
        )