import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const response = await api.post('/cart', { product_id: productId, quantity });
  return response.data;
};

export const removeFromCart = async (itemId) => {
  const response = await api.delete(`/cart/${itemId}`);
  return response.data;
};

export const getReviews = async (productId) => {
  const response = await api.get('/reviews', { params: { product_id: productId } });
  return response.data;
};

export const subscribeNewsletter = async (email) => {
  const response = await api.post('/newsletter/subscribe', { email });
  return response.data;
};

export const getHeroBanners = async () => {
  const response = await api.get('/hero-banner');
  return response.data;
};

export const getSitemap = async () => {
  const response = await api.get('/sitemap');
  return response.data;
};

// Product Details
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getRelatedProducts = async (id) => {
  const response = await api.get(`/products/${id}/related`);
  return response.data;
};

// Cart - update quantity
export const updateCartItem = async (itemId, quantity) => {
  const response = await api.put(`/cart/${itemId}`, { quantity });
  return response.data;
};

// Reviews - create
export const createReview = async (data) => {
  const response = await api.post('/reviews', data);
  return response.data;
};

// Profile
export const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put('/profile', data);
  return response.data;
};

export const changePassword = async (data) => {
  const response = await api.post('/profile/change-password', data);
  return response.data;
};

// Addresses
export const getAddresses = async () => {
  const response = await api.get('/profile/addresses');
  return response.data;
};

export const createAddress = async (data) => {
  const response = await api.post('/profile/addresses', data);
  return response.data;
};

export const updateAddress = async (id, data) => {
  const response = await api.put(`/profile/addresses/${id}`, data);
  return response.data;
};

export const deleteAddress = async (id) => {
  const response = await api.delete(`/profile/addresses/${id}`);
  return response.data;
};

// Orders
export const createOrder = async (data) => {
  const response = await api.post('/orders', data);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

// Wishlist
export const getWishlist = async () => {
  const response = await api.get('/wishlist');
  return response.data;
};

export const addToWishlist = async (productId) => {
  const response = await api.post('/wishlist', { product_id: productId });
  return response.data;
};

export const removeFromWishlist = async (id) => {
  const response = await api.delete(`/wishlist/${id}`);
  return response.data;
};

export const moveWishlistToCart = async (id) => {
  const response = await api.post(`/wishlist/${id}/move-to-cart`);
  return response.data;
};

// Coupons
export const validateCoupon = async (code, orderTotal) => {
  const response = await api.post('/coupons/validate', { code, order_total: orderTotal });
  return response.data;
};

// Offers
export const getOffers = async (categoryId = null) => {
  const params = categoryId ? { category_id: categoryId } : {};
  const response = await api.get('/offers', { params });
  return response.data;
};

// Support
export const getFaqs = async () => {
  const response = await api.get('/support/faqs');
  return response.data;
};

export const createSupportTicket = async (data) => {
  const response = await api.post('/support/tickets', data);
  return response.data;
};

export default api;
