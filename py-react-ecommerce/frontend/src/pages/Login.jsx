import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api';
import './Login.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState({});
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [regErrors, setRegErrors] = useState({});
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { level: 1, label: 'Weak', color: '#ef4444' };
    if (score <= 3) return { level: 2, label: 'Medium', color: '#f59e0b' };
    return { level: 3, label: 'Strong', color: '#22c55e' };
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const validateLogin = () => {
    const errors = {};
    if (!loginEmail.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(loginEmail)) errors.email = 'Invalid email format';
    if (!loginPassword) errors.password = 'Password is required';
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegister = () => {
    const errors = {};
    if (!firstName.trim()) errors.firstName = 'First name is required';
    if (!lastName.trim()) errors.lastName = 'Last name is required';
    if (!regEmail.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(regEmail)) errors.email = 'Invalid email format';
    if (!regPassword) {
      errors.password = 'Password is required';
    } else if (regPassword.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/.test(regPassword)) {
      errors.password = 'Must include uppercase, lowercase, number, and special character';
    }
    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (regPassword !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setRegErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setLoading(true);
    try {
      const data = await loginUser({ email: loginEmail, password: loginPassword });
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user_name', data.user.first_name);
      showToast(`Welcome back, ${data.user.first_name}!`);
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid email or password';
      setLoginErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;
    setLoading(true);
    try {
      await registerUser({
        first_name: firstName,
        last_name: lastName,
        email: regEmail,
        password: regPassword,
      });
      showToast('Account created successfully! Please log in.');
      setIsLogin(true);
      setRegEmail('');
      setRegPassword('');
      setConfirmPassword('');
      setFirstName('');
      setLastName('');
      setRegErrors({});
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (err.response?.status === 409) {
        setRegErrors({ email: detail || 'Email already registered' });
      } else if (err.response?.status === 422) {
        setRegErrors({ general: 'Please check all fields and try again' });
      } else {
        showToast(detail || 'Something went wrong. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(regPassword);

  return (
    <div className="login-container">
      {/* Left branding panel */}
      <div className="branding-panel">
        <div className="branding-content">
          <div className="brand-logo">
            <span className="logo-icon">◆</span>
            <span className="logo-text">ShopEY</span>
          </div>
          <h1 className="brand-headline">
            Welcome to the<br />
            <span className="highlight">Future of Shopping</span>
          </h1>
          <p className="brand-subtitle">
            Discover premium products, seamless checkout, and an experience crafted for you.
          </p>
          <div className="brand-illustration">
            <div className="floating-card card-1">
              <span>🛍️</span>
              <span>Premium Collection</span>
            </div>
            <div className="floating-card card-2">
              <span>⚡</span>
              <span>Fast Delivery</span>
            </div>
            <div className="floating-card card-3">
              <span>🔒</span>
              <span>Secure Payments</span>
            </div>
          </div>
        </div>
        <div className="branding-footer">
          <p>Trusted by 10,000+ customers worldwide</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="form-panel">
        <div className={`form-card ${isLogin ? 'login-mode' : 'register-mode'}`}>
          <div className="form-header">
            <h2>{isLogin ? 'Sign in to your account' : 'Create your account'}</h2>
            <p className="form-subtitle">
              {isLogin
                ? 'Enter your credentials to access your account'
                : 'Join thousands of happy shoppers today'}
            </p>
          </div>

          {/* Login Form */}
          {isLogin && (
            <form className="form animate-in" onSubmit={handleLogin}>
              {loginErrors.general && (
                <div className="error-banner">{loginErrors.general}</div>
              )}

              <div className="input-group">
                <label htmlFor="login-email">Email</label>
                <div className={`input-wrapper ${loginErrors.email ? 'has-error' : ''}`}>
                  <span className="input-icon">✉</span>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => { setLoginEmail(e.target.value); setLoginErrors({}); }}
                    autoComplete="email"
                  />
                </div>
                {loginErrors.email && <span className="field-error">{loginErrors.email}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="login-password">Password</label>
                <div className={`input-wrapper ${loginErrors.password ? 'has-error' : ''}`}>
                  <span className="input-icon">🔒</span>
                  <input
                    id="login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => { setLoginPassword(e.target.value); setLoginErrors({}); }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="eye-toggle"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showLoginPassword ? '🙈' : '👁'}
                  </button>
                </div>
                {loginErrors.password && <span className="field-error">{loginErrors.password}</span>}
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <span className="spinner"></span> : 'Sign In'}
              </button>

              <p className="switch-text">
                Don't have an account?{' '}
                <button type="button" className="switch-link" onClick={() => { setIsLogin(false); setLoginErrors({}); }}>
                  Sign up
                </button>
              </p>
            </form>
          )}

          {/* Register Form */}
          {!isLogin && (
            <form className="form animate-in" onSubmit={handleRegister}>
              {regErrors.general && (
                <div className="error-banner">{regErrors.general}</div>
              )}

              <div className="name-row">
                <div className="input-group">
                  <label htmlFor="reg-first">First Name</label>
                  <div className={`input-wrapper ${regErrors.firstName ? 'has-error' : ''}`}>
                    <span className="input-icon">👤</span>
                    <input
                      id="reg-first"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => { setFirstName(e.target.value); setRegErrors((prev) => ({ ...prev, firstName: '' })); }}
                    />
                  </div>
                  {regErrors.firstName && <span className="field-error">{regErrors.firstName}</span>}
                </div>
                <div className="input-group">
                  <label htmlFor="reg-last">Last Name</label>
                  <div className={`input-wrapper ${regErrors.lastName ? 'has-error' : ''}`}>
                    <span className="input-icon">👤</span>
                    <input
                      id="reg-last"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => { setLastName(e.target.value); setRegErrors((prev) => ({ ...prev, lastName: '' })); }}
                    />
                  </div>
                  {regErrors.lastName && <span className="field-error">{regErrors.lastName}</span>}
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="reg-email">Email</label>
                <div className={`input-wrapper ${regErrors.email ? 'has-error' : ''}`}>
                  <span className="input-icon">✉</span>
                  <input
                    id="reg-email"
                    type="email"
                    placeholder="you@example.com"
                    value={regEmail}
                    onChange={(e) => { setRegEmail(e.target.value); setRegErrors((prev) => ({ ...prev, email: '' })); }}
                    autoComplete="email"
                  />
                </div>
                {regErrors.email && <span className="field-error">{regErrors.email}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="reg-password">Password</label>
                <div className={`input-wrapper ${regErrors.password ? 'has-error' : ''}`}>
                  <span className="input-icon">🔒</span>
                  <input
                    id="reg-password"
                    type={showRegPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={regPassword}
                    onChange={(e) => { setRegPassword(e.target.value); setRegErrors((prev) => ({ ...prev, password: '' })); }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="eye-toggle"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showRegPassword ? '🙈' : '👁'}
                  </button>
                </div>
                {regErrors.password && <span className="field-error">{regErrors.password}</span>}
                {regPassword && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div
                        className="strength-fill"
                        style={{
                          width: `${(passwordStrength.level / 3) * 100}%`,
                          backgroundColor: passwordStrength.color,
                        }}
                      ></div>
                    </div>
                    <span className="strength-label" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="reg-confirm">Confirm Password</label>
                <div className={`input-wrapper ${regErrors.confirmPassword ? 'has-error' : ''}`}>
                  <span className="input-icon">🔒</span>
                  <input
                    id="reg-confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setRegErrors((prev) => ({ ...prev, confirmPassword: '' })); }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="eye-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showConfirmPassword ? '🙈' : '👁'}
                  </button>
                </div>
                {regErrors.confirmPassword && <span className="field-error">{regErrors.confirmPassword}</span>}
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <span className="spinner"></span> : 'Create Account'}
              </button>

              <p className="switch-text">
                Already have an account?{' '}
                <button type="button" className="switch-link" onClick={() => { setIsLogin(true); setRegErrors({}); }}>
                  Log in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span className="toast-icon">{toast.type === 'success' ? '✓' : '✕'}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default Login;
