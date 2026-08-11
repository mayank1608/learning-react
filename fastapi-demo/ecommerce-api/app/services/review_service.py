from app.core.database import db


class ReviewService:

    @staticmethod
    async def create(user_id, payload):

        review = {
            "user_id": user_id,
            "product_id": payload.product_id,
            "rating": payload.rating,
            "comment": payload.comment
        }

        result = await db.reviews.insert_one(
            review
        )

        return str(result.inserted_id)