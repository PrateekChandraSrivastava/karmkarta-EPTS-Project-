import React, { useState, useEffect } from 'react';
import '../Style/MyTasks.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [progressUpdate, setProgressUpdate] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const decoded = jwtDecode(token);
      const employeeId = decoded.id;
      const response = await axios.get(`http://localhost:5000/tasks?employeeId=${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (error) {
      setTasks([]);
    }
  };

  const handleProgressChange = (taskId, newProgress) => {
    // Update both the selected task and the tasks list
    setSelectedTask(prev => ({
      ...prev,
      progress: parseInt(newProgress)
    }));

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, progress: parseInt(newProgress) }
          : task
      )
    );
  };

  const handleProgressUpdate = async (e) => {
    e.preventDefault();
    if (!selectedTask || !progressUpdate.trim()) return;

    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const newUpdate = {
        id: Date.now(),
        date: currentDate,
        message: progressUpdate,
        progress: selectedTask.progress
      };

      // Prepare updated task data
      const updatedTask = {
        ...selectedTask,
        updates: [...selectedTask.updates, newUpdate],
        status: selectedTask.progress === 100 ? 'Completed' : 'In Progress'
      };

      // Persist update to backend
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/tasks/${selectedTask.id}`, updatedTask, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSelectedTask(updatedTask);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === selectedTask.id ? updatedTask : task
        )
      );

      setSuccessMessage('Progress update submitted successfully!');
      setProgressUpdate('');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status.toLowerCase() === filter.toLowerCase();
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'in progress': return 'status-in-progress';
      case 'pending': return 'status-pending';
      default: return '';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <div className="my-tasks-container">
      <div className="tasks-header">
        <h1>My Tasks</h1>
        <div className="filter-section">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <div className="tasks-grid">
        <div className="tasks-list">
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className={`task-card ${selectedTask?.id === task.id ? 'selected' : ''}`}
              onClick={() => setSelectedTask(task)}
            >
              <div className="task-card-header">
                <h3>{task.title}</h3>
                <span className={`status-badge ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>

              <div className="task-info">
                <div className="task-meta">
                  <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className="category-badge">{task.category}</span>
                </div>

                <div className="progress-section">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{task.progress}%</span>
                </div>

                <div className="task-dates">
                  <span>Due: {task.deadline}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedTask && (
          <div className="task-details">
            <div className="task-details-header">
              <h2>{selectedTask.title}</h2>
              <span className={`status-badge ${getStatusColor(selectedTask.status)}`}>
                {selectedTask.status}
              </span>
            </div>

            <div className="task-details-content">
              <div className="detail-section">
                <h3>Description</h3>
                <p>{selectedTask.description}</p>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <label>Priority:</label>
                  <span className={`priority-badge ${getPriorityColor(selectedTask.priority)}`}>
                    {selectedTask.priority}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Category:</label>
                  <span className="category-badge">{selectedTask.category}</span>
                </div>
                <div className="detail-item">
                  <label>Assigned By:</label>
                  <span>{selectedTask.assignedBy}</span>
                </div>
                <div className="detail-item">
                  <label>Assigned Date:</label>
                  <span>{selectedTask.assignedDate}</span>
                </div>
                <div className="detail-item">
                  <label>Deadline:</label>
                  <span>{selectedTask.deadline}</span>
                </div>
              </div>

              <div className="progress-update-section">
                <h3>Update Progress</h3>
                <div className="progress-control">
                  <div className="progress-slider">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selectedTask.progress}
                      onChange={(e) => handleProgressChange(selectedTask.id, e.target.value)}
                      className="progress-input"
                    />
                    <span className="progress-percentage">{selectedTask.progress}%</span>
                  </div>
                  <form onSubmit={handleProgressUpdate} className="progress-form">
                    <textarea
                      value={progressUpdate}
                      onChange={(e) => setProgressUpdate(e.target.value)}
                      placeholder="Add a progress update..."
                      rows="3"
                      className="progress-textarea"
                      required
                    />
                    <button type="submit" className="update-btn">
                      Submit Update
                    </button>
                  </form>
                </div>
              </div>

              <div className="updates-section">
                <h3>Progress Updates</h3>
                <div className="updates-timeline">
                  {selectedTask.updates.map(update => (
                    <div key={update.id} className="update-item">
                      <div className="update-meta">
                        <span className="update-date">{update.date}</span>
                        <span className="update-progress">{update.progress}%</span>
                      </div>
                      <p className="update-message">{update.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;