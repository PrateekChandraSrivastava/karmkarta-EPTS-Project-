import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Style/TaskManagement.css';

const TaskManagement = () => {
    const [tasks, setTasks] = useState([]);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        employeeId: '', // use employeeId for dropdown
        priority: 'Medium',
        dueDate: '',
        status: 'Pending',
        description: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const [employees, setEmployees] = useState([]);
    const [taskTitleOption, setTaskTitleOption] = useState('');
    const [customTitle, setCustomTitle] = useState('');

    useEffect(() => {
        fetchTasks();
        fetchEmployees();
    }, []);

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/tasks', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(response.data);
        } catch (error) {
            setErrorMessage('Failed to fetch tasks');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/employees', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEmployees(response.data);
        } catch (error) {
            // Optionally handle error
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAssignTask = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            // Find employee name for assignedTo
            const selectedEmp = employees.find(emp => emp.id.toString() === newTask.employeeId);
            const payload = {
                ...newTask,
                assignedTo: selectedEmp ? selectedEmp.name : ''
            };
            await axios.post('http://localhost:5000/tasks', payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setShowAssignModal(false);
            setNewTask({
                title: '',
                employeeId: '',
                priority: 'Medium',
                dueDate: '',
                status: 'Pending',
                description: ''
            });
            setSuccessMessage('Task assigned successfully');
            fetchTasks();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            setErrorMessage('Failed to assign task');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    const handleViewTask = (task) => {
        setSelectedTask(task);
        setShowViewModal(true);
    };

    const handleCloseViewModal = () => {
        setSelectedTask(null);
        setShowViewModal(false);
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch =
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || task.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="task-management-container">
            <div className="page-header">
                <h1>Assign Task</h1>
            </div>

            {successMessage && <div className="success-message">{successMessage}</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <div className="task-controls">
                <div className="search-filter-container">
                    <input
                        type="text"
                        placeholder="Search tasks..."
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
                            onClick={() => setStatusFilter('completed')}
                        >
                            Completed
                        </button>
                        <button
                            className="filter-button"
                            onClick={() => setStatusFilter('in progress')}
                        >
                            In Progress
                        </button>
                    </div>
                </div>
                <button
                    className="assign-task-button"
                    onClick={() => setShowAssignModal(true)}
                >
                    Assign New Task
                </button>
            </div>

            <div className="tasks-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Assigned To</th>
                            <th>Priority</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.map(task => (
                            <tr key={task.id}>
                                <td>{task.title}</td>
                                <td>{task.assignedTo}</td>
                                <td>
                                    <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                                        {task.priority}
                                    </span>
                                </td>
                                <td>{task.dueDate}</td>
                                <td>
                                    <span className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
                                        {task.status}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="view-button"
                                        onClick={() => handleViewTask(task)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showAssignModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Assign New Task</h2>
                            <button
                                className="close-button"
                                onClick={() => setShowAssignModal(false)}
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleAssignTask} className="task-form">
                            <div className="form-group">
                                <label htmlFor="title">Task Title</label>
                                <select
                                    id="taskTitleOption"
                                    name="taskTitleOption"
                                    value={taskTitleOption}
                                    onChange={e => {
                                        setTaskTitleOption(e.target.value);
                                        if (e.target.value !== 'Other') {
                                            setNewTask(prev => ({ ...prev, title: e.target.value }));
                                            setCustomTitle('');
                                        } else {
                                            setNewTask(prev => ({ ...prev, title: '' }));
                                        }
                                    }}
                                    required
                                >
                                    <option value="">Select a title</option>
                                    <option value="Daily Report">Daily Report</option>
                                    <option value="Client Call">Client Call</option>
                                    <option value="Documentation">Documentation</option>
                                    <option value="Other">Other</option>
                                </select>
                                {taskTitleOption === 'Other' && (
                                    <input
                                        type="text"
                                        id="customTitle"
                                        name="customTitle"
                                        placeholder="Enter custom title"
                                        value={customTitle}
                                        onChange={e => {
                                            setCustomTitle(e.target.value);
                                            setNewTask(prev => ({ ...prev, title: e.target.value }));
                                        }}
                                        required
                                    />
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="assignedTo">Assigned To</label>
                                <select
                                    id="assignedTo"
                                    name="employeeId"
                                    value={newTask.employeeId}
                                    onChange={e => setNewTask(prev => ({ ...prev, employeeId: e.target.value }))}
                                    required
                                >
                                    <option value="">Select employee</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>
                                    ))}
                                </select>
                            </div>
                            {/* Hidden employeeId field for backend compatibility */}
                            <input type="hidden" name="employeeId" value={newTask.employeeId || ''} />
                            <div className="form-group">
                                <label htmlFor="priority">Priority</label>
                                <select
                                    id="priority"
                                    name="priority"
                                    value={newTask.priority}
                                    onChange={handleInputChange}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="dueDate">Due Date</label>
                                <input
                                    type="date"
                                    id="dueDate"
                                    name="dueDate"
                                    value={newTask.dueDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={newTask.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="submit-button">
                                    Assign Task
                                </button>
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() => setShowAssignModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showViewModal && selectedTask && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Task Details</h2>
                            <button
                                className="close-button"
                                onClick={handleCloseViewModal}
                            >
                                &times;
                            </button>
                        </div>
                        <div className="task-details">
                            <div className="detail-group">
                                <h3>Task Information</h3>
                                <p><strong>Title:</strong> {selectedTask.title}</p>
                                <p><strong>Description:</strong> {selectedTask.description}</p>
                                <p><strong>Priority:</strong>
                                    <span className={`priority-badge ${selectedTask.priority.toLowerCase()}`}>
                                        {selectedTask.priority}
                                    </span>
                                </p>
                                <p><strong>Status:</strong>
                                    <span className={`status-badge ${selectedTask.status.toLowerCase().replace(' ', '-')}`}>
                                        {selectedTask.status}
                                    </span>
                                </p>
                                <p><strong>Due Date:</strong> {selectedTask.dueDate}</p>
                            </div>
                            <div className="detail-group">
                                <h3>Employee Information</h3>
                                <p><strong>Name:</strong> {selectedTask.assignedTo}</p>
                            </div>
                            <div className="detail-actions">
                                <button
                                    className="edit-button"
                                    onClick={() => {
                                        // Add edit functionality here
                                        handleCloseViewModal();
                                    }}
                                >
                                    Edit Task
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={() => {
                                        // Add delete functionality here
                                        handleCloseViewModal();
                                    }}
                                >
                                    Delete Task
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskManagement;