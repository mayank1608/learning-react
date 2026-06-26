import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getWishlist, removeFromWishlist, moveWishlistToCart } from '../services/api';
import './Wishlist.css';

export default function Wishlist() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { navigate('/login'); return; }
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const data = await getWishlist();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeFromWishlist(id);
      setItems(items.filter(i => i.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveToCart = async (id) => {
    try {
      await moveWishlistToCart(id);
      setItems(items.filter(i => i.id !== id));
      setMessage('Moved to cart!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="wishlist-page">
      <nav className="wishlist-navbar">
        <Link to="/" className="wishlist-logo">ShopEY</Link>
        <div className="wishlist-nav-links">
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/orders">Orders</Link>
        </div>
      </nav>

      {message && <div className="wishlist-toast">{message}</div>}

      <div className="wishlist-container">
        <h1>My Wishlist ({items.length})</h1>

        {items.length === 0 ? (
          <div className="wishlist-empty">
            <div className="empty-icon">❤️</div>
            <h2>Your wishlist is empty</h2>
            <p>Save items you love for later!</p>
            <Link to="/" className="btn-browse">Browse Products</Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {items.map(item => (
              <div key={item.id} className="wishlist-card">
                <button className="wishlist-remove" onClick={() => handleRemove(item.id)}>✕</button>
                <Link to={`/product/${item.product_id}`}>
                  <img src={item.product?.image_url} alt={item.product?.name} />
                </Link>
                <div className="wishlist-card-info">
                  <Link to={`/product/${item.product_id}`} className="wishlist-card-name">{item.product?.name}</Link>
                  <p className="wishlist-card-price">₹{item.product?.price.toFixed(2)}</p>
                  <div className="wishlist-card-rating">
                    {'★'.repeat(Math.round(item.product?.rating || 0))}{'☆'.repeat(5 - Math.round(item.product?.rating || 0))}
                  </div>
                </div>
                <button className="btn-move-cart" onClick={() => handleMoveToCart(item.id)}>
                  🛒 Move to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
