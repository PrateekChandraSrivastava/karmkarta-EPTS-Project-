import React, { useEffect, useState } from 'react';
import AdminDashboard from './AdminDashboard';
import EmployeesDashboard from './EmployeesDashboard';
import ManagerDashboard from './ManagerDashboard';

const Dashboard = () => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  if (user === undefined) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="error-container">
        <h2>Access Denied</h2>
        <p>Please log in to access the dashboard.</p>
      </div>
    );
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard userData={user} />;
    case 'employee':
      return <EmployeesDashboard userData={user} />;
    case 'manager':
      return <ManagerDashboard userData={user} />;
    default:
      return (
        <div className="error-container">
          <h2>Invalid Role</h2>
          <p>Your account role is not recognized. Please contact support.</p>
        </div>
      );
  }
};

export default Dashboard;


