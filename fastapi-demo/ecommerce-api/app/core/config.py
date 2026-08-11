from dotenv import load_dotenv
import os

load_dotenv()


class Settings:
    MONGO_URL = os.getenv("MONGO_URL")
    DATABASE_NAME = os.getenv("DATABASE_NAME")

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60)
    )


settings = Settings()