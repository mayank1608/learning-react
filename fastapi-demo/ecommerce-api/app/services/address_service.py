from app.core.database import db


class AddressService:

    @staticmethod
    async def create(user_id, payload):

        address = payload.model_dump()

        address["user_id"] = user_id

        result = await db.addresses.insert_one(
            address
        )

        return str(result.inserted_id)