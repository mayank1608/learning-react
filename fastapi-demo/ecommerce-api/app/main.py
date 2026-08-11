from fastapi import FastAPI

from app.routers.auth_router import router as auth_router
from app.routers.user_router import router as user_router
from app.routers.category_router import router as category_router
from app.routers.product_router import router as product_router
from app.routers.review_router import router as review_router
from app.routers.cart_router import router as cart_router
from app.routers.address_router import router as address_router
from app.routers.wishlist_router import router as wishlist_router
from app.routers.order_router import router as order_router

app = FastAPI(
    title="Ecommerce API",
    description="FastAPI Ecommerce Backend",
    version="1.0.0"
)


@app.get("/")
async def health_check():
    return {
        "success": True,
        "message": "Ecommerce API Running"
    }


app.include_router(
    auth_router,
    prefix="/api/v1/auth",
    tags=["Authentication"]
)

app.include_router(
    user_router,
    prefix="/api/v1/users",
    tags=["Users"]
)

app.include_router(
    category_router,
    prefix="/api/v1/categories",
    tags=["Categories"]
)

app.include_router(
    product_router,
    prefix="/api/v1/products",
    tags=["Products"]
)

app.include_router(
    review_router,
    prefix="/api/v1/reviews",
    tags=["Reviews"]
)

app.include_router(
    cart_router,
    prefix="/api/v1/cart",
    tags=["Cart"]
)

app.include_router(
    address_router,
    prefix="/api/v1/addresses",
    tags=["Addresses"]
)

app.include_router(
    wishlist_router,
    prefix="/api/v1/wishlist",
    tags=["Wishlist"]
)

app.include_router(
    order_router,
    prefix="/api/v1/orders",
    tags=["Orders"]
)