import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../Style/EmployeesDashboard.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/employee', label: 'My Profile', icon: '👤' },
    { path: '/employee/check-in-out', label: 'Check In/Out', icon: '⏰' },
    { path: '/employee/leave-request', label: 'Leave Request', icon: '📅' },
    { path: '/employee/work-from-home', label: 'Work From Home', icon: '🏡' },
    { path: '/employee/project-status', label: 'Project Status', icon: '📊' },
    { path: '/employee/complaints', label: 'Raised Complaint', icon: '📝' },
    { path: '/employee/my-tasks', label: 'My Tasks', icon: '✓' }
  ];

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar; 