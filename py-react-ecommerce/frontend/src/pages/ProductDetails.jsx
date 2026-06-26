import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, getRelatedProducts, getReviews, addToCart, addToWishlist } from '../services/api';
import './ProductDetails.css';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const prod = await getProductById(id);
      setProduct(prod);
      const [rel, rev] = await Promise.all([
        getRelatedProducts(id),
        getReviews(id),
      ]);
      setRelated(rel);
      setReviews(rev);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) { navigate('/login'); return; }
    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) { navigate('/login'); return; }
    try {
      await addToWishlist(product.id);
      setMessage('Added to wishlist!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('Already in wishlist');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= Math.round(rating) ? 'filled' : ''}`}>★</span>
      );
    }
    return stars;
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  if (!product) return <div className="error-container"><h2>Product not found</h2><Link to="/">Go Home</Link></div>;

  return (
    <div className="product-details-page">
      <nav className="pd-navbar">
        <Link to="/" className="pd-logo">ShopEY</Link>
        <div className="pd-nav-links">
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/orders">Orders</Link>
        </div>
      </nav>

      <div className="pd-breadcrumb">
        <Link to="/">Home</Link> / <Link to="/">Products</Link> / <span>{product.name}</span>
      </div>

      {message && <div className="pd-toast">{message}</div>}

      <div className="pd-content">
        <div className="pd-gallery">
          <div className="pd-main-image">
            <img src={product.image_url} alt={product.name} />
          </div>
          <div className="pd-thumbnails">
            {[1, 2, 3, 4].map(i => (
              <img key={i} src={`${product.image_url}&v=${i}`} alt={`View ${i}`} />
            ))}
          </div>
        </div>

        <div className="pd-info">
          <span className="pd-category">{product.category_name}</span>
          <h1 className="pd-title">{product.name}</h1>

          <div className="pd-rating">
            {renderStars(product.rating)}
            <span className="pd-rating-text">{product.rating} ({product.review_count} reviews)</span>
          </div>

          <div className="pd-price">₹{product.price.toFixed(2)}</div>

          <p className="pd-description">{product.description}</p>

          <div className="pd-stock">
            <span className="stock-badge in-stock">✓ In Stock</span>
          </div>

          <div className="pd-quantity">
            <label>Quantity:</label>
            <div className="qty-controls">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(Math.min(10, quantity + 1))}>+</button>
            </div>
          </div>

          <div className="pd-actions">
            <button className="btn-add-cart" onClick={handleAddToCart} disabled={addingToCart}>
              {addingToCart ? 'Adding...' : '🛒 Add to Cart'}
            </button>
            <button className="btn-wishlist" onClick={handleAddToWishlist}>
              ❤️ Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="pd-reviews">
        <h2>Customer Reviews ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="review-stars">{renderStars(review.rating)}</div>
                  <span className="review-date">{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="pd-related">
          <h2>Related Products</h2>
          <div className="related-grid">
            {related.map(item => (
              <Link to={`/product/${item.id}`} key={item.id} className="related-card">
                <img src={item.image_url} alt={item.name} />
                <h3>{item.name}</h3>
                <p className="related-price">₹{item.price.toFixed(2)}</p>
                <div className="related-rating">{renderStars(item.rating)}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
