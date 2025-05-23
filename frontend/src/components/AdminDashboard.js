import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiCamera } from 'react-icons/fi';
import '../Style/AdminDashboard.css';
import axios from 'axios'; // Import axios for API calls

const API_BASE = 'http://localhost:5000'; // Define the base URL for your backend
const DEFAULT_PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDUwIDUwIj48Y2lyY2xlIGN4PSIyNSIgY3k9IjI1IiByPSIyMCIgZmlsbD0iI2NjYyIvPjwvc3ZnPg==';

const AdminDashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [adminData, setAdminData] = useState({
    name: '',
    gender: '',
    contact: '',
    email: '',
    address: '',
    imageUrl: DEFAULT_PLACEHOLDER_IMAGE, // Initialize with default placeholder
    department: '',
    jobTitle: '',
    bio: '',
  });
  const [editData, setEditData] = useState({ ...adminData, profileImageBase64: null }); // Ensure imageUrl is initialized
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please login.');
        setLoading(false);
        // Set adminData to defaults with placeholder if token is missing
        const fallbackState = {
          name: 'Admin User',
          gender: 'N/A',
          contact: 'N/A',
          email: 'admin@example.com',
          address: 'N/A',
          imageUrl: DEFAULT_PLACEHOLDER_IMAGE,
          department: 'Administration',
          jobTitle: 'System Administrator',
          bio: 'Manages the system and user accounts.'
        };
        setAdminData(fallbackState);
        setEditData({ ...fallbackState, profileImageBase64: null });
        return;
      }
      const response = await axios.get(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const fetchedData = response.data;
      // imageUrl from backend is now expected to be a Base64 string or a path that needs to be a placeholder
      const finalImageUrl = fetchedData.imageUrl && fetchedData.imageUrl.startsWith('data:image')
        ? fetchedData.imageUrl
        : DEFAULT_PLACEHOLDER_IMAGE; // Use default placeholder

      const updatedAdminData = {
        name: fetchedData.name || '',
        gender: fetchedData.gender || '',
        contact: fetchedData.phone || '',
        email: fetchedData.email || '',
        address: fetchedData.address || '',
        imageUrl: finalImageUrl, // Use the processed Base64 or placeholder
        department: fetchedData.department || '',
        jobTitle: fetchedData.jobTitle || (fetchedData.role === 'admin' ? 'Administrator' : 'User'),
        bio: fetchedData.bio || ''
      };
      setAdminData(updatedAdminData);
      setEditData({ ...updatedAdminData, profileImageBase64: null });
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch admin details:", err);
      setError('Failed to fetch admin details. Please try again later.');
      const fallbackData = {
        name: 'Admin User',
        gender: 'N/A',
        contact: 'N/A',
        email: 'admin@example.com',
        address: 'N/A',
        imageUrl: DEFAULT_PLACEHOLDER_IMAGE, // Use default placeholder
        department: 'Administration',
        jobTitle: 'System Administrator',
        bio: 'Manages the system and user accounts.'
      };
      setAdminData(fallbackData);
      setEditData({ ...fallbackData, profileImageBase64: null });
      setLoading(false);
    }
  }, []); // Removed API_BASE and DEFAULT_PLACEHOLDER_IMAGE from dependencies as they are constants

  useEffect(() => {
    fetchAdminDetails();
  }, [fetchAdminDetails]);

  const handleEdit = () => {
    setIsEditing(true);
    // Initialize editData with current adminData, ensuring imageUrl is correctly set for preview
    setEditData({ ...adminData, profileImageBase64: null });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication error. Please login again.');
        return;
      }

      // Prepare payload as JSON, not FormData
      const payload = {
        name: editData.name,
        gender: editData.gender,
        phone: editData.contact, // Backend expects 'phone'
        email: editData.email,
        address: editData.address,
        department: editData.department,
        jobTitle: editData.jobTitle,
        bio: editData.bio,
      };

      // Add profileImageBase64 if it exists and is different or explicitly set to null/empty for removal
      if (editData.profileImageBase64 !== undefined) {
        payload.profileImageBase64 = editData.profileImageBase64;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' // Sending JSON data
        }
      };

      const response = await axios.put(`${API_BASE}/auth/me`, payload, config);

      const updatedProfileData = response.data.user || response.data;

      const displayImageUrl = updatedProfileData.imageUrl && updatedProfileData.imageUrl.startsWith('data:image')
        ? updatedProfileData.imageUrl
        : DEFAULT_PLACEHOLDER_IMAGE; // Use default placeholder

      const updatedState = {
        name: updatedProfileData.name || '',
        gender: updatedProfileData.gender || '',
        contact: updatedProfileData.phone || '',
        email: updatedProfileData.email || '',
        address: updatedProfileData.address || '',
        imageUrl: displayImageUrl,
        department: updatedProfileData.department || '',
        jobTitle: updatedProfileData.jobTitle || adminData.jobTitle, // Fallback to existing jobTitle if not in response
        bio: updatedProfileData.bio || adminData.bio, // Fallback to existing bio if not in response
      };

      setAdminData(updatedState);
      setEditData({ ...updatedState, profileImageBase64: null }); // Reset profileImageBase64 after save
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error("Failed to update admin details:", err);
      let errorMessage = 'Failed to update profile.';
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage += ` ${err.response.data.message}`;
      } else if (err.message) {
        errorMessage += ` ${err.message}`;
      }
      alert(errorMessage);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset editData to reflect the currently saved adminData, including its imageUrl
    setEditData({ ...adminData, profileImageBase64: null });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // reader.result contains the Base64 string
        setEditData(prev => ({
          ...prev,
          imageUrl: reader.result, // For local preview
          profileImageBase64: reader.result // Store Base64 string for upload
        }));
      };
      reader.readAsDataURL(file);
    } else {
      // If no file is selected, it implies user might want to clear (or no change if already placeholder)
      // The actual removal is handled by handleRemoveImage or by saving with profileImageBase64 as empty string
      // For preview, if current imageUrl is already placeholder, keep it, else, revert to placeholder
      setEditData(prev => ({
        ...prev,
        imageUrl: DEFAULT_PLACEHOLDER_IMAGE,
        profileImageBase64: "" // Prepare for removal if saved
      }));
    }
  };

  const handleRemoveImage = () => {
    if (isEditing) {
      setEditData(prev => ({
        ...prev,
        imageUrl: DEFAULT_PLACEHOLDER_IMAGE, // Update preview to placeholder
        profileImageBase64: "" // Set to empty string to signify removal to backend
      }));
    }
  };

  if (loading) return <div className="loading-container"><p>Loading admin details...</p></div>;
  if (error) return <div className="error-container"><p>{error}</p></div>;

  // Determine the image source for display: if editing, use editData.imageUrl, otherwise adminData.imageUrl
  const currentImageToDisplay = isEditing ? editData.imageUrl : adminData.imageUrl;

  return (
    <div className="admin-dashboard-container">
      <div className="admin-profile-card">
        <div className="profile-header">
          <h1>Admin Profile</h1>
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
                src={currentImageToDisplay} // Use the determined image source
                alt="Profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_PLACEHOLDER_IMAGE; // Fallback to default placeholder
                }}
              />
              {isEditing && (
                <div className="image-overlay">
                  <FiCamera size={24} />
                  <span>Change Photo</span>
                </div>
              )}
            </div>
            {isEditing && (
              <button onClick={handleRemoveImage} className="remove-image-button">
                Remove Image
              </button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
          <div className="profile-details">
            {isEditing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Job Title:</label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={editData.jobTitle}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Department:</label>
                  <input
                    type="text"
                    name="department"
                    value={editData.department}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Gender:</label>
                  <select name="gender" value={editData.gender} onChange={handleChange}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Contact:</label>
                  <input
                    type="tel"
                    name="contact"
                    value={editData.contact}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Address:</label>
                  <textarea
                    name="address"
                    value={editData.address}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Bio:</label>
                  <textarea
                    name="bio"
                    value={editData.bio}
                    onChange={handleChange}
                    rows="4"
                  />
                </div>
                <div className="button-group">
                  <button className="save-button" onClick={handleSave}>Save</button>
                  <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="detail-row">
                  <div className="detail-label">Name:</div>
                  <div className="detail-value">{adminData.name}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Job Title:</div>
                  <div className="detail-value">{adminData.jobTitle}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Department:</div>
                  <div className="detail-value">{adminData.department}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Gender:</div>
                  <div className="detail-value">{adminData.gender}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Contact:</div>
                  <div className="detail-value">{adminData.contact}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Email:</div>
                  <div className="detail-value">{adminData.email}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Address:</div>
                  <div className="detail-value">{adminData.address}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Bio:</div>
                  <div className="detail-value">{adminData.bio}</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;