// WorkFromHomeForm.js
import React, { useState, useEffect } from 'react';
import '../Style/WorkFromHomeForm.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function WorkFromHomeForm() {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    workSchedule: '',
    plannedTasks: ''
  });

  const [wfhHistory, setWfhHistory] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Fetch WFH history when component mounts
    fetchWfhHistory();
  }, []);

  const fetchWfhHistory = async () => {
    // TODO: Replace with actual API call
    // For now, using mock data
    // Example of how it might look with an API call:
    /*
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/wfh-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWfhHistory(response.data);
    } catch (error) {
      console.error('Error fetching WFH history:', error);
    }
    */
    const mockHistory = [
      { id: 1, startDate: '2024-03-20', endDate: '2024-03-22', status: 'Approved' },
      { id: 2, startDate: '2024-03-25', endDate: '2024-03-26', status: 'Pending' }
    ];
    setWfhHistory(mockHistory);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TODO: Replace with actual API call
    // Example of how it might look with an API call:
    /*
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/wfh-requests`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMessage('Work from home request submitted successfully!');
      setFormData({
        startDate: '',
        endDate: '',
        reason: '',
        workSchedule: '',
        plannedTasks: ''
      });
      fetchWfhHistory();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error submitting WFH request:', error);
    }
    */
    // Simulating API call
    console.log('Submitting WFH request:', formData);

    // Show success message
    setSuccessMessage('Work from home request submitted successfully!');

    // Clear form
    setFormData({
      startDate: '',
      endDate: '',
      reason: '',
      workSchedule: '',
      plannedTasks: ''
    });

    // Refresh history
    fetchWfhHistory();

    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="wfh-container">
      <div className="wfh-card">
        <h2 className="wfh-heading">🏠 Work From Home Request</h2>

        {successMessage && (
          <div className="wfh-success-message">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="wfh-form">
          <div className="wfh-row">
            <div className="wfh-field">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="wfh-field">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="wfh-field">
            <label>Work Schedule</label>
            <input
              type="text"
              name="workSchedule"
              placeholder="e.g., 9 AM - 6 PM"
              value={formData.workSchedule}
              onChange={handleInputChange}
              required
            />
          </div>



          <div className="wfh-field">
            <label>Planned Tasks</label>
            <textarea
              name="plannedTasks"
              rows="3"
              placeholder="List your planned tasks for the WFH period"
              value={formData.plannedTasks}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="wfh-field">
            <label>Reason for WFH</label>
            <textarea
              name="reason"
              rows="4"
              placeholder="Explain why you're requesting to work from home..."
              value={formData.reason}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="wfh-button">
            ✅ Submit Request
          </button>
        </form>

        {wfhHistory.length > 0 && (
          <div className="wfh-history">
            <h3>WFH Request History</h3>
            <div className="wfh-history-list">
              {wfhHistory.map(request => (
                <div key={request.id} className={`wfh-history-item status-${request.status.toLowerCase()}`}>
                  <div className="wfh-history-dates">
                    {request.startDate} to {request.endDate}
                  </div>
                  <div className="wfh-history-status">
                    {request.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
