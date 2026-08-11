from app.core.database import db


class CartService:

    @staticmethod
    async def get_cart(user_id):

        cart = await db.carts.find_one({
            "user_id": user_id
        })

        return cart