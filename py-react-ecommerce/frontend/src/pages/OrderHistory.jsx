import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getOrders } from '../services/api';
import './OrderHistory.css';

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { navigate('/login'); return; }
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="orders-page">
      <nav className="orders-navbar">
        <Link to="/" className="orders-logo">ShopEY</Link>
        <div className="orders-nav-links">
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/profile">Profile</Link>
        </div>
      </nav>

      <div className="orders-container">
        <h1>Order History</h1>

        {orders.length === 0 ? (
          <div className="orders-empty">
            <div className="empty-icon">📦</div>
            <h2>No orders yet</h2>
            <p>Start shopping to see your orders here!</p>
            <Link to="/" className="btn-shop">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <span className="order-id">Order #{order.id}</span>
                    <span className="order-date">{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                  <span className={`order-status ${getStatusColor(order.status)}`}>{order.status}</span>
                </div>

                <div className="order-items">
                  {order.items?.slice(0, 3).map(item => (
                    <div key={item.id} className="order-item">
                      <img src={item.product_image} alt={item.product_name} />
                      <div>
                        <p className="order-item-name">{item.product_name}</p>
                        <p className="order-item-details">Qty: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  {order.items?.length > 3 && <p className="more-items">+{order.items.length - 3} more items</p>}
                </div>

                <div className="order-footer">
                  <span className="order-total">Total: ₹{order.total.toFixed(2)}</span>
                  {order.estimated_delivery && (
                    <span className="order-delivery">Est. Delivery: {order.estimated_delivery}</span>
                  )}
                </div>

                {/* Status tracker */}
                <div className="status-tracker">
                  {['pending', 'confirmed', 'shipped', 'delivered'].map((s, i) => (
                    <div key={s} className={`tracker-step ${['pending', 'confirmed', 'shipped', 'delivered'].indexOf(order.status) >= i ? 'completed' : ''}`}>
                      <div className="tracker-dot"></div>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
