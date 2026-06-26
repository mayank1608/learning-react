import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOffers, getCategories } from '../services/api';
import './Offers.css';

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadOffers();
  }, [selectedCategory]);

  const loadData = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (err) {
      console.error(err);
    }
  };

  const loadOffers = async () => {
    setLoading(true);
    try {
      const data = await getOffers(selectedCategory);
      setOffers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="offers-page">
      <nav className="offers-navbar">
        <Link to="/" className="offers-logo">ShopEY</Link>
        <div className="offers-nav-links">
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/orders">Orders</Link>
        </div>
      </nav>

      <div className="offers-hero">
        <h1>🔥 Deals & Offers</h1>
        <p>Grab the best discounts before they expire!</p>
      </div>

      <div className="offers-container">
        {/* Category filter */}
        <div className="offers-filter">
          <button className={`filter-btn ${!selectedCategory ? 'active' : ''}`} onClick={() => setSelectedCategory(null)}>All</button>
          {categories.map(cat => (
            <button key={cat.id} className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}>
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-container"><div className="spinner"></div></div>
        ) : offers.length === 0 ? (
          <div className="offers-empty">
            <h2>No active offers right now</h2>
            <p>Check back soon for amazing deals!</p>
          </div>
        ) : (
          <div className="offers-grid">
            {offers.map(offer => (
              <div key={offer.id} className="offer-card">
                <div className="offer-badge">{offer.discount_percent}% OFF</div>
                <img src={offer.image_url} alt={offer.title} className="offer-image" />
                <div className="offer-info">
                  <h3>{offer.title}</h3>
                  <p>{offer.description}</p>
                  <Link to={`/?category_id=${offer.category_id}`} className="offer-cta">Shop Now →</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Coupon codes section */}
        <section className="coupon-showcase">
          <h2>Available Coupons</h2>
          <div className="coupon-grid">
            <div className="coupon-card">
              <div className="coupon-percent">10%</div>
              <div>
                <p className="coupon-code">WELCOME10</p>
                <p className="coupon-desc">For orders above ₹500</p>
              </div>
            </div>
            <div className="coupon-card">
              <div className="coupon-percent">20%</div>
              <div>
                <p className="coupon-code">SAVE20</p>
                <p className="coupon-desc">For orders above ₹1000</p>
              </div>
            </div>
            <div className="coupon-card">
              <div className="coupon-percent">5%</div>
              <div>
                <p className="coupon-code">FLAT50</p>
                <p className="coupon-desc">For orders above ₹200</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
