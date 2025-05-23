import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../Style/EmployeeModals.css'; // Corrected import path

const AddEmployeeModal = ({ onClose, onAdd, currentUserRole }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    department: '',
    designation: '', // This will be mapped to jobTitle in the backend
    role: 'employee', // Default role, can be changed by admin
    // Removed employeeId as it's auto-generated/linked
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  const fetchDepartmentsAndDesignations = useCallback(async () => {
    try {
      // Replace with your actual API endpoints if they exist
      // For now, using placeholder data or assuming they are fetched elsewhere if needed
      const depts = ['HR', 'Engineering', 'Marketing', 'Sales', 'Finance']; // Example departments
      const desigs = ['Software Engineer', 'Senior Engineer', 'HR Manager', 'Sales Executive', 'Accountant']; // Example designations
      setDepartments(depts);
      setDesignations(desigs);
    } catch (err) {
      console.error("Failed to fetch departments/designations", err);
      // setError("Failed to load department/designation options.");
    }
  }, []);

  useEffect(() => {
    fetchDepartmentsAndDesignations();
    if (currentUserRole === 'manager') {
      // Managers can only add employees with the 'employee' role
      // and potentially pre-fill department based on their own
      setFormData(prev => ({ ...prev, role: 'employee' }));
    }
  }, [fetchDepartmentsAndDesignations, currentUserRole]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Basic validation (can be expanded)
    const requiredFields = ['name', 'email', 'username', 'password', 'department', 'designation', 'role'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill in the ${field}.`);
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        return;
      }

      // Step 1: Register the user
      const userPayload = {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        role: formData.role,
        department: formData.department, // Sending department to /register
        designation: formData.designation, // Sending designation to /register (maps to jobTitle)
      };

      const registerResponse = await axios.post('http://localhost:5000/auth/register', userPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (registerResponse.status === 201) {
        // Step 2: Create the employee profile using the registered user's email
        // The backend /employees POST will find the User by email and use its ID.
        const employeePayload = {
          email: formData.email, // Used to link to the User record
          // department: formData.department, // Already sent to /register, backend /employees might use it or User's department
          // jobTitle: formData.designation, // Already sent to /register as designation
          // Other employee-specific fields can be added here if needed
          // e.g., dateOfBirth, joiningDate, etc. if not part of User model
        };

        // If the current user is a manager, the backend will automatically set the manager_id
        // for the new employee when calling POST /employees.

        await axios.post('http://localhost:5000/employees', employeePayload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSuccessMessage('Employee added successfully!');
        onAdd(formData); // Or pass registerResponse.data or a combination
        setTimeout(() => {
          onClose();
        }, 2000); // Close modal after 2 seconds
      } else {
        // This case might not be reached if axios throws for non-2xx responses
        setError(registerResponse.data.message || 'Failed to register user.');
      }

    } catch (err) {
      console.error("Error adding employee:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.statusText) {
        setError(`Error: ${err.response.status} ${err.response.statusText}`);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="add-employee-modal-overlay">
      <div className="add-employee-modal">
        <h2>Add Employee</h2>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="department">Department:</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="designation">Designation:</label>
            <select
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
            >
              <option value="">Select Designation</option>
              {designations.map(desig => (
                <option key={desig} value={desig}>{desig}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={currentUserRole === 'manager'} // Managers cannot change the role from 'employee'
              required
            >
              <option value="employee">Employee</option>
              {currentUserRole === 'admin' && <option value="manager">Manager</option>}
              {/* Admins can also add other admins if your system supports it and backend allows */}
              {currentUserRole === 'admin' && <option value="admin">Admin</option>}
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Add Employee</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;