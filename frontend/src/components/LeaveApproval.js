import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Style/LeaveApproval.css';

const LeaveApproval = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filter, setFilter] = useState('pending'); // pending, approved, rejected, all

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchLeaveRequests();
    }, [filter]);

    const fetchLeaveRequests = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/leave-requests?status=${filter}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLeaveRequests(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch leave requests');
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (requestId, newStatus) => {
        try {
            await axios.patch(`http://localhost:5000/leave-requests/${requestId}`, {
                status: newStatus
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess('Leave request updated successfully');
            fetchLeaveRequests();
        } catch (err) {
            setError('Failed to update leave request');
        }
    };

    return (
        <div className="leave-approval">
            <h1>Manage Leave Requests</h1>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            <div className="filter-buttons">
                {['pending', 'approved', 'rejected', 'all'].map((status) => (
                    <button
                        key={status}
                        className={filter === status ? 'active' : ''}
                        onClick={() => setFilter(status)}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Employee Name</th>
                            <th>Leave Type</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaveRequests.map((request) => (
                            <tr key={request.id}>
                                <td>{request.employeeName}</td>
                                <td>{request.leaveType}</td>
                                <td>{new Date(request.startDate).toLocaleDateString()}</td>
                                <td>{new Date(request.endDate).toLocaleDateString()}</td>
                                <td>{request.status}</td>
                                <td>
                                    {request.status === 'pending' && (
                                        <>
                                            <button onClick={() => handleStatusUpdate(request.id, 'approved')}>
                                                Approve
                                            </button>
                                            <button onClick={() => handleStatusUpdate(request.id, 'rejected')}>
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default LeaveApproval;