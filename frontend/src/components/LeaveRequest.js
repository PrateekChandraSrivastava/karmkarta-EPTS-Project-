import React, { useState } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import '../Style/LeaveRequest.css';
import { FiFileText, FiClock } from 'react-icons/fi';

const LeaveRequest = () => {
  const [leaveData, setLeaveData] = useState({
    startDate: '',
    endDate: '',
    leaveType: 'annual',
    reason: '',
    employeeName: '',
    department: '',
    position: '',
    contactNumber: '',
    email: '',
  });
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  let employeeId = '';
  const token = localStorage.getItem('token');
  try {
    const decoded = jwtDecode(token);
    employeeId = decoded.id;
  } catch (err) {
    employeeId = '';
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeaveData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateDuration = () => {
    if (leaveData.startDate && leaveData.endDate) {
      const start = new Date(leaveData.startDate);
      const end = new Date(leaveData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDuration(diffDays);
    } else {
      setDuration(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    calculateDuration();
    try {
      const response = await axios.post('http://localhost:5000/leaves', {
        ...leaveData,
        employeeId,
        duration,
        status: 'pending',
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Leave request submitted successfully!');
      setLeaveData({
        startDate: '',
        endDate: '',
        leaveType: 'annual',
        reason: '',
        employeeName: '',
        department: '',
        position: '',
        contactNumber: '',
        email: '',
      });
      setDuration(0);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leave-request-container">
      <h2><FiFileText /> Submit Leave Request</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit} className="leave-form">
        <div className="form-group">
          <label htmlFor="employeeName">Employee Name</label>
          <input type="text" id="employeeName" name="employeeName" value={leaveData.employeeName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="department">Department</label>
          <input type="text" id="department" name="department" value={leaveData.department} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="position">Position</label>
          <input type="text" id="position" name="position" value={leaveData.position} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="contactNumber">Contact Number</label>
          <input type="text" id="contactNumber" name="contactNumber" value={leaveData.contactNumber} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={leaveData.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="leaveType">Leave Type</label>
          <select id="leaveType" name="leaveType" value={leaveData.leaveType} onChange={handleChange} required>
            <option value="annual">Annual Leave</option>
            <option value="sick">Sick Leave</option>
            <option value="casual">Casual Leave</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input type="date" id="startDate" name="startDate" value={leaveData.startDate} onChange={handleChange} onBlur={calculateDuration} required />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input type="date" id="endDate" name="endDate" value={leaveData.endDate} onChange={handleChange} onBlur={calculateDuration} required />
        </div>
        <div className="form-group">
          <label><FiClock /> Duration</label>
          <input type="text" value={`${duration} day${duration !== 1 ? 's' : ''}`} readOnly className="duration-display" />
        </div>
        <div className="form-group">
          <label htmlFor="reason">Reason for Leave</label>
          <textarea id="reason" name="reason" value={leaveData.reason} onChange={handleChange} required rows="4" placeholder="Please provide a detailed reason for your leave request"></textarea>
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default LeaveRequest;