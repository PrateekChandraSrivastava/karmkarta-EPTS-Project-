// src/components/RoleBasedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const RoleBasedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole');

    if (!token || !storedRole) {
        // If no token or role, redirect to login
        localStorage.clear(); // Clear any partial data
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        const userRole = decoded.role.toLowerCase();

        // Verify token hasn't expired
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            localStorage.clear();
            return <Navigate to="/login" replace />;
        }

        // Verify stored role matches token role
        if (userRole !== storedRole) {
            localStorage.clear();
            return <Navigate to="/login" replace />;
        }

        // Check if the user's role is in the allowedRoles array
        if (allowedRoles.includes(userRole)) {
            return children;
        } else {
            return (
                <div className="unauthorized-message">
                    <h2>Access Denied</h2>
                    <p>You do not have permission to view this page.</p>
                    <button onClick={() => window.history.back()}>Go Back</button>
                </div>
            );
        }
    } catch (error) {
        console.error('Token validation error:', error);
        localStorage.clear();
        return <Navigate to="/login" replace />;
    }
};

export default RoleBasedRoute;
