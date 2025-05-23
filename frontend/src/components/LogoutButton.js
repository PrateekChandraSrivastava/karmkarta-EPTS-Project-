// src/components/LogoutButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove the token from localStorage
        localStorage.removeItem('token');
        // Redirect the user to the login page
        navigate('/login');
    };

    return (
        <button onClick={handleLogout} style={{ padding: '8px 12px', margin: '10px', cursor: 'pointer' }}>
            Logout
        </button>
    );
};

export default LogoutButton;
