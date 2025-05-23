import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Style/Header.css';

const LoggedInHeader = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const getDashboardLink = () => {
    switch(userRole) {
      case 'admin':
        return '/admin/dashboard';
      case 'manager':
        return '/manager/dashboard';
      case 'employee':
        return '/employee/dashboard';
      default:
        return '/';
    }
  };

  return (
    <header className="header">
      <span className="brand">Employee Tracker</span>
      <div className="header-container">
        <button onClick={handleLogout} className="nav-button logout-btn">
          Logout
        </button>
      </div>
    </header>
  );
};

export default LoggedInHeader; 