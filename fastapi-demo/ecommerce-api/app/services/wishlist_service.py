from app.core.database import db


class WishlistService:

    @staticmethod
    async def get_wishlist(user_id):

        return await db.wishlist.find_one({
            "user_id": user_id
        })