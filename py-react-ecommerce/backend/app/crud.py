import bcrypt
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from .models import (
    User, Category, Product, CartItem, Review, NewsletterSubscriber,
    HeroBanner, Address, Order, OrderItem, Wishlist, Coupon, Offer, FAQ, SupportTicket
)
from .schemas import UserCreate


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def update_user(db: Session, user_id: int, **kwargs) -> User | None:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
    for key, value in kwargs.items():
        if value is not None:
            setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user


def create_user(db: Session, user_data: UserCreate) -> User:
    hashed = hash_password(user_data.password)
    db_user = User(
        email=user_data.email,
        password_hash=hashed,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user


# --- Product CRUD ---


def get_products(
    db: Session,
    featured: bool | None = None,
    trending: bool | None = None,
    category_id: int | None = None,
    search: str | None = None,
    skip: int = 0,
    limit: int = 20,
):
    query = db.query(Product, Category.name.label("category_name")).outerjoin(
        Category, Product.category_id == Category.id
    )
    if featured is not None:
        query = query.filter(Product.is_featured == featured)
    if trending is not None:
        query = query.filter(Product.is_trending == trending)
    if category_id is not None:
        query = query.filter(Product.category_id == category_id)
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))
    rows = query.offset(skip).limit(limit).all()
    results = []
    for product, cat_name in rows:
        product.category_name = cat_name
        results.append(product)
    return results


def get_product_by_id(db: Session, product_id: int):
    row = (
        db.query(Product, Category.name.label("category_name"))
        .outerjoin(Category, Product.category_id == Category.id)
        .filter(Product.id == product_id)
        .first()
    )
    if row:
        product, cat_name = row
        product.category_name = cat_name
        return product
    return None


def get_related_products(db: Session, product_id: int, category_id: int, limit: int = 4):
    rows = (
        db.query(Product, Category.name.label("category_name"))
        .outerjoin(Category, Product.category_id == Category.id)
        .filter(Product.category_id == category_id, Product.id != product_id)
        .limit(limit)
        .all()
    )
    results = []
    for product, cat_name in rows:
        product.category_name = cat_name
        results.append(product)
    return results


# --- Category CRUD ---


def get_categories(db: Session):
    return db.query(Category).all()


# --- Cart CRUD ---


def get_cart_items(db: Session, user_id: int):
    rows = (
        db.query(CartItem, Product)
        .outerjoin(Product, CartItem.product_id == Product.id)
        .filter(CartItem.user_id == user_id)
        .all()
    )
    results = []
    for cart_item, product in rows:
        cart_item.product = product
        results.append(cart_item)
    return results


def add_to_cart(db: Session, user_id: int, product_id: int, quantity: int):
    existing = (
        db.query(CartItem)
        .filter(CartItem.user_id == user_id, CartItem.product_id == product_id)
        .first()
    )
    if existing:
        existing.quantity += quantity
        db.commit()
        db.refresh(existing)
        return existing
    cart_item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
    db.add(cart_item)
    db.commit()
    db.refresh(cart_item)
    return cart_item


def update_cart_item(db: Session, cart_item_id: int, user_id: int, quantity: int):
    item = (
        db.query(CartItem)
        .filter(CartItem.id == cart_item_id, CartItem.user_id == user_id)
        .first()
    )
    if not item:
        return None
    item.quantity = quantity
    db.commit()
    db.refresh(item)
    return item


def remove_from_cart(db: Session, cart_item_id: int, user_id: int):
    item = (
        db.query(CartItem)
        .filter(CartItem.id == cart_item_id, CartItem.user_id == user_id)
        .first()
    )
    if not item:
        return None
    db.delete(item)
    db.commit()
    return item


def clear_cart(db: Session, user_id: int):
    db.query(CartItem).filter(CartItem.user_id == user_id).delete()
    db.commit()


# --- Review CRUD ---


def get_reviews(db: Session, product_id: int):
    return db.query(Review).filter(Review.product_id == product_id).all()


def create_review(db: Session, user_id: int, product_id: int, rating: int, comment: str | None):
    review = Review(user_id=user_id, product_id=product_id, rating=rating, comment=comment)
    db.add(review)
    db.commit()
    db.refresh(review)
    # Update product rating
    reviews = db.query(Review).filter(Review.product_id == product_id).all()
    avg = sum(r.rating for r in reviews) / len(reviews)
    product = db.query(Product).filter(Product.id == product_id).first()
    if product:
        product.rating = round(avg, 1)
        product.review_count = len(reviews)
        db.commit()
    return review


# --- Newsletter CRUD ---


def subscribe_newsletter(db: Session, email: str):
    existing = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.email == email).first()
    if existing:
        return None
    subscriber = NewsletterSubscriber(email=email)
    db.add(subscriber)
    db.commit()
    db.refresh(subscriber)
    return subscriber


# --- Hero Banner CRUD ---


def get_active_hero_banners(db: Session):
    return db.query(HeroBanner).filter(HeroBanner.is_active == True).all()


