import React, { useState, useEffect } from 'react';
import '../Style/RaisedComplaint.css';
import axios from 'axios';

const API_BASE = 'http://localhost:5000'; // Adjust if backend runs elsewhere

const RaisedComplaint = () => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'Medium',
    category: '',
    attachments: null
  });

  const [complaints, setComplaints] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Categories for complaints
  const categories = [
    'Technical Issue',
    'Hardware Problem',
    'Software Problem',
    'Workplace Issue',
    'HR Related',
    'Salary & Benefits',
    'Other'
  ];

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/complaints`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(res.data);
    } catch (err) {
      setErrorMessage('Failed to fetch complaints.');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      attachments: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const form = new FormData();
    form.append('subject', formData.subject);
    form.append('description', formData.description);
    form.append('priority', formData.priority);
    form.append('category', formData.category);
    if (formData.attachments) form.append('attachment', formData.attachments);
    try {
      await axios.post(`${API_BASE}/complaints`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage('Complaint submitted successfully! Admin will review it shortly.');
      setFormData({ subject: '', description: '', priority: 'Medium', category: '', attachments: null });
      const fileInput = document.getElementById('attachment');
      if (fileInput) fileInput.value = '';
      fetchComplaints();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setErrorMessage('Failed to submit complaint. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved': return 'status-resolved';
      case 'in progress': return 'status-in-progress';
      case 'pending': return 'status-pending';
      default: return '';
    }
  };

  return (
    <div className="complaint-container">
      <div className="complaint-content">
        <div className="complaint-form-section">
          <h2>Raise a New Complaint</h2>
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="error-message">{errorMessage}</div>
          )}

          <form onSubmit={handleSubmit} className="complaint-form">
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                placeholder="Brief subject of your complaint"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                required
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Detailed description of your complaint"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="attachment">Attachment (if any)</label>
              <input
                type="file"
                id="attachment"
                name="attachment"
                onChange={handleFileChange}
                className="file-input"
              />
              <small>Supported formats: PDF, JPG, PNG (max 5MB)</small>
            </div>

            <button type="submit" className="submit-btn">
              Submit Complaint
            </button>
          </form>
        </div>

        <div className="complaints-history-section">
          <h2>Complaints History</h2>
          <div className="complaints-list">
            {complaints.map(complaint => (
              <div key={complaint.id} className="complaint-card">
                <div className="complaint-header">
                  <h3>{complaint.subject}</h3>
                  <span className={`status-badge ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </div>
                <div className="complaint-details">
                  <p><strong>Category:</strong> {complaint.category}</p>
                  <p><strong>Priority:</strong> {complaint.priority}</p>
                  <p><strong>Date:</strong> {complaint.date}</p>
                  {complaint.attachment && (
                    <p><strong>Attachment:</strong> <a href={`${API_BASE}/uploads/${complaint.attachment}`} target="_blank" rel="noopener noreferrer">View</a></p>
                  )}
                  {complaint.response && (
                    <div className="admin-response">
                      <strong>Admin Response:</strong>
                      <p>{complaint.response}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaisedComplaint;