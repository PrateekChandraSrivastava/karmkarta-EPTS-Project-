// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Style/Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors

        try {
            const response = await axios.post('http://localhost:5000/auth/login', {
                username,
                password,
            });

            if (response.data.token) {
                // Store the token
                localStorage.setItem('token', response.data.token);

                try {
                    // Decode the token to get user info
                    const tokenPayload = JSON.parse(atob(response.data.token.split('.')[1]));
                    const userRole = tokenPayload.role.toLowerCase(); // Ensure role is lowercase
                    const userId = tokenPayload.id;

                    // Store user info
                    localStorage.setItem('userRole', userRole);
                    localStorage.setItem('userId', userId);

                    // Redirect based on role
                    switch (userRole) {
                        case 'admin':
                            navigate('/admin');
                            break;
                        case 'manager':
                            navigate('/manager');
                            break;
                        case 'employee':
                            navigate('/employee');
                            break;
                        default:
                            setError('Invalid user role');
                            localStorage.clear(); // Clear storage if role is invalid
                            break;
                    }
                } catch (decodeError) {
                    setError('Invalid token format');
                    localStorage.clear();
                }
            } else {
                setError('Login failed. No token received.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(
                err.response?.data?.error ||
                'Login failed. Please check your credentials and try again.'
            );
            localStorage.clear();
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input type="checkbox" name="remember" />
                            <span>Remember me</span>
                        </label>
                        <button type="button" className="forgot-password" style={{ background: 'none', border: 'none', color: '#007bff', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>Forgot Password?</button>
                    </div>

                    <button type="submit" className="login-button">Login</button>
                </form>
                <p className="register-link">
                    Don't have an account? <button type="button" onClick={() => window.location.href = '/register'} className="link-button">Register</button>
                </p>
            </div>
        </div>
    );
};

export default Login;

