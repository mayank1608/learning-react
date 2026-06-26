from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine, SessionLocal
from .routers import auth, products, categories, cart, reviews, newsletter, hero_banner, sitemap, profile, orders, wishlist, coupons, offers, support
from .seed_data import seed_database

Base.metadata.create_all(bind=engine)

# Seed sample data
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

app = FastAPI(title="E-Commerce API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(cart.router)
app.include_router(reviews.router)
app.include_router(newsletter.router)
app.include_router(hero_banner.router)
app.include_router(sitemap.router)
app.include_router(profile.router)
app.include_router(orders.router)
app.include_router(wishlist.router)
app.include_router(coupons.router)
app.include_router(offers.router)
app.include_router(support.router)


@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy"}
