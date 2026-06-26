import re
from datetime import datetime

from pydantic import BaseModel, EmailStr, field_validator


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v):
            raise ValueError("Password must contain at least one special character")
        return v


class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one digit")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# --- Home Page Schemas ---


class CategoryResponse(BaseModel):
    id: int
    name: str
    description: str | None = None
    image_url: str | None = None

    class Config:
        from_attributes = True


class ProductResponse(BaseModel):
    id: int
    name: str
    description: str | None = None
    price: float
    image_url: str | None = None
    category_id: int | None = None
    rating: float = 0
    review_count: int = 0
    is_featured: bool = False
    is_trending: bool = False
    category_name: str | None = None

    class Config:
        from_attributes = True


class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = 1


class CartItemUpdate(BaseModel):
    quantity: int


class CartItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    created_at: datetime
    product: ProductResponse | None = None

    class Config:
        from_attributes = True


class ReviewCreate(BaseModel):
    product_id: int
    rating: int
    comment: str | None = None

    @field_validator("rating")
    @classmethod
    def validate_rating(cls, v: int) -> int:
        if v < 1 or v > 5:
            raise ValueError("Rating must be between 1 and 5")
        return v


class ReviewResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    rating: int
    comment: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class NewsletterSubscribe(BaseModel):
    email: EmailStr


class NewsletterResponse(BaseModel):
    id: int
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


# --- Address Schemas ---


class AddressCreate(BaseModel):
    full_name: str
    phone: str
    street: str
    city: str
    state: str
    zip_code: str
    country: str = "India"
    is_default: bool = False


class AddressResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    phone: str
    street: str
    city: str
    state: str
    zip_code: str
    country: str
    is_default: bool
    created_at: datetime

    class Config:
        from_attributes = True


# --- Order Schemas ---


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    product_image: str | None = None
    price: float
    quantity: int

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    address_id: int
    payment_method: str = "card"
    coupon_code: str | None = None


class OrderResponse(BaseModel):
    id: int
    user_id: int
    status: str
    payment_method: str | None = None
    payment_status: str
    subtotal: float
    tax: float
    discount: float
    total: float
    coupon_code: str | None = None
    estimated_delivery: str | None = None
    created_at: datetime
    items: list[OrderItemResponse] = []

    class Config:
        from_attributes = True


# --- Wishlist Schemas ---


class WishlistCreate(BaseModel):
    product_id: int


class WishlistResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    created_at: datetime
    product: ProductResponse | None = None

    class Config:
        from_attributes = True


# --- Coupon Schemas ---


class CouponApply(BaseModel):
    code: str


class CouponResponse(BaseModel):
    id: int
    code: str
    discount_percent: float
    max_discount: float | None = None
    min_order_value: float
    is_active: bool

    class Config:
        from_attributes = True


# --- Offer Schemas ---


class OfferResponse(BaseModel):
    id: int
    title: str
    description: str | None = None
    discount_percent: float
    image_url: str | None = None
    category_id: int | None = None
    is_active: bool
    starts_at: datetime | None = None
    expires_at: datetime | None = None

    class Config:
        from_attributes = True


# --- FAQ & Support Schemas ---


class FAQResponse(BaseModel):
    id: int
    question: str
    answer: str
    category: str

    class Config:
        from_attributes = True


class SupportTicketCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


class SupportTicketResponse(BaseModel):
    id: int
    name: str
    email: str
    subject: str
    message: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class HeroBannerResponse(BaseModel):
    id: int
    title: str
    subtitle: str | None = None
    image_url: str | None = None
    cta_text: str | None = None
    cta_link: str | None = None
    is_active: bool = True
    created_at: datetime

    class Config:
        from_attributes = True
