import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import '../Style/ProjectStatus.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const ProjectStatus = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - replace with actual API calls
  const projectData = {
    totalProjects: 5,
    completedProjects: 2,
    inProgressProjects: 2,
    upcomingProjects: 1,
    projects: [
      {
        id: 1,
        name: 'Website Redesign',
        progress: 75,
        status: 'In Progress',
        deadline: '2024-04-15',
        team: ['John', 'Sarah', 'Mike'],
        priority: 'High'
      },
      {
        id: 2,
        name: 'Mobile App Development',
        progress: 90,
        status: 'In Progress',
        deadline: '2024-04-30',
        team: ['Alex', 'Emma'],
        priority: 'High'
      },
      {
        id: 3,
        name: 'Database Migration',
        progress: 100,
        status: 'Completed',
        deadline: '2024-03-20',
        team: ['David', 'Lisa'],
        priority: 'Medium'
      }
    ]
  };

  // Chart data for project progress
  const progressChartData = {
    labels: projectData.projects.map(project => project.name),
    datasets: [
      {
        label: 'Project Progress (%)',
        data: projectData.projects.map(project => project.progress),
        backgroundColor: [
          'rgba(79, 70, 229, 0.6)',
          'rgba(16, 185, 129, 0.6)',
          'rgba(245, 158, 11, 0.6)'
        ],
        borderColor: [
          'rgba(79, 70, 229, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for project status distribution
  const statusChartData = {
    labels: ['Completed', 'In Progress', 'Upcoming'],
    datasets: [
      {
        data: [
          projectData.completedProjects,
          projectData.inProgressProjects,
          projectData.upcomingProjects
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.6)',
          'rgba(79, 70, 229, 0.6)',
          'rgba(245, 158, 11, 0.6)'
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(79, 70, 229, 1)',
          'rgba(245, 158, 11, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Timeline data
  const timelineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Completed Tasks',
        data: [12, 19, 15, 20, 18, 25],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="project-status-container">
      <div className="project-status-header">
        <h1>Project Status Dashboard</h1>
        <div className="project-status-tabs">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Project Details
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="project-status-overview">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Projects</h3>
              <p className="stat-number">{projectData.totalProjects}</p>
            </div>
            <div className="stat-card">
              <h3>Completed</h3>
              <p className="stat-number completed">{projectData.completedProjects}</p>
            </div>
            <div className="stat-card">
              <h3>In Progress</h3>
              <p className="stat-number in-progress">{projectData.inProgressProjects}</p>
            </div>
            <div className="stat-card">
              <h3>Upcoming</h3>
              <p className="stat-number upcoming">{projectData.upcomingProjects}</p>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <h3>Project Progress</h3>
              <Bar data={progressChartData} options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Project Progress Overview'
                  }
                }
              }} />
            </div>
            <div className="chart-card">
              <h3>Status Distribution</h3>
              <Doughnut data={statusChartData} options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  }
                }
              }} />
            </div>
            <div className="chart-card full-width">
              <h3>Task Completion Timeline</h3>
              <Line data={timelineData} options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  }
                }
              }} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'details' && (
        <div className="project-details">
          <div className="projects-grid">
            {projectData.projects.map(project => (
              <div key={project.id} className="project-card">
                <div className="project-card-header">
                  <h3>{project.name}</h3>
                  <span className={`status-badge ${project.status.toLowerCase().replace(' ', '-')}`}>
                    {project.status}
                  </span>
                </div>
                <div className="project-card-body">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                    <span className="progress-text">{project.progress}%</span>
                  </div>
                  <div className="project-info">
                    <p><strong>Deadline:</strong> {project.deadline}</p>
                    <p><strong>Priority:</strong> {project.priority}</p>
                    <p><strong>Team:</strong> {project.team.join(', ')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectStatus; 