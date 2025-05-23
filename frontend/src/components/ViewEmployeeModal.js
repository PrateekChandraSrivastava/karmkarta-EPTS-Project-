import React from 'react';
import '../Style/EmployeeModals.css';

const ViewEmployeeModal = ({ employee, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Employee Details</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="employee-details">
          <div className="employee-profile">
            <img 
              src={employee.image} 
              alt={employee.name} 
              className="profile-image"
            />
            <h3>{employee.name}</h3>
            <span className="employee-id">{employee.employeeId}</span>
            <span className={`status-badge ${employee.status}`}>
              {employee.status}
            </span>
          </div>

          <div className="details-grid">
            <div className="detail-item">
              <label>Department</label>
              <p>{employee.department}</p>
            </div>
            <div className="detail-item">
              <label>Designation</label>
              <p>{employee.designation}</p>
            </div>
            <div className="detail-item">
              <label>Role</label>
              <p>{employee.role}</p>
            </div>
            <div className="detail-item">
              <label>Email</label>
              <p>{employee.email}</p>
            </div>
            <div className="detail-item">
              <label>Phone</label>
              <p>{employee.phone}</p>
            </div>
            <div className="detail-item">
              <label>Date of Birth</label>
              <p>{new Date(employee.dob).toLocaleDateString()}</p>
            </div>
            <div className="detail-item">
              <label>Join Date</label>
              <p>{new Date(employee.joinDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployeeModal; 