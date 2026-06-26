import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getOrderById } from '../services/api';
import './OrderConfirmation.css';

export default function OrderConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { navigate('/login'); return; }
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const data = await getOrderById(id);
      setOrder(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  if (!order) return <div className="error-container"><h2>Order not found</h2></div>;

  return (
    <div className="confirmation-page">
      <nav className="conf-navbar">
        <Link to="/" className="conf-logo">ShopEY</Link>
      </nav>

      <div className="conf-container">
        <div className="conf-success">
          <div className="success-icon">✓</div>
          <h1>Order Placed Successfully!</h1>
          <p className="conf-order-id">Order #{order.id}</p>
        </div>

        <div className="conf-details">
          <div className="conf-card">
            <h3>Order Summary</h3>
            <div className="conf-items">
              {order.items?.map(item => (
                <div key={item.id} className="conf-item">
                  <img src={item.product_image} alt={item.product_name} />
                  <div>
                    <p className="conf-item-name">{item.product_name}</p>
                    <p className="conf-item-qty">Qty: {item.quantity}</p>
                  </div>
                  <span className="conf-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="conf-totals">
              <div className="conf-row"><span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span></div>
              <div className="conf-row"><span>Tax</span><span>₹{order.tax.toFixed(2)}</span></div>
              {order.discount > 0 && <div className="conf-row discount"><span>Discount</span><span>-₹{order.discount.toFixed(2)}</span></div>}
              <div className="conf-row total"><span>Total Paid</span><span>₹{order.total.toFixed(2)}</span></div>
            </div>
          </div>

          <div className="conf-card">
            <h3>Delivery Details</h3>
            <p className="conf-delivery-date">📦 Estimated Delivery: <strong>{order.estimated_delivery}</strong></p>
            <p className="conf-payment">💳 Payment: {order.payment_method === 'card' ? 'Credit/Debit Card' : order.payment_method === 'upi' ? 'UPI' : 'Net Banking'}</p>
            <p className="conf-status">Status: <span className="status-badge">{order.status}</span></p>
          </div>
        </div>

        <div className="conf-actions">
          <Link to="/orders" className="btn-view-orders">View All Orders</Link>
          <Link to="/" className="btn-continue-shopping">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
