from fastapi import APIRouter

router = APIRouter(prefix="/api/v1", tags=["sitemap"])


@router.get("/sitemap")
def get_sitemap():
    return {
        "pages": [
            {"name": "Home", "path": "/", "description": "Main landing page"},
            {"name": "Login", "path": "/login", "description": "Login and registration"},
            {"name": "Sitemap", "path": "/sitemap", "description": "Site navigation map"},
        ],
        "sections": [
            {"name": "Hero Banner", "page": "Home", "anchor": "#hero"},
            {"name": "Categories", "page": "Home", "anchor": "#categories"},
            {"name": "Featured Products", "page": "Home", "anchor": "#featured"},
            {"name": "Trending Products", "page": "Home", "anchor": "#trending"},
            {"name": "Testimonials", "page": "Home", "anchor": "#testimonials"},
            {"name": "Newsletter", "page": "Home", "anchor": "#newsletter"},
            {"name": "Footer", "page": "Home", "anchor": "#footer"},
        ],
        "api_endpoints": [
            {"method": "GET", "path": "/api/v1/health", "description": "Health check"},
            {"method": "GET", "path": "/api/v1/products", "description": "List products"},
            {"method": "GET", "path": "/api/v1/categories", "description": "List categories"},
            {"method": "GET", "path": "/api/v1/hero-banner", "description": "Get hero banners"},
            {"method": "POST", "path": "/api/v1/auth/login", "description": "User login"},
            {"method": "POST", "path": "/api/v1/auth/register", "description": "User registration"},
            {"method": "GET", "path": "/api/v1/cart", "description": "Get cart items"},
            {"method": "POST", "path": "/api/v1/newsletter/subscribe", "description": "Subscribe to newsletter"},
        ],
    }
