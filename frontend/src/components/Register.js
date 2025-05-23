// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../Style/Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        role: '',
        email: '',
        department: '',
        position: '',
        managerId: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const payload = {
                username: formData.username,
                password: formData.password,
                role: formData.role
            };

            // If role is employee, include extra fields
            if (formData.role === 'employee') {
                payload.email = formData.email;
                payload.department = formData.department;
                payload.position = formData.position;
                payload.manager_id = formData.managerId;
            }

            const response = await axios.post('http://localhost:5000/auth/register', payload);
            console.log('Registration successful:', response.data);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Create Account</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="employee">Employee</option>
                        </select>
                    </div>

                    {formData.role === 'employee' && (
                        <div className="employee-fields">
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="department">Department</label>
                                <input
                                    type="text"
                                    id="department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    placeholder="Enter your department"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="position">Position</label>
                                <input
                                    type="text"
                                    id="position"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    placeholder="Enter your position"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="managerId">Manager ID (optional)</label>
                                <input
                                    type="number"
                                    id="managerId"
                                    name="managerId"
                                    value={formData.managerId}
                                    onChange={handleChange}
                                    placeholder="Enter your manager's ID"
                                />
                            </div>
                        </div>
                    )}

                    <button type="submit" className="register-button">
                        Register
                    </button>

                    <div className="login-link">
                        Already have an account? <Link to="/login">Login here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