# --- Address CRUD ---


def get_user_addresses(db: Session, user_id: int):
    return db.query(Address).filter(Address.user_id == user_id).all()


def create_address(db: Session, user_id: int, **kwargs):
    if kwargs.get("is_default"):
        db.query(Address).filter(Address.user_id == user_id).update({"is_default": False})
    address = Address(user_id=user_id, **kwargs)
    db.add(address)
    db.commit()
    db.refresh(address)
    return address


def update_address(db: Session, address_id: int, user_id: int, **kwargs):
    address = db.query(Address).filter(Address.id == address_id, Address.user_id == user_id).first()
    if not address:
        return None
    if kwargs.get("is_default"):
        db.query(Address).filter(Address.user_id == user_id).update({"is_default": False})
    for key, value in kwargs.items():
        if value is not None:
            setattr(address, key, value)
    db.commit()
    db.refresh(address)
    return address


def delete_address(db: Session, address_id: int, user_id: int):
    address = db.query(Address).filter(Address.id == address_id, Address.user_id == user_id).first()
    if not address:
        return None
    db.delete(address)
    db.commit()
    return address


# --- Order CRUD ---


def create_order(db: Session, user_id: int, address_id: int, payment_method: str, coupon_code: str | None = None):
    cart_items = get_cart_items(db, user_id)
    if not cart_items:
        return None

    subtotal = sum(item.product.price * item.quantity for item in cart_items if item.product)
    tax = round(subtotal * 0.18, 2)  # 18% GST
    discount = 0.0

    if coupon_code:
        coupon = db.query(Coupon).filter(Coupon.code == coupon_code, Coupon.is_active == True).first()
        if coupon and subtotal >= coupon.min_order_value:
            discount = round(subtotal * coupon.discount_percent / 100, 2)
            if coupon.max_discount and discount > coupon.max_discount:
                discount = coupon.max_discount

    total = round(subtotal + tax - discount, 2)
    estimated = (datetime.now() + timedelta(days=5)).strftime("%Y-%m-%d")

    order = Order(
        user_id=user_id,
        address_id=address_id,
        payment_method=payment_method,
        payment_status="completed",
        subtotal=subtotal,
        tax=tax,
        discount=discount,
        total=total,
        coupon_code=coupon_code,
        estimated_delivery=estimated,
        status="confirmed",
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    for item in cart_items:
        if item.product:
            order_item = OrderItem(
                order_id=order.id,
                product_id=item.product_id,
                product_name=item.product.name,
                product_image=item.product.image_url,
                price=item.product.price,
                quantity=item.quantity,
            )
            db.add(order_item)
    db.commit()

    clear_cart(db, user_id)
    return order


def get_user_orders(db: Session, user_id: int):
    orders = db.query(Order).filter(Order.user_id == user_id).order_by(Order.created_at.desc()).all()
    for order in orders:
        order.items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
    return orders


def get_order_by_id(db: Session, order_id: int, user_id: int):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == user_id).first()
    if order:
        order.items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
    return order


# --- Wishlist CRUD ---


def get_wishlist(db: Session, user_id: int):
    rows = (
        db.query(Wishlist, Product)
        .outerjoin(Product, Wishlist.product_id == Product.id)
        .filter(Wishlist.user_id == user_id)
        .all()
    )
    results = []
    for wish_item, product in rows:
        wish_item.product = product
        results.append(wish_item)
    return results


def add_to_wishlist(db: Session, user_id: int, product_id: int):
    existing = db.query(Wishlist).filter(Wishlist.user_id == user_id, Wishlist.product_id == product_id).first()
    if existing:
        return existing
    item = Wishlist(user_id=user_id, product_id=product_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def remove_from_wishlist(db: Session, wishlist_id: int, user_id: int):
    item = db.query(Wishlist).filter(Wishlist.id == wishlist_id, Wishlist.user_id == user_id).first()
    if not item:
        return None
    db.delete(item)
    db.commit()
    return item


# --- Coupon CRUD ---


def validate_coupon(db: Session, code: str, order_total: float):
    coupon = db.query(Coupon).filter(Coupon.code == code, Coupon.is_active == True).first()
    if not coupon:
        return None
    if order_total < coupon.min_order_value:
        return None
    return coupon


# --- Offer CRUD ---


def get_active_offers(db: Session, category_id: int | None = None):
    query = db.query(Offer).filter(Offer.is_active == True)
    if category_id:
        query = query.filter(Offer.category_id == category_id)
    return query.all()


# --- FAQ CRUD ---


def get_faqs(db: Session, category: str | None = None):
    query = db.query(FAQ).order_by(FAQ.sort_order)
    if category:
        query = query.filter(FAQ.category == category)
    return query.all()


# --- Support CRUD ---


def create_support_ticket(db: Session, user_id: int | None, name: str, email: str, subject: str, message: str):
    ticket = SupportTicket(user_id=user_id, name=name, email=email, subject=subject, message=message)
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket
