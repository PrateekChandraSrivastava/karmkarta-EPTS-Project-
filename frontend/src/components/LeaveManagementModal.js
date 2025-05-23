import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // Commented out as handleSubmit is also commented out
import '../Style/EmployeeModals.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const LeaveManagementModal = ({ employee, onClose }) => {
  const [leaveBalance, /* setLeaveBalance */] = useState({
    annual: 20,
    sick: 10,
    casual: 7
  });

  const [leaveHistory, setLeaveHistory] = useState([]);
  // const [adjustment, setAdjustment] = useState(''); // Commented out
  // const [reason, setReason] = useState(''); // Commented out

  useEffect(() => {
    // TODO: Replace with actual API call
    // Fetch leave history
    const mockLeaveHistory = [
      {
        id: 1,
        type: 'Annual',
        startDate: '2024-03-15',
        endDate: '2024-03-20',
        status: 'Approved',
        reason: 'Vacation'
      },
      // Add more mock leave history...
    ];
    setLeaveHistory(mockLeaveHistory);
  }, [employee.id]);

  useEffect(() => {
    const fetchKPIData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/performance-metrics?employee_id=${employee.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to fetch KPI data');
        /* const data = await response.json(); */ // Commented out as data is not used
        await response.json(); // Consume the JSON to prevent unhandled promise rejection
        // Update state with the fetched data (if needed)
      } catch (error) {
        console.error('Error fetching KPI data:', error);
      }
    };
    fetchKPIData();
  }, [employee.id]);

  /* // Commenting out handleSubmit as the form is not implemented
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adjustment || isNaN(parseInt(adjustment))) {
      alert('Please enter a valid numeric adjustment.');
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/adjust-leave`,
        {
          employee_id: employee.id,
          adjustment: parseInt(adjustment),
          reason: reason
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      console.log('Leave balance updated:', response.data);
      onClose(); // Close modal on success
    } catch (error) {
      console.error('Error updating leave balance:', error);
    }
  };
  */

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Leave Management - {employee.name}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="leave-management-content">
          <div className="leave-balance-section">
            <h3>Leave Balance</h3>
            <div className="balance-grid">
              <div className="balance-item">
                <span className="balance-label">Annual Leave</span>
                <span className="balance-value">{leaveBalance.annual} days</span>
              </div>
              <div className="balance-item">
                <span className="balance-label">Sick Leave</span>
                <span className="balance-value">{leaveBalance.sick} days</span>
              </div>
              <div className="balance-item">
                <span className="balance-label">Casual Leave</span>
                <span className="balance-value">{leaveBalance.casual} days</span>
              </div>
            </div>
          </div>

          <div className="leave-history-section">
            <h3>Leave History</h3>
            <div className="leave-history-list">
              {leaveHistory.map(leave => (
                <div key={leave.id} className="leave-history-item">
                  <div className="leave-history-header">
                    <span className="leave-type">{leave.type}</span>
                    <span className={`leave-status status-${leave.status.toLowerCase()}`}>
                      {leave.status}
                    </span>
                  </div>
                  <div className="leave-dates">
                    {leave.startDate} to {leave.endDate}
                  </div>
                  <div className="leave-reason">
                    {leave.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveManagementModal;