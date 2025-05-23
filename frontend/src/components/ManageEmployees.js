import React, { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom'; // Commented out unused import
import '../Style/ManageEmployees.css';
import AddEmployeeModal from './AddEmployeeModal';
import EditEmployeeModal from './EditEmployeeModal';
import ViewEmployeeModal from './ViewEmployeeModal';
import SalaryModal from './SalaryModal';
import LeaveManagementModal from './LeaveManagementModal';
import axios from 'axios';

// Helper function to decode JWT token.
// In a real application, you might use a library like jwt-decode
// and place this in a utils file.
const getAuthDetailsFromToken = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const decoded = JSON.parse(jsonPayload);
    // Ensure your token payload structure matches (e.g., contains 'role' and 'id')
    return { role: decoded.role, id: decoded.userId || decoded.id }; // Adjust 'decoded.userId' or 'decoded.id' based on your token
  } catch (e) {
    console.error("Error decoding token:", e);
    return null;
  }
};

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  // const [currentUserId, setCurrentUserId] = useState(null); // Store if needed for other logic

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const authDetails = getAuthDetailsFromToken(token);
      if (authDetails.role === 'manager') {
        // Show only employees managed by the manager
        setEmployees(response.data);
      } else if (authDetails.role === 'admin') {
        // Show both employees and managers for admin
        setEmployees(response.data);
      } else {
        setEmployees([]); // Default to empty if role is not recognized
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const authDetails = getAuthDetailsFromToken(token);
      if (authDetails) {
        setCurrentUserRole(authDetails.role);
        // setCurrentUserId(authDetails.id);
      } else {
        console.error("Invalid or malformed token.");
        // Handle invalid token, e.g., redirect to login
      }
    } else {
      console.warn("No authentication token found.");
      // Handle user not authenticated, e.g., redirect to login
    }
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddEmployee = async (newEmployee) => {
    try {
      const token = localStorage.getItem('token');
      const authDetails = getAuthDetailsFromToken(token);

      // Include manager_id in the payload if the current user is an admin
      if (authDetails.role === 'admin' && !newEmployee.manager_id) {
        alert('Please specify a manager for the new employee.');
        return;
      }

      await axios.post('http://localhost:5000/employees', newEmployee, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowAddModal(false);
      fetchEmployees();
    } catch (error) {
      console.error("Error adding employee:", error.response ? error.response.data : error.message);
      // Display error to user
    }
  };

  const handleEditEmployee = async (updatedEmployee) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/employees/${updatedEmployee.id}`, updatedEmployee, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        console.log("Employee updated successfully:", response.data);
        setEmployees((prevEmployees) =>
          prevEmployees.map((emp) =>
            emp.id === updatedEmployee.id ? response.data : emp
          )
        );
        setShowEditModal(false);
        setSelectedEmployee(null);
      } else {
        console.error("Unexpected response status:", response.status);
        alert("Failed to update employee. Please try again.");
      }
    } catch (error) {
      console.error("Error updating employee:", error.response ? error.response.data : error.message);
      alert("An error occurred while updating the employee. Please check the details and try again.");
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const token = localStorage.getItem('token');
        // Backend /employees DELETE endpoint is role-aware.
        await axios.delete(`http://localhost:5000/employees/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error.response ? error.response.data : error.message);
        // Display error to user
      }
    }
  };

  const handleSalaryUpdate = async (salaryData) => {
    try {
      // TODO: Replace with actual API call
      setEmployees(employees.map(emp =>
        emp.id === salaryData.employeeId
          ? { ...emp, salary: salaryData }
          : emp
      ));
      setShowSalaryModal(false);
      setSelectedEmployee(null);
    } catch (error) {
      // Removed unnecessary console.error statements
    }
  };

  const filteredEmployees = employees.filter(employee =>
    (employee.employeeId && String(employee.employeeId).toLowerCase().includes(searchQuery.toLowerCase())) || // Ensure employeeId is treated as string
    (employee.name && employee.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="manage-employees-container">
      {loading && <div>Loading employees...</div>}
      <div className="manage-employees-header">
        <h1>Manage Employees</h1>
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search By Employee ID or Name"
              value={searchQuery}
              onChange={handleSearch}
            />
            <i className="fas fa-search search-icon"></i>
          </div>
          <button
            className="add-employee-btn"
            onClick={() => setShowAddModal(true)}
          >
            Add New Employee
          </button>
        </div>
      </div>

      <div className="employees-table-container">
        <table className="employees-table">
          <thead>
            <tr>
              <th>S No</th>
              <th>Image</th>
              <th>Name</th>
              <th>DOB</th>
              <th>Department</th>
              {currentUserRole === 'admin' && <th>Role</th>}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee, index) => (
              <tr key={employee.id}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={employee.imageUrl || employee.image || 'default-avatar.png'} // Added fallback for image
                    alt={employee.name}
                    className="employee-avatar"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'default-avatar.png'; }} // Fallback for broken image links
                  />
                </td>
                <td>{employee.name}</td>
                <td>{employee.dob ? new Date(employee.dob).toLocaleDateString() : 'N/A'}</td>
                <td>{employee.department || 'N/A'}</td>
                {currentUserRole === 'admin' && <td>{employee.role || 'N/A'}</td>}
                <td className="action-buttons">
                  <button
                    className="view-btn"
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setShowViewModal(true);
                    }}
                  >
                    View
                  </button>
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="salary-btn"
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setShowSalaryModal(true);
                    }}
                  >
                    Salary
                  </button>
                  <button
                    className="leave-btn"
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setShowLeaveModal(true);
                    }}
                  >
                    Leave
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteEmployee(employee.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddEmployee}
          currentUserRole={currentUserRole} // Pass current user's role
        />
      )}

      {showEditModal && selectedEmployee && (
        <EditEmployeeModal
          employee={selectedEmployee}
          onClose={() => {
            setShowEditModal(false);
            setSelectedEmployee(null);
          }}
          onUpdate={handleEditEmployee}
        />
      )}

      {showViewModal && selectedEmployee && (
        <ViewEmployeeModal
          employee={selectedEmployee}
          onClose={() => {
            setShowViewModal(false);
            setSelectedEmployee(null);
          }}
        />
      )}

      {showSalaryModal && selectedEmployee && (
        <SalaryModal
          employee={selectedEmployee}
          onClose={() => {
            setShowSalaryModal(false);
            setSelectedEmployee(null);
          }}
          onUpdate={handleSalaryUpdate}
        />
      )}

      {showLeaveModal && selectedEmployee && (
        <LeaveManagementModal
          employee={selectedEmployee}
          onClose={() => {
            setShowLeaveModal(false);
            setSelectedEmployee(null);
          }}
        />
      )}
    </div>
  );
};

export default ManageEmployees;