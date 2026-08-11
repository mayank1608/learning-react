from app.core.database import db


class OrderService:

    @staticmethod
    async def create(
        user_id: str,
        address_id: str,
        total_amount: float
    ):

        order = {
            "user_id": user_id,
            "address_id": address_id,
            "total_amount": total_amount,
            "status": "PENDING"
        }

        result = await db.orders.insert_one(
            order
        )

        return str(result.inserted_id)

    @staticmethod
    async def get_orders(user_id):

        return await db.orders.find(
            {
                "user_id": user_id
            }
        ).to_list(length=None)