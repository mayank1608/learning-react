from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text, UniqueConstraint
from sqlalchemy.sql import func

from .database import Base


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    phone = Column(String)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())


class Category(Base):
    __tablename__ = "category"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    image_url = Column(String)


class Product(Base):
    __tablename__ = "product"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    price = Column(Float, nullable=False)
    image_url = Column(String)
    category_id = Column(Integer, ForeignKey("category.id"))
    rating = Column(Float, default=0)
    review_count = Column(Integer, default=0)
    is_featured = Column(Boolean, default=False)
    is_trending = Column(Boolean, default=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())


class CartItem(Base):
    __tablename__ = "cart_item"
    __table_args__ = (UniqueConstraint("user_id", "product_id", name="uq_cart_user_product"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("product.id"), nullable=False)
    quantity = Column(Integer, default=1)
    created_at = Column(DateTime, nullable=False, server_default=func.now())


class Review(Base):
    __tablename__ = "review"
    __table_args__ = (UniqueConstraint("user_id", "product_id", name="uq_review_user_product"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("product.id"), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text)
    created_at = Column(DateTime, nullable=False, server_default=func.now())


class NewsletterSubscriber(Base):
    __tablename__ = "newsletter_subscriber"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())


class HeroBanner(Base):
    __tablename__ = "hero_banner"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    subtitle = Column(String)
    image_url = Column(String)
    cta_text = Column(String)
    cta_link = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())


class Address(Base):
    __tablename__ = "address"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    street = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    zip_code = Column(String, nullable=False)
    country = Column(String, nullable=False, default="India")
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())


class Order(Base):
    __tablename__ = "order"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    address_id = Column(Integer, ForeignKey("address.id"))
    status = Column(String, nullable=False, default="pending")  # pending, confirmed, shipped, delivered, cancelled
    payment_method = Column(String)  # card, upi, netbanking
    payment_status = Column(String, default="pending")  # pending, completed, failed
    subtotal = Column(Float, nullable=False)
    tax = Column(Float, nullable=False, default=0)
    discount = Column(Float, nullable=False, default=0)
    total = Column(Float, nullable=False)
    coupon_code = Column(String)
    estimated_delivery = Column(String)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())


class OrderItem(Base):
    __tablename__ = "order_item"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("order.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("product.id"), nullable=False)
    product_name = Column(String, nullable=False)
    product_image = Column(String)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False, default=1)


class Wishlist(Base):
    __tablename__ = "wishlist"
    __table_args__ = (UniqueConstraint("user_id", "product_id", name="uq_wishlist_user_product"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("product.id"), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())


class Coupon(Base):
    __tablename__ = "coupon"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False)
    discount_percent = Column(Float, nullable=False)
    max_discount = Column(Float)
    min_order_value = Column(Float, default=0)
    is_active = Column(Boolean, default=True)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, nullable=False, server_default=func.now())


class Offer(Base):
    __tablename__ = "offer"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    discount_percent = Column(Float, nullable=False)
    image_url = Column(String)
    category_id = Column(Integer, ForeignKey("category.id"))
    is_active = Column(Boolean, default=True)
    starts_at = Column(DateTime)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, nullable=False, server_default=func.now())


class FAQ(Base):
    __tablename__ = "faq"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String, nullable=False)
    answer = Column(Text, nullable=False)
    category = Column(String, default="general")
    sort_order = Column(Integer, default=0)


class SupportTicket(Base):
    __tablename__ = "support_ticket"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String, default="open")  # open, in_progress, resolved
    created_at = Column(DateTime, nullable=False, server_default=func.now())
