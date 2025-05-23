// src/components/Feedback.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // If your jwt-decode exports named "jwtDecode"
import '../Style/Feedback.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Feedback = () => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    let currentUserName = '';

    // Add error state
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    try {
        const decoded = jwtDecode(token);
        currentUserName = decoded.username; // Extract the username from the token
    } catch (error) {
        console.error('Error decoding token', error);
        setError('Authentication error. Please login again.');
    }

    // Form state (from_user is auto-filled, so only to_employee, comment, rating, date)
    const [toEmployee, setToEmployee] = useState('');
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState('');
    const [date, setDate] = useState('');
    // State for list of feedback entries
    const [feedbacks, setFeedbacks] = useState([]);
    // State for employee dropdown
    const [employees, setEmployees] = useState([]);

    // Fetch the list of employees to populate the dropdown.
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/employees`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEmployees(response.data);
                setError('');
            } catch (error) {
                console.error('Error fetching employees:', error);
                setError('Failed to fetch employees. Please try again later.');
            }
        };
        fetchEmployees();
    }, [token]);

    // Helper: Map employee IDs to names for quick lookup
    const employeeMap = employees.reduce((acc, emp) => {
        acc[emp.id] = emp.name;
        return acc;
    }, {});

    // Helper: Map user IDs to usernames for quick lookup
    const userMap = employees.reduce((acc, emp) => {
        acc[emp.id] = emp.name;
        return acc;
    }, {});

    // Helper: Render stars for rating
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} style={{ color: i <= rating ? '#FFD700' : '#e0e0e0', fontSize: '1.2em' }}>&#9733;</span>
            );
        }
        return stars;
    };

    // Fetch feedback entries (moved outside useEffect so it can be called from handleSubmit)
    const fetchFeedbacks = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/feedback`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFeedbacks(response.data);
            setError('');
        } catch (error) {
            console.error('Error fetching feedback:', error);
            setError('Failed to fetch feedback entries. Please try again later.');
        }
    }, [token]); // Added token as a dependency

    useEffect(() => {
        fetchFeedbacks();
    }, [fetchFeedbacks, success]); // Now depends on the memoized fetchFeedbacks and success

    // Handle feedback submission.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors
        setSuccess(''); // Clear any previous success messages

        try {
            const payload = {
                from_user: jwtDecode(token).id, // Automatically set from logged in user
                to_employee: parseInt(toEmployee, 10),
                comment,
                rating: parseInt(rating, 10),
                date,
            };

            const response = await axios.post(`${API_BASE_URL}/feedback`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Feedback submitted:', response.data);

            // Show success message
            setSuccess('Feedback submitted successfully!');

            // Reset the form
            setToEmployee('');
            setComment('');
            setRating('');
            setDate('');

            // Refresh the feedback list
            fetchFeedbacks();
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setError('Failed to submit feedback. Please try again.');
        }
    };

    return (
        <div className="feedback-container">
            <h2>Submit Feedback</h2>

            {/* Error and Success Messages */}
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit} className="feedback-form">
                {/* Automatically display the logged-in user ID */}
                <div className="form-group">
                    <label>
                        From User (Auto-selected): {' '}
                        <strong>{currentUserName || 'Not logged in'}</strong>
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        To Employee:
                        <select
                            value={toEmployee}
                            onChange={(e) => setToEmployee(e.target.value)}
                            required
                        >
                            <option value="">-- Select Employee --</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name} (ID: {emp.id})
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Comment:
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        ></textarea>
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Rating (1-5):
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    style={{ cursor: 'pointer', color: star <= rating ? '#FFD700' : '#e0e0e0', fontSize: '1.5em' }}
                                    onClick={() => setRating(star)}
                                    data-testid={`star-${star}`}
                                >
                                    &#9733;
                                </span>
                            ))}
                        </div>
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Date:
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit" className="submit-button">Submit Feedback</button>
            </form>

            <div className="feedback-list-container">
                <h3>Feedback Entries</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>From User</th>
                            <th>To Employee</th>
                            <th>Comment</th>
                            <th>Rating</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.map((fb) => (
                            <tr key={fb.id}>
                                <td>{fb.id}</td>
                                <td>{userMap[fb.from_user] ? `${userMap[fb.from_user]} (ID: ${fb.from_user})` : fb.from_user}</td>
                                <td>{employeeMap[fb.to_employee] ? `${employeeMap[fb.to_employee]} (ID: ${fb.to_employee})` : fb.to_employee}</td>
                                <td>{fb.comment}</td>
                                <td>{renderStars(fb.rating)}</td>
                                <td>{new Date(fb.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Feedback;
