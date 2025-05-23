// src/components/ManagerFeedback.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../Style/ManagerFeedback.css';

const ManagerFeedback = () => {
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
    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:5000/employees', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEmployees(response.data);
            setError(''); // Clear any previous errors
        } catch (error) {
            console.error('Error fetching employees:', error);
            setError('Failed to fetch employees. Please try again later.');
        }
    };

    // Fetch feedback entries.
    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/feedback', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFeedbacks(response.data);
            setError(''); // Clear any previous errors
        } catch (error) {
            console.error('Error fetching feedback:', error);
            setError('Failed to fetch feedback entries. Please try again later.');
        }
    };

    useEffect(() => {
        fetchEmployees();
        fetchFeedbacks();
    }, []);

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

            const response = await axios.post('http://localhost:5000/feedback', payload, {
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
        <div className="manager-feedback-container">
            <h2>Submit Feedback</h2>
            
            {/* Error and Success Messages */}
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <form onSubmit={handleSubmit} className="manager-feedback-form">
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
                        <input
                            type="number"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            required
                            min="1"
                            max="5"
                        />
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

            <div className="manager-feedback-list-container">
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
                                <td>{fb.from_user}</td>
                                <td>{fb.to_employee}</td>
                                <td>{fb.comment}</td>
                                <td>{fb.rating}</td>
                                <td>{new Date(fb.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManagerFeedback;
