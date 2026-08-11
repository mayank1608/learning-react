from app.core.database import db
from app.core.security import create_access_token, hash_password, verify_password

from app.models.user_model import create_user_document
from app.exceptions.custom_exceptions import (
    InvalidCredentialsException,
    UserAlreadyExistsException
)

from app.schemas.auth_schema import TokenResponse


class AuthService:

    @staticmethod
    async def register(payload):

        existing_user = await db.users.find_one(
            {
                "email": payload.email.lower()
            }
        )

        if existing_user:
            raise UserAlreadyExistsException(
                "Email already registered"
            )

        hashed_password = hash_password(
            payload.password
        )

        new_user = create_user_document(
            first_name=payload.first_name,
            last_name=payload.last_name,
            email=payload.email,
            password=hashed_password
        )

        result = await db.users.insert_one(
            new_user
        )

        return {
            "id": str(result.inserted_id),
            "first_name": payload.first_name,
            "last_name": payload.last_name,
            "email": payload.email,
            "role": "customer"
        }
        
    @staticmethod
    async def login(payload):

        user = await db.users.find_one(
            {"email": payload.email}
        )
        
        if not user:
            raise InvalidCredentialsException(
                "Not a registered user"
            )
        
        if not verify_password(
            payload.password,
            user["password"]
        ):
            raise InvalidCredentialsException(
                "Invalid Credentials"
            )
        
        token = create_access_token({
            "user_id": str(user["_id"]),
            "role": user["role"]
        })

        return TokenResponse(
            access_token=token,
            token_type="bearer"
        )