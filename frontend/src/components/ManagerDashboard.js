// src/components/AdminDashboard.js
import React, { useState, useEffect, useRef } from 'react';
import { FiCamera } from 'react-icons/fi';
import '../Style/ManagerDashboard.css';
import axios from 'axios';

const ManagerDashboard = () => {
  const [managerData, setManagerData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchManagerProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setManagerData(response.data);
        setEditedData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch profile.');
        setLoading(false);
      }
    };
    fetchManagerProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(managerData);
  };

  const handleSave = async (e) => {
    e && e.preventDefault && e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/auth/me', editedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setManagerData(response.data);
      setEditedData(response.data);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  // Utility to resize/compress image
  const resizeImage = (file, maxWidth = 300, maxHeight = 300, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            const reader2 = new FileReader();
            reader2.onloadend = () => resolve(reader2.result);
            reader2.onerror = reject;
            reader2.readAsDataURL(blob);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = reject;
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await resizeImage(file);
        setEditedData(prev => ({
          ...prev,
          imageUrl: compressed
        }));
      } catch (err) {
        setError('Failed to process image.');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!managerData) return null;

  return (
    <div className="manager-dashboard">
      <div className="profile-card">
        <div className="profile-header">
          <h1>Manager Profile</h1>
          {!isEditing && (
            <button className="edit-button" onClick={handleEdit}>
              Edit Profile
            </button>
          )}
        </div>
        <div className="profile-content">
          <div className="profile-image-section">
            <div className="profile-image" onClick={handleImageClick}>
              <img
                src={editedData?.imageUrl || 'https://via.placeholder.com/300x300'}
                alt={`${editedData?.name || ''}'s profile`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x300';
                }}
              />
              {isEditing && (
                <div className="image-overlay">
                  <FiCamera size={24} />
                  <span>Change Photo</span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
          <div className="profile-details">
            {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
            {!isEditing ? (
              <>
                <div className="detail-row">
                  <div className="detail-label">Name:</div>
                  <div className="detail-value">{managerData.name}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Username:</div>
                  <div className="detail-value">{managerData.username}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Department:</div>
                  <div className="detail-value">{managerData.department}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Email:</div>
                  <div className="detail-value">{managerData.email}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Phone:</div>
                  <div className="detail-value">{managerData.phone}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Role:</div>
                  <div className="detail-value">{managerData.role}</div>
                </div>
              </>
            ) : (
              <form className="edit-form" onSubmit={handleSave}>
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={editedData.name || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Department:</label>
                  <input
                    type="text"
                    name="department"
                    value={editedData.department || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={editedData.email || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Phone:</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editedData.phone || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="button-group">
                  <button className="save-button" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                  <button className="cancel-button" type="button" onClick={handleCancel} disabled={saving}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
