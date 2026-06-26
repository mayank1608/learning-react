import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProfile, updateProfile, changePassword, getAddresses, createAddress, deleteAddress } from '../services/api';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ full_name: '', phone: '', street: '', city: '', state: '', zip_code: '', country: 'India' });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { navigate('/login'); return; }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [prof, addr] = await Promise.all([getProfile(), getAddresses()]);
      setProfile(prof);
      setEditData({ first_name: prof.first_name, last_name: prof.last_name, phone: prof.phone || '' });
      setAddresses(addr);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const updated = await updateProfile(editData);
      setProfile(updated);
      setEditing(false);
      showMsg('Profile updated successfully!');
    } catch (err) {
      showMsg('Failed to update profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await changePassword(passwordData);
      setShowPasswordForm(false);
      setPasswordData({ current_password: '', new_password: '' });
      showMsg('Password changed successfully!');
    } catch (err) {
      showMsg(err.response?.data?.detail || 'Failed to change password');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const addr = await createAddress(newAddress);
      setAddresses([...addresses, addr]);
      setShowAddressForm(false);
      setNewAddress({ full_name: '', phone: '', street: '', city: '', state: '', zip_code: '', country: 'India' });
      showMsg('Address added!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await deleteAddress(id);
      setAddresses(addresses.filter(a => a.id !== id));
      showMsg('Address removed');
    } catch (err) {
      console.error(err);
    }
  };

  const showMsg = (text) => { setMessage(text); setTimeout(() => setMessage(''), 3000); };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="profile-page">
      <nav className="profile-navbar">
        <Link to="/" className="profile-logo">ShopEY</Link>
        <div className="profile-nav-links">
          <Link to="/">Home</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/wishlist">Wishlist</Link>
        </div>
      </nav>

      {message && <div className="profile-toast">{message}</div>}

      <div className="profile-container">
        <h1>My Profile</h1>

        {/* Profile Info */}
        <div className="profile-card">
          <div className="profile-avatar">{profile?.first_name?.[0]}{profile?.last_name?.[0]}</div>
          <div className="profile-info">
            {editing ? (
              <div className="profile-edit-form">
                <div className="form-row">
                  <input value={editData.first_name} onChange={e => setEditData({...editData, first_name: e.target.value})} placeholder="First Name" />
                  <input value={editData.last_name} onChange={e => setEditData({...editData, last_name: e.target.value})} placeholder="Last Name" />
                </div>
                <input value={editData.phone || ''} onChange={e => setEditData({...editData, phone: e.target.value})} placeholder="Phone" />
                <div className="edit-actions">
                  <button className="btn-save" onClick={handleSave}>Save</button>
                  <button className="btn-cancel" onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h2>{profile?.first_name} {profile?.last_name}</h2>
                <p className="profile-email">{profile?.email}</p>
                {profile?.phone && <p className="profile-phone">📱 {profile.phone}</p>}
                <p className="profile-since">Member since {new Date(profile?.created_at).toLocaleDateString()}</p>
                <button className="btn-edit" onClick={() => setEditing(true)}>Edit Profile</button>
              </>
            )}
          </div>
        </div>

        {/* Change Password */}
        <div className="profile-section">
          <h3>Security</h3>
          {!showPasswordForm ? (
            <button className="btn-change-pw" onClick={() => setShowPasswordForm(true)}>Change Password</button>
          ) : (
            <form className="password-form" onSubmit={handlePasswordChange}>
              <input type="password" placeholder="Current Password" value={passwordData.current_password}
                onChange={e => setPasswordData({...passwordData, current_password: e.target.value})} required />
              <input type="password" placeholder="New Password" value={passwordData.new_password}
                onChange={e => setPasswordData({...passwordData, new_password: e.target.value})} required />
              <div className="edit-actions">
                <button type="submit" className="btn-save">Update Password</button>
                <button type="button" className="btn-cancel" onClick={() => setShowPasswordForm(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>

        {/* Addresses */}
        <div className="profile-section">
          <h3>Saved Addresses</h3>
          <div className="address-list">
            {addresses.map(addr => (
              <div key={addr.id} className="address-card">
                <div>
                  <strong>{addr.full_name}</strong> {addr.is_default && <span className="default-badge">Default</span>}
                  <p>{addr.street}, {addr.city}, {addr.state} {addr.zip_code}</p>
                  <p>{addr.phone}</p>
                </div>
                <button className="btn-delete-addr" onClick={() => handleDeleteAddress(addr.id)}>✕</button>
              </div>
            ))}
          </div>

          {!showAddressForm ? (
            <button className="btn-add-addr" onClick={() => setShowAddressForm(true)}>+ Add Address</button>
          ) : (
            <form className="address-form" onSubmit={handleAddAddress}>
              <div className="form-row">
                <input placeholder="Full Name" value={newAddress.full_name} onChange={e => setNewAddress({...newAddress, full_name: e.target.value})} required />
                <input placeholder="Phone" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} required />
              </div>
              <input placeholder="Street" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} required />
              <div className="form-row">
                <input placeholder="City" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} required />
                <input placeholder="State" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} required />
                <input placeholder="ZIP" value={newAddress.zip_code} onChange={e => setNewAddress({...newAddress, zip_code: e.target.value})} required />
              </div>
              <div className="edit-actions">
                <button type="submit" className="btn-save">Save Address</button>
                <button type="button" className="btn-cancel" onClick={() => setShowAddressForm(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
