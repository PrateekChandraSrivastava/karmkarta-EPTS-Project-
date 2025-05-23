import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../Style/AdminComplaintManagement.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AdminComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [response, setResponse] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchComplaints = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/complaints`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (isMounted) setComplaints(res.data);
      } catch (err) {
        if (isMounted) setError('Failed to fetch complaints.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchComplaints();
    return () => { isMounted = false; };
  }, []);

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/complaints/${complaintId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(complaints.map(complaint =>
        complaint.id === complaintId
          ? { ...complaint, status: newStatus }
          : complaint
      ));
      if (selectedComplaint && selectedComplaint.id === complaintId) {
        setSelectedComplaint({ ...selectedComplaint, status: newStatus });
      }
    } catch (error) {
      setError('Error updating status.');
    }
  };

  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    if (!selectedComplaint || !response.trim()) return;
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_BASE_URL}/complaints/${selectedComplaint.id}/response`, { response }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(complaints.map(complaint =>
        complaint.id === selectedComplaint.id
          ? { ...complaint, response, status: 'In Progress' }
          : complaint
      ));
      setSelectedComplaint({ ...selectedComplaint, response, status: 'In Progress' });
      setResponse('');
    } catch (error) {
      setError('Error submitting response.');
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (filter === 'all') return true;
    return complaint.status && complaint.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="admin-complaint-container">
      <div className="admin-complaint-header">
        <h1>Complaint Management</h1>
        <div className="filter-section">
          <label>Filter by Status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Complaints</option>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div>Loading complaints...</div>
      ) : (
        <div className="admin-complaint-grid">
          <div className="complaints-list">
            {filteredComplaints.map(complaint => (
              <div
                key={complaint.id}
                className={`complaint-item ${selectedComplaint?.id === complaint.id ? 'selected' : ''}`}
                onClick={() => setSelectedComplaint(complaint)}
              >
                <div className="complaint-item-header">
                  <h3>{complaint.subject}</h3>
                  <span className={`status-badge ${complaint.status?.toLowerCase().replace(' ', '-')}`}>{complaint.status}</span>
                </div>
                <div className="complaint-item-details">
                  <p><strong>User ID:</strong> {complaint.userId}</p>
                  <p><strong>Category:</strong> {complaint.category}</p>
                  <p><strong>Priority:</strong> {complaint.priority}</p>
                  <p><strong>Date:</strong> {complaint.date}</p>
                </div>
              </div>
            ))}
          </div>
          {selectedComplaint && (
            <div className="complaint-details-panel">
              <h2>Complaint Details</h2>
              <div className="complaint-full-details">
                <h3>{selectedComplaint.subject}</h3>
                <p className="description">{selectedComplaint.description}</p>
                <div className="details-grid">
                  <div><strong>Category:</strong> {selectedComplaint.category}</div>
                  <div><strong>Priority:</strong> {selectedComplaint.priority}</div>
                  <div><strong>Status:</strong> {selectedComplaint.status}</div>
                  <div><strong>Date:</strong> {selectedComplaint.date}</div>
                </div>
                {selectedComplaint.attachment && (
                  <div><strong>Attachment:</strong> <a href={`${API_BASE_URL}/uploads/${selectedComplaint.attachment}`} target="_blank" rel="noopener noreferrer">View</a></div>
                )}
                <div className="response-section">
                  <h4>Admin Response</h4>
                  <form onSubmit={handleResponseSubmit}>
                    <textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="Type your response here..."
                      rows="4"
                    />
                    <div className="action-buttons">
                      <button type="submit" className="submit-btn">Send Response</button>
                      <div className="status-buttons">
                        <button
                          type="button"
                          className="status-btn in-progress"
                          onClick={() => handleStatusUpdate(selectedComplaint.id, 'In Progress')}
                        >Mark In Progress</button>
                        <button
                          type="button"
                          className="status-btn resolved"
                          onClick={() => handleStatusUpdate(selectedComplaint.id, 'Resolved')}
                        >Mark Resolved</button>
                      </div>
                    </div>
                  </form>
                  {selectedComplaint.response && (
                    <div className="admin-response"><strong>Latest Response:</strong> {selectedComplaint.response}</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminComplaintManagement;