import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, getCategories, getCart, addToCart, subscribeNewsletter, getHeroBanners } from '../services/api';
import './Home.css';

function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [heroBanner, setHeroBanner] = useState(null);
  const [loadingHero, setLoadingHero] = useState(true);
  const [toast, setToast] = useState(null);
  const trendingRef = useRef(null);
  const observerRef = useRef(null);
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));
  const [userName, setUserName] = useState(localStorage.getItem('user_name') || '');

  const handleSignOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_name');
    setIsLoggedIn(false);
    setUserName('');
    setCartItems([]);
    showToast('Signed out successfully');
  };

  // Scroll listener for navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observer for fade-in animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.fade-in-section');
    elements.forEach((el) => observerRef.current.observe(el));

    return () => observerRef.current?.disconnect();
  }, [featuredProducts, trendingProducts, categories]);

  // Fetch hero banner
  useEffect(() => {
    getHeroBanners()
      .then((banners) => {
        const active = banners.find((b) => b.is_active);
        if (active) setHeroBanner(active);
      })
      .catch(() => {})
      .finally(() => setLoadingHero(false));
  }, []);

  // Fetch data
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoadingCategories(false));

    getProducts({ featured: true, limit: 8 })
      .then(setFeaturedProducts)
      .catch(() => {})
      .finally(() => setLoadingFeatured(false));

    getProducts({ trending: true, limit: 10 })
      .then(setTrendingProducts)
      .catch(() => {})
      .finally(() => setLoadingTrending(false));

    if (isLoggedIn) {
      getCart().then(setCartItems).catch(() => {});
    }
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleAddToCart = async (product) => {
    if (!isLoggedIn) {
      showToast('Please log in to add items to cart', 'error');
      return;
    }
    try {
      await addToCart(product.id, 1);
      const updatedCart = await getCart();
      setCartItems(updatedCart);
      showToast(`${product.name} added to cart!`);
    } catch {
      showToast('Failed to add item to cart', 'error');
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !/\S+@\S+\.\S+/.test(newsletterEmail)) {
      setNewsletterStatus({ type: 'error', message: 'Please enter a valid email address' });
      return;
    }
    try {
      await subscribeNewsletter(newsletterEmail);
      setNewsletterStatus({ type: 'success', message: 'Thanks for subscribing! 🎉' });
      setNewsletterEmail('');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Subscription failed. Try again.';
      setNewsletterStatus({ type: 'error', message: msg });
    }
  };

  const scrollTrending = (direction) => {
    if (trendingRef.current) {
      const scrollAmount = 320;
      trendingRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const cartTotal = cartItems.reduce?.((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0) || 0;
  const cartCount = cartItems.reduce?.((sum, item) => sum + (item.quantity || 1), 0) || 0;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= Math.round(rating || 0) ? 'filled' : ''}`}>
          {i <= Math.round(rating || 0) ? '★' : '☆'}
        </span>
      );
    }
    return stars;
  };

  const ProductCard = ({ product, badge }) => (
    <div className="product-card">
      <div className="product-image-wrapper">
        {badge && <span className="product-badge">{badge}</span>}
        <img
          src={product.image_url || `https://placehold.co/300x300/F6F6FA/2E2E38?text=${encodeURIComponent(product.name?.substring(0, 10) || 'Product')}`}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">{renderStars(product.average_rating)}</div>
        <div className="product-price-row">
          <span className="product-price">${(product.price || 0).toFixed(2)}</span>
          <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>
            <span className="cart-icon">🛒</span> Add
          </button>
        </div>
      </div>
    </div>
  );

  const SkeletonCard = () => (
    <div className="product-card skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-info">
        <div className="skeleton-line wide"></div>
        <div className="skeleton-line medium"></div>
        <div className="skeleton-line short"></div>
      </div>
    </div>
  );

  return (
    <div className="home-page">
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <span className="logo-diamond">◆</span>
            <span className="logo-name">ShopEY</span>
          </Link>

          <div className="nav-links">
            <a href="#hero">Home</a>
            <a href="#featured">Shop</a>
            <a href="#categories">Categories</a>
            <a href="#trust">About</a>
            <a href="#footer">Contact</a>
            <Link to="/sitemap">Sitemap</Link>
          </div>

          <div className="nav-actions">
            <div className={`search-container ${searchOpen ? 'open' : ''}`}>
              <button className="icon-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
                🔍
              </button>
              {searchOpen && (
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              )}
            </div>

            <button className="icon-btn cart-btn" onClick={() => setCartOpen(true)} aria-label="Cart">
              🛒
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {isLoggedIn ? (
              <div className="user-menu">
                <span className="user-greeting">Hi, {userName || 'User'}</span>
                <button className="sign-out-btn" onClick={handleSignOut}>Sign Out</button>
              </div>
            ) : (
              <Link to="/login" className="icon-btn user-btn" aria-label="Login">
                👤
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Banner Section */}
      <section className="hero-banner" id="hero">
        <div className="hero-banner-overlay"></div>
        <div className="hero-banner-container">
          <div className="hero-banner-text">
            <span className="hero-banner-badge">New Collection 2026</span>
            {loadingHero ? (
              <h1 className="hero-banner-title">Loading...</h1>
            ) : (
              <>
                <h1 className="hero-banner-title">
                  {heroBanner ? heroBanner.title : 'Elevate Your Style'}<br />
                  <span className="hero-banner-highlight">{heroBanner ? heroBanner.subtitle : 'Shop the Latest'}</span>
                </h1>
                <p className="hero-banner-subtitle">
                  {heroBanner?.subtitle || 'Discover premium quality products curated for the modern lifestyle. Unbeatable prices, free shipping on orders over $50.'}
                </p>
                <div className="hero-banner-cta">
                  <a href={heroBanner?.cta_link || '#featured'} className="btn btn-primary btn-lg">
                    {heroBanner?.cta_text || 'Shop Now'} <span className="cta-arrow">→</span>
                  </a>
                  <a href="#categories" className="btn btn-outline btn-lg">Explore Categories</a>
                </div>
              </>
            )}
            <div className="hero-banner-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">500+</span>
                <span className="hero-stat-label">Products</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">50k+</span>
                <span className="hero-stat-label">Happy Customers</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">4.9★</span>
                <span className="hero-stat-label">Rating</span>
              </div>
            </div>
          </div>
          <div className="hero-banner-image">
            <div className="hero-image-wrapper">
              <img 
                src={heroBanner?.image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1000&fit=crop'} 
                alt={heroBanner?.title || 'Hero banner showcasing premium fashion collection'} 
                className="hero-img"
              />
              <div className="hero-image-accent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section categories-section fade-in-section" id="categories">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Browse Categories</h2>
            <div className="section-line"></div>
          </div>
          <div className="categories-row">
            {loadingCategories
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="category-card skeleton">
                    <div className="skeleton-circle"></div>
                    <div className="skeleton-line short"></div>
                  </div>
                ))
              : categories.map((cat) => (
                  <div key={cat.id} className="category-card">
                    <div className="category-icon">
                      {cat.icon || '📦'}
                    </div>
                    <span className="category-name">{cat.name}</span>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section featured-section fade-in-section" id="featured">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <a href="#featured" className="view-all-link">View All →</a>
          </div>
          <div className="products-grid">
            {loadingFeatured
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} badge="Featured" />
                ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="promo-banner fade-in-section">
        <div className="promo-decoration">
          <div className="promo-circle pc-1"></div>
          <div className="promo-circle pc-2"></div>
          <div className="promo-circle pc-3"></div>
        </div>
        <div className="promo-content">
          <span className="promo-tag">Limited Time Offer</span>
          <h2 className="promo-title">Up to 50% Off</h2>
          <p className="promo-subtitle">Don't miss out on our biggest sale of the season</p>
          <a href="#featured" className="btn btn-primary">Shop Deals</a>
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="section trending-section fade-in-section" id="trending">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Trending Now 🔥</h2>
            <div className="carousel-controls">
              <button className="carousel-btn" onClick={() => scrollTrending('left')} aria-label="Scroll left">←</button>
              <button className="carousel-btn" onClick={() => scrollTrending('right')} aria-label="Scroll right">→</button>
            </div>
          </div>
          <div className="trending-carousel" ref={trendingRef}>
            {loadingTrending
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
              : trendingProducts.map((product) => (
                  <ProductCard key={product.id} product={product} badge="Trending" />
                ))}
          </div>
        </div>
      </section>

      {/* Customer Trust Section */}
      <section className="section trust-section fade-in-section" id="trust">
        <div className="section-container">
          <div className="trust-badges">
            <div className="trust-badge">
              <span className="trust-icon">🔒</span>
              <h3>Secure Payment</h3>
              <p>256-bit SSL encryption</p>
            </div>
            <div className="trust-badge">
              <span className="trust-icon">🔄</span>
              <h3>Easy Returns</h3>
              <p>30-day money back guarantee</p>
            </div>
            <div className="trust-badge">
              <span className="trust-icon">🚚</span>
              <h3>Free Shipping</h3>
              <p>On orders over $50</p>
            </div>
          </div>

          <div className="testimonials">
            <h2 className="section-title">What Our Customers Say</h2>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-stars">{renderStars(5)}</div>
                <p className="testimonial-quote">"Absolutely love the quality! Fast shipping and the products exceeded my expectations. Will definitely shop again."</p>
                <div className="testimonial-author">
                  <div className="author-avatar">SM</div>
                  <div>
                    <span className="author-name">Sarah Mitchell</span>
                    <span className="author-title">Verified Buyer</span>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-stars">{renderStars(5)}</div>
                <p className="testimonial-quote">"Best online shopping experience I've had. The customer service team was incredibly helpful and responsive."</p>
                <div className="testimonial-author">
                  <div className="author-avatar">JD</div>
                  <div>
                    <span className="author-name">James Davis</span>
                    <span className="author-title">Verified Buyer</span>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-stars">{renderStars(4)}</div>
                <p className="testimonial-quote">"Great selection of products at competitive prices. The easy returns policy gives me confidence to try new items."</p>
                <div className="testimonial-author">
                  <div className="author-avatar">AL</div>
                  <div>
                    <span className="author-name">Amanda Lee</span>
                    <span className="author-title">Verified Buyer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section fade-in-section" id="newsletter">
        <div className="newsletter-container">
          <h2 className="newsletter-title">Stay in the Loop</h2>
          <p className="newsletter-subtitle">Subscribe for exclusive deals and updates</p>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              className="newsletter-input"
              placeholder="Enter your email address"
              value={newsletterEmail}
              onChange={(e) => { setNewsletterEmail(e.target.value); setNewsletterStatus(null); }}
            />
            <button type="submit" className="btn btn-primary newsletter-btn">Subscribe</button>
          </form>
          {newsletterStatus && (
            <p className={`newsletter-feedback ${newsletterStatus.type}`}>{newsletterStatus.message}</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-brand">
                <span className="logo-diamond">◆</span>
                <span className="logo-name">ShopEY</span>
              </div>
              <p className="footer-desc">Your premium destination for quality products and exceptional shopping experiences.</p>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#trust">About Us</a></li>
                <li><a href="#footer">Careers</a></li>
                <li><a href="#footer">Press</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <ul>
                <li><a href="#footer">FAQ</a></li>
                <li><a href="#footer">Contact</a></li>
                <li><a href="#footer">Shipping</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <ul>
                <li><a href="#footer">Privacy Policy</a></li>
                <li><a href="#footer">Terms of Service</a></li>
                <li><a href="#footer">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 ShopEY. All rights reserved.</p>
            <div className="payment-methods">
              <span className="payment-icon">VISA</span>
              <span className="payment-icon">MC</span>
              <span className="payment-icon">PayPal</span>
              <span className="payment-icon">Amex</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <div className={`cart-overlay ${cartOpen ? 'open' : ''}`} onClick={() => setCartOpen(false)}></div>
      <aside className={`cart-sidebar ${cartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Your Cart ({cartCount})</h3>
          <button className="cart-close" onClick={() => setCartOpen(false)}>✕</button>
        </div>
        <div className="cart-body">
          {!isLoggedIn ? (
            <div className="cart-empty">
              <p>Please <Link to="/login">log in</Link> to view your cart</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="cart-empty">
              <span className="cart-empty-icon">🛒</span>
              <p>Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <span className="cart-item-name">{item.product_name || item.name || 'Product'}</span>
                  <span className="cart-item-qty">Qty: {item.quantity}</span>
                </div>
                <span className="cart-item-price">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
              </div>
            ))
          )}
        </div>
        {isLoggedIn && cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span className="cart-total-price">${cartTotal.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary cart-checkout-btn">Checkout</button>
          </div>
        )}
      </aside>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          <span>{toast.type === 'success' ? '✓' : '✕'}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default Home;
