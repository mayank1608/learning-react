import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCart, removeFromCart, updateCartItem } from '../services/api';
import './Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { navigate('/login'); return; }
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const data = await getCart();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId) => {
    await removeFromCart(itemId);
    setItems(items.filter(i => i.id !== itemId));
  };

  const handleUpdateQty = async (itemId, qty) => {
    if (qty < 1) return;
    try {
      await updateCartItem(itemId, qty);
      setItems(items.map(i => i.id === itemId ? { ...i, quantity: qty } : i));
    } catch (err) {
      console.error(err);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="cart-page">
      <nav className="cart-navbar">
        <Link to="/" className="cart-logo">ShopEY</Link>
        <div className="cart-nav-links">
          <Link to="/">Home</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/orders">Orders</Link>
        </div>
      </nav>

      <div className="cart-container">
        <h1>Shopping Cart ({items.length} items)</h1>

        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <Link to="/" className="btn-continue">Continue Shopping</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {items.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.product?.image_url} alt={item.product?.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <Link to={`/product/${item.product_id}`} className="cart-item-name">{item.product?.name}</Link>
                    <p className="cart-item-price">₹{item.product?.price.toFixed(2)}</p>
                  </div>
                  <div className="cart-item-qty">
                    <button onClick={() => handleUpdateQty(item.id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleUpdateQty(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <div className="cart-item-total">
                    ₹{((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </div>
                  <button className="cart-item-remove" onClick={() => handleRemove(item.id)}>✕</button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (18% GST)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <button className="btn-checkout" onClick={() => navigate('/checkout')}>
                Proceed to Checkout →
              </button>
              <Link to="/" className="link-continue">Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
