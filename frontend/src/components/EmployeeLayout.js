import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../Style/EmployeesDashboard.css';

const EmployeeLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className={`sidebar-wrapper ${isSidebarOpen ? 'open' : 'closed'}`}>
        <button
          onClick={toggleSidebar}
          className="sidebar-toggle-btn"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <>&#9776;</> : <>&#x276F;</>}
        </button>
        <Sidebar />
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeLayout; 