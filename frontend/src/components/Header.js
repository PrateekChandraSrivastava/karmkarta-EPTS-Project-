import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Style/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  // If user is logged in, show only brand and logout
  if (token) {
    return (
      <header className="header">
          <Link to={`/${userRole}`} className="brand">
          EMPLOYEE TRACKER
          </Link>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>
    );
  }

  // If user is not logged in, show full navigation
  return (
    <header className="header">
        <Link to="/" className="brand">
        EMPLOYEE TRACKER
        </Link>
        <nav className="main-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About Us</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </nav>
      <div className="auth-buttons">
        <Link to="/login" className="nav-button">Login</Link>
        <Link to="/register" className="nav-button">Register</Link>
      </div>
    </header>
  );
};

export default Header;
