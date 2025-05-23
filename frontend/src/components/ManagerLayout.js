import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import '../Style/ManagerLayout.css';

const ManagerLayout = () => {
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const menuItems = [
        { path: '/manager', label: 'My Profile', icon: '👤' },
        { path: '/manager/kpis', label: 'KPIs', icon: '📊' },
        { path: '/manager/feedback', label: 'Feedback', icon: '📝' },
        { path: '/manager/employees', label: 'Manage Employees', icon: '👥' },
        { path: '/manager/leaves', label: 'Approve Leaves', icon: '📅' },
        { path: '/manager/reports', label: 'View Reports', icon: '📈' },
        { path: '/manager/tasks', label: 'Assign Tasks', icon: '✓' },
        { path: '/manager/complaints', label: 'Resolve Complaints', icon: '🔔' }
    ];

    return (
        <div className={`manager-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            {!isSidebarOpen && (
                <button
                    className="sidebar-open-btn"
                    aria-label="Open sidebar"
                    onClick={toggleSidebar}
                    style={{
                        position: 'fixed',
                        left: 0,
                        top: 60, // below header
                        width: 48,
                        height: 48,
                        background: '#4a5568',
                        color: '#fff',
                        border: 'none',
                        borderTopRightRadius: 8,
                        borderBottomRightRadius: 8,
                        zIndex: 1200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 28,
                        boxShadow: '2px 0 6px rgba(0,0,0,0.12)',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                    }}
                >&gt;</button>
            )}
            <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <button
                    onClick={toggleSidebar}
                    className="sidebar-toggle-btn"
                    aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                >
                    {isSidebarOpen ? <>&#9776;</> : <>&#x276F;</>}
                </button>
                <div className="sidebar-header">
                    <h2>Manager Dashboard</h2>
                </div>
                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <span className="icon">{item.icon}</span>
                            <span className="label">{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="main-content">
                <Outlet />
            </div>
        </div>
    );
};

export default ManagerLayout;