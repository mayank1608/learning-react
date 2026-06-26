import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCart, getAddresses, createAddress, validateCoupon, createOrder } from '../services/api';
import './Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [items, setItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    full_name: '', phone: '', street: '', city: '', state: '', zip_code: '', country: 'India'
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { navigate('/login'); return; }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cartData, addrData] = await Promise.all([getCart(), getAddresses()]);
      setItems(cartData);
      setAddresses(addrData);
      if (addrData.length > 0) setSelectedAddress(addrData[0].id);
      if (cartData.length === 0) navigate('/cart');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const tax = subtotal * 0.18;
  const discount = couponDiscount ? Math.min(subtotal * couponDiscount.discount_percent / 100, couponDiscount.max_discount || Infinity) : 0;
  const total = subtotal + tax - discount;

  const handleApplyCoupon = async () => {
    setCouponError('');
    try {
      const coupon = await validateCoupon(couponCode);
      setCouponDiscount(coupon);
    } catch (err) {
      setCouponError('Invalid or expired coupon');
      setCouponDiscount(null);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const addr = await createAddress(newAddress);
      setAddresses([...addresses, addr]);
      setSelectedAddress(addr.id);
      setShowAddressForm(false);
      setNewAddress({ full_name: '', phone: '', street: '', city: '', state: '', zip_code: '', country: 'India' });
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return;
    setPlacing(true);
    try {
      const order = await createOrder({
        address_id: selectedAddress,
        payment_method: paymentMethod,
        coupon_code: couponDiscount ? couponCode : null,
      });
      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="checkout-page">
      <nav className="checkout-navbar">
        <Link to="/" className="checkout-logo">ShopEY</Link>
        <span className="checkout-title">Secure Checkout</span>
      </nav>

      <div className="checkout-container">
        {/* Steps indicator */}
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}><span>1</span> Shipping</div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}><span>2</span> Payment</div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}><span>3</span> Review</div>
        </div>

        <div className="checkout-layout">
          <div className="checkout-main">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="checkout-section">
                <h2>Shipping Address</h2>
                {addresses.length > 0 && (
                  <div className="address-list">
                    {addresses.map(addr => (
                      <label key={addr.id} className={`address-card ${selectedAddress === addr.id ? 'selected' : ''}`}>
                        <input type="radio" name="address" checked={selectedAddress === addr.id} onChange={() => setSelectedAddress(addr.id)} />
                        <div>
                          <strong>{addr.full_name}</strong>
                          <p>{addr.street}, {addr.city}, {addr.state} {addr.zip_code}</p>
                          <p>{addr.phone}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                <button className="btn-add-address" onClick={() => setShowAddressForm(!showAddressForm)}>
                  + Add New Address
                </button>

                {showAddressForm && (
                  <form className="address-form" onSubmit={handleAddAddress}>
                    <div className="form-row">
                      <input placeholder="Full Name" value={newAddress.full_name} onChange={e => setNewAddress({...newAddress, full_name: e.target.value})} required />
                      <input placeholder="Phone" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} required />
                    </div>
                    <input placeholder="Street Address" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} required />
                    <div className="form-row">
                      <input placeholder="City" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} required />
                      <input placeholder="State" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} required />
                      <input placeholder="ZIP Code" value={newAddress.zip_code} onChange={e => setNewAddress({...newAddress, zip_code: e.target.value})} required />
                    </div>
                    <button type="submit" className="btn-save-address">Save Address</button>
                  </form>
                )}

                <button className="btn-next" onClick={() => setStep(2)} disabled={!selectedAddress}>
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="checkout-section">
                <h2>Payment Method</h2>
                <div className="payment-options">
                  {[
                    { id: 'card', label: '💳 Credit/Debit Card', desc: 'Visa, Mastercard, RuPay' },
                    { id: 'upi', label: '📱 UPI', desc: 'GPay, PhonePe, Paytm' },
                    { id: 'netbanking', label: '🏦 Net Banking', desc: 'All major banks' },
                  ].map(opt => (
                    <label key={opt.id} className={`payment-card ${paymentMethod === opt.id ? 'selected' : ''}`}>
                      <input type="radio" name="payment" value={opt.id} checked={paymentMethod === opt.id} onChange={() => setPaymentMethod(opt.id)} />
                      <div>
                        <strong>{opt.label}</strong>
                        <p>{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="coupon-section">
                  <h3>Have a coupon?</h3>
                  <div className="coupon-input">
                    <input placeholder="Enter coupon code" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} />
                    <button onClick={handleApplyCoupon}>Apply</button>
                  </div>
                  {couponError && <p className="coupon-error">{couponError}</p>}
                  {couponDiscount && <p className="coupon-success">✓ {couponDiscount.discount_percent}% off applied!</p>}
                </div>

                <div className="step-buttons">
                  <button className="btn-back" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn-next" onClick={() => setStep(3)}>Review Order →</button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="checkout-section">
                <h2>Review Order</h2>
                <div className="review-items">
                  {items.map(item => (
                    <div key={item.id} className="review-item">
                      <img src={item.product?.image_url} alt={item.product?.name} />
                      <div>
                        <p className="review-item-name">{item.product?.name}</p>
                        <p className="review-item-qty">Qty: {item.quantity}</p>
                      </div>
                      <span className="review-item-price">₹{((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="review-details">
                  <p><strong>Shipping:</strong> {addresses.find(a => a.id === selectedAddress)?.street}, {addresses.find(a => a.id === selectedAddress)?.city}</p>
                  <p><strong>Payment:</strong> {paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'upi' ? 'UPI' : 'Net Banking'}</p>
                </div>

                <div className="step-buttons">
                  <button className="btn-back" onClick={() => setStep(2)}>← Back</button>
                  <button className="btn-place-order" onClick={handlePlaceOrder} disabled={placing}>
                    {placing ? 'Placing Order...' : `Place Order — ₹${total.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="checkout-sidebar">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {items.map(item => (
                <div key={item.id} className="summary-item">
                  <span>{item.product?.name} × {item.quantity}</span>
                  <span>₹{((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summary-totals">
              <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="summary-row"><span>Tax (18%)</span><span>₹{tax.toFixed(2)}</span></div>
              {discount > 0 && <div className="summary-row discount"><span>Discount</span><span>-₹{discount.toFixed(2)}</span></div>}
              <div className="summary-row total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
