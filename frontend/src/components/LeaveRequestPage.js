import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../Style/LeaveRequestPage.css';
import { FiCalendar, FiClock, FiFileText, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';

const LeaveRequestPage = () => {
  const [formData, setFormData] = useState({
    employeeName: '',
    department: '',
    position: '',
    contactNumber: '',
    email: '',
    leaveType: 'casual',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [duration, setDuration] = useState(0);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  let employeeId = '';
  const token = localStorage.getItem('token');
  try {
    const decoded = jwtDecode(token);
    employeeId = decoded.id;
    if (!formData.employeeName && decoded.name) {
      setFormData((prev) => ({ ...prev, employeeName: decoded.name }));
    }
    if (!formData.email && decoded.email) {
      setFormData((prev) => ({ ...prev, email: decoded.email }));
    }
    if (!formData.department && decoded.department) {
      setFormData((prev) => ({ ...prev, department: decoded.department }));
    }
    if (!formData.position && decoded.position) {
      setFormData((prev) => ({ ...prev, position: decoded.position }));
    }
    if (!formData.contactNumber && decoded.phone) {
      setFormData((prev) => ({ ...prev, contactNumber: decoded.phone }));
    }
  } catch (err) {
    employeeId = '';
  }

  useEffect(() => {
    // Fetch employee details from backend using ID from token
    const fetchEmployeeDetails = async () => {
      if (!token) return;
      let employeeId = '';
      try {
        const decoded = jwtDecode(token);
        employeeId = decoded.id;
      } catch (err) {
        return;
      }
      if (!employeeId) return;
      try {
        const res = await axios.get(`http://localhost:5000/employees/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const emp = res.data;
        setFormData((prev) => ({
          ...prev,
          employeeName: emp.name || '',
          department: emp.department || '',
          position: emp.designation || '',
          contactNumber: emp.phone || '',
          email: emp.email || '',
        }));
      } catch (err) {
        // Optionally set error
      }
    };
    fetchEmployeeDetails();
  }, [token]);

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      if (!employeeId) return;
      try {
        const response = await axios.get(`http://localhost:5000/leaves?employeeId=${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaveHistory(response.data);
      } catch (err) {
        setError('Failed to fetch leave history');
      }
    };
    fetchLeaveHistory();
    // eslint-disable-next-line
  }, [showSuccess, employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateDuration = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDuration(diffDays);
    } else {
      setDuration(0);
    }
  };

  useEffect(() => {
    calculateDuration();
    // eslint-disable-next-line
  }, [formData.startDate, formData.endDate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.employeeName) newErrors.employeeName = 'Employee name is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.leaveType) newErrors.leaveType = 'Leave type is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.reason) newErrors.reason = 'Reason is required';
    if (duration <= 0) newErrors.duration = 'Invalid duration';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowSuccess(false);
    if (!validateForm()) return;
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/leaves', {
        ...formData,
        employeeId,
        duration,
        status: 'pending',
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowSuccess(true);
      setFormData({
        employeeName: '',
        department: '',
        position: '',
        contactNumber: '',
        email: '',
        leaveType: 'casual',
        startDate: '',
        endDate: '',
        reason: '',
      });
      setDuration(0);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FiCheck className="status-icon approved" />;
      case 'rejected':
        return <FiX className="status-icon rejected" />;
      case 'pending':
        return <FiAlertCircle className="status-icon pending" />;
      default:
        return null;
    }
  };

  return (
    <div className="leave-request-page">
      <div className="leave-request-container">
        <h2><FiFileText /> New Leave Request</h2>
        {error && <div className="error-message">{error}</div>}
        {showSuccess && (
          <div className="success-message">
            <FiCheck /> Leave request submitted successfully!
          </div>
        )}
        <form onSubmit={handleSubmit} className="leave-form">
          <div className="form-group">
            <label htmlFor="employeeName">Employee Name</label>
            <input type="text" id="employeeName" name="employeeName" value={formData.employeeName} readOnly />
            {errors.employeeName && <span className="error-message">{errors.employeeName}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <input type="text" id="department" name="department" value={formData.department} readOnly />
            {errors.department && <span className="error-message">{errors.department}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="position">Position</label>
            <input type="text" id="position" name="position" value={formData.position} readOnly />
            {errors.position && <span className="error-message">{errors.position}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="contactNumber">Contact Number</label>
            <input type="text" id="contactNumber" name="contactNumber" value={formData.contactNumber} readOnly />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} readOnly />
          </div>
          <div className="form-group">
            <label htmlFor="leaveType">Leave Type</label>
            <select id="leaveType" name="leaveType" value={formData.leaveType} onChange={handleChange} required>
              <option value="casual">Casual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="annual">Annual Leave</option>
              <option value="maternity">Maternity Leave</option>
              <option value="paternity">Paternity Leave</option>
            </select>
            {errors.leaveType && <span className="error-message">{errors.leaveType}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="startDate"><FiCalendar /> Start Date</label>
            <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} onBlur={calculateDuration} required />
            {errors.startDate && <span className="error-message">{errors.startDate}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="endDate"><FiCalendar /> End Date</label>
            <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} onBlur={calculateDuration} required />
            {errors.endDate && <span className="error-message">{errors.endDate}</span>}
          </div>
          <div className="form-group">
            <label><FiClock /> Duration</label>
            <input type="text" value={`${duration} day${duration !== 1 ? 's' : ''}`} readOnly className="duration-display" />
            {errors.duration && <span className="error-message">{errors.duration}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="reason">Reason for Leave</label>
            <textarea id="reason" name="reason" value={formData.reason} onChange={handleChange} required rows="4" placeholder="Please provide a detailed reason for your leave request"></textarea>
            {errors.reason && <span className="error-message">{errors.reason}</span>}
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
      <div className="leave-history-container">
        <h2>Leave History</h2>
        {leaveHistory.length > 0 ? (
          <div className="leave-history">
            {leaveHistory.map(leave => (
              <div key={leave.id} className="leave-history-item">
                <div className="leave-info">
                  <div className="leave-type">{leave.leaveType}</div>
                  <div className="leave-dates">
                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                  </div>
                  <div className="leave-duration">{leave.duration} day{leave.duration !== 1 ? 's' : ''}</div>
                  <div className="leave-reason">{leave.reason}</div>
                  <div className="leave-status">{leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}</div>
                </div>
                <div className={`leave-status ${leave.status}`}>
                  {getStatusIcon(leave.status)}
                  {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-leave-history">
            <FiFileText />
            <p>No leave history available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequestPage;