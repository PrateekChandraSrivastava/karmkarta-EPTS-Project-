import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Style/LeaveApproval.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const LeaveApprovals = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchLeaveRequests = async () => {
            try {
                // Use the correct backend endpoint for fetching leave requests
                const response = await axios.get(`${API_BASE_URL}/leaves`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setLeaveRequests(response.data);
            } catch (error) {
                setErrorMessage('Failed to fetch leave requests');
                setTimeout(() => setErrorMessage(''), 3000);
            }
        };

        fetchLeaveRequests();
    }, [successMessage]); // refetch after approve/reject

    const filteredRequests = leaveRequests.filter(request => {
        const matchesSearch = request.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedRequest(null);
        setShowModal(false);
    };

    const handleAction = async (requestId, action) => {
        try {
            await axios.put(`${API_BASE_URL}/leaves/${requestId}`, { status: action }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setSuccessMessage(`Leave request ${action} successfully`);
            setTimeout(() => setSuccessMessage(''), 3000);
            handleCloseModal();
        } catch (error) {
            setErrorMessage('Failed to update leave request status');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    return (
        <div className="leave-approval-container">
            <div className="page-header">
                <h1>Manage Leave</h1>
            </div>

            {successMessage && <div className="success-message">{successMessage}</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <div className="header-container">
                <input
                    type="text"
                    placeholder="Search by Employee ID or Name"
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="filter-buttons">
                    <button
                        className="filter-button"
                        onClick={() => setStatusFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className="filter-button"
                        onClick={() => setStatusFilter('approved')}
                    >
                        Approved
                    </button>
                    <button
                        className="filter-button"
                        onClick={() => setStatusFilter('rejected')}
                    >
                        Rejected
                    </button>
                </div>
            </div>

            <div className="leave-table">
                <table>
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Employee Name</th>
                            <th>Leave Type</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.map(request => (
                            <tr key={request.id}>
                                <td>{request.employeeId}</td>
                                <td>{request.employeeName}</td>
                                <td>{request.leaveType}</td>
                                <td>{request.startDate}</td>
                                <td>{request.endDate}</td>
                                <td>
                                    <span className={`status-text ${request.status}`}>
                                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="view-button"
                                        onClick={() => handleViewDetails(request)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && selectedRequest && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Employee Leave Details</h2>
                            <button className="close-button" onClick={handleCloseModal}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-group">
                                <h3>Employee Information</h3>
                                <p><strong>Employee ID:</strong> {selectedRequest.employeeId}</p>
                                <p><strong>Name:</strong> {selectedRequest.employeeName}</p>
                                <p><strong>Department:</strong> {selectedRequest.department}</p>
                                <p><strong>Position:</strong> {selectedRequest.position}</p>
                                <p><strong>Email:</strong> {selectedRequest.email}</p>
                                <p><strong>Contact:</strong> {selectedRequest.contactNumber}</p>
                            </div>
                            <div className="detail-group">
                                <h3>Leave Details</h3>
                                <p><strong>Leave Type:</strong> {selectedRequest.leaveType}</p>
                                <p><strong>Start Date:</strong> {selectedRequest.startDate}</p>
                                <p><strong>End Date:</strong> {selectedRequest.endDate}</p>
                                <p><strong>Reason:</strong> {selectedRequest.reason}</p>
                                <p><strong>Status:</strong>
                                    <span className={`status-text ${selectedRequest.status}`}>
                                        {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                                    </span>
                                </p>
                            </div>
                            {selectedRequest.status === 'pending' && (
                                <div className="action-buttons">
                                    <button
                                        className="approve-button"
                                        onClick={() => handleAction(selectedRequest.id, 'approved')}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="reject-button"
                                        onClick={() => handleAction(selectedRequest.id, 'rejected')}
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveApprovals;