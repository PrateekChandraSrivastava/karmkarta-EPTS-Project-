import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../Style/AdminSidebar.css';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/admin',
      label: 'My Profile',
      icon: '👤'
    },
    {
      path: '/admin/kpis',
      label: 'KPIs',
      icon: '📊'
    },
    {
      path: '/admin/feedback',
      label: 'Feedback',
      icon: '📝'
    },
    {
      path: '/admin/employees',
      label: 'Manage Employees',
      icon: '👥'
    },
    {
      path: '/admin/leaves',
      label: 'Approve Leaves',
      icon: '📅'
    },
    {
      path: '/admin/reports',
      label: 'View Reports',
      icon: '📈'
    },
    {
      path: '/admin/tasks',
      label: 'Assign Tasks',
      icon: '✓'
    },
    {
      path: '/admin/complaints',
      label: 'Resolve Complaints',
      icon: '🔔'
    }
  ];

  return (
    <div className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button
        onClick={toggleSidebar}
        className="sidebar-toggle-btn"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <>&#9776;</> : <>&#x276F;</>}
      </button>

      <div className="admin-sidebar-header">
        <h2>Admin Dashboard</h2>
      </div>
      <nav className="admin-sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`admin-menu-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="admin-menu-icon">{item.icon}</span>
            {isOpen && <span className="admin-menu-label">{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar; 