import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../Style/EmployeesDashboard.css';

const EmployeesDashboard = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployee = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found.');
        return;
      }
      let employeeId = '';
      try {
        const decoded = jwtDecode(token);
        employeeId = decoded.id;
      } catch (err) {
        setError('Invalid token.');
        return;
      }
      try {
        const res = await axios.get(`http://localhost:5000/employees/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployeeData(res.data);
      } catch (err) {
        setError('Failed to fetch employee details.');
      }
    };
    fetchEmployee();
  }, []);

  if (error) {
    return <div className="employee-profile-card"><h1>Error</h1><p>{error}</p></div>;
  }
  if (!employeeData) {
    return <div className="employee-profile-card"><h1>Loading...</h1></div>;
  }

  return (
    <div className="employee-profile-card">
      <h1>Employee Details</h1>
      <div className="profile-content">
        <div className="profile-image-section">
          <div className="profile-image">
            <img
              src={employeeData.image || 'https://via.placeholder.com/300x300'}
              alt={`${employeeData.name}'s profile`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x300';
              }}
            />
          </div>
        </div>
        <div className="profile-details">
          <div className="detail-row">
            <div className="detail-label">Name:</div>
            <div className="detail-value">{employeeData.name}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Employee ID:</div>
            <div className="detail-value">{employeeData.id}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Date of Birth:</div>
            <div className="detail-value">{employeeData.dob ? new Date(employeeData.dob).toLocaleDateString() : '-'}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Gender:</div>
            <div className="detail-value">{employeeData.gender || '-'}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Department:</div>
            <div className="detail-value">{employeeData.department}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Contact:</div>
            <div className="detail-value">{employeeData.phone || '-'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeesDashboard;