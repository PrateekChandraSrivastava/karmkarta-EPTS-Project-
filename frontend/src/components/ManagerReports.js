import React, { useState } from 'react';
import '../Style/Reports.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const ManagerReports = () => {
    const [selectedReport, setSelectedReport] = useState('attendance');
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });
    const [selectedEmployee, setSelectedEmployee] = useState('all');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [showChart, setShowChart] = useState(false);

    // Mock data for demonstration
    const mockEmployees = [
        { id: 'all', name: 'All Employees' },
        { id: 'emp1', name: 'John Doe' },
        { id: 'emp2', name: 'Jane Smith' },
        { id: 'emp3', name: 'Mike Johnson' }
    ];

    const mockDepartments = [
        { id: 'all', name: 'All Departments' },
        { id: 'it', name: 'IT' },
        { id: 'hr', name: 'HR' },
        { id: 'finance', name: 'Finance' }
    ];

    // Mock chart data based on report type
    const getChartData = () => {
        switch (selectedReport) {
            case 'attendance':
                return {
                    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    datasets: [
                        {
                            label: 'Present',
                            data: [45, 42, 47, 43, 44],
                            backgroundColor: '#6c5ce7',
                        },
                        {
                            label: 'Absent',
                            data: [5, 8, 3, 7, 6],
                            backgroundColor: '#dc3545',
                        }
                    ]
                };
            case 'performance':
                return {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                    datasets: [
                        {
                            label: 'Performance Score',
                            data: [85, 88, 82, 90, 87],
                            borderColor: '#6c5ce7',
                            backgroundColor: 'rgba(108, 92, 231, 0.2)',
                            tension: 0.4
                        }
                    ]
                };
            case 'leave':
                return {
                    labels: ['Sick Leave', 'Vacation', 'Personal', 'Other'],
                    datasets: [
                        {
                            label: 'Leave Distribution',
                            data: [12, 25, 8, 5],
                            backgroundColor: [
                                '#6c5ce7',
                                '#4CAF50',
                                '#2196F3',
                                '#FFC107'
                            ],
                        }
                    ]
                };
            case 'task':
                return {
                    labels: ['Completed', 'In Progress', 'Pending', 'Delayed'],
                    datasets: [
                        {
                            label: 'Task Status',
                            data: [30, 15, 10, 5],
                            backgroundColor: [
                                '#6c5ce7',
                                '#FFC107',
                                '#2196F3',
                                '#dc3545'
                            ],
                        }
                    ]
                };
            default:
                return null;
        }
    };

    // Chart options
    const getChartOptions = () => {
        const baseOptions = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: `${selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} Report`,
                },
            },
        };

        if (selectedReport === 'performance') {
            return {
                ...baseOptions,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                    },
                },
            };
        }

        return baseOptions;
    };

    const handleGenerateReport = (e) => {
        e.preventDefault();
        setShowChart(true);
    };

    const renderChart = () => {
        const data = getChartData();
        const options = getChartOptions();

        if (selectedReport === 'performance') {
            return <Line data={data} options={options} />;
        }
        return <Bar data={data} options={options} />;
    };

    return (
        <div className="reports-container">
            <div className="page-header">
                <h1>View Reports</h1>
            </div>

            <div className="reports-content">
                <div className="report-types">
                    <h2>Select Report Type</h2>
                    <div className="report-type-buttons">
                        <button
                            className={`report-type-button ${selectedReport === 'attendance' ? 'active' : ''}`}
                            onClick={() => setSelectedReport('attendance')}
                        >
                            Attendance Report
                        </button>
                        <button
                            className={`report-type-button ${selectedReport === 'performance' ? 'active' : ''}`}
                            onClick={() => setSelectedReport('performance')}
                        >
                            Performance Report
                        </button>
                        <button
                            className={`report-type-button ${selectedReport === 'leave' ? 'active' : ''}`}
                            onClick={() => setSelectedReport('leave')}
                        >
                            Leave Report
                        </button>
                        <button
                            className={`report-type-button ${selectedReport === 'task' ? 'active' : ''}`}
                            onClick={() => setSelectedReport('task')}
                        >
                            Task Report
                        </button>
                    </div>
                </div>

                <form onSubmit={handleGenerateReport} className="report-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="startDate">Start Date</label>
                            <input
                                type="date"
                                id="startDate"
                                value={dateRange.startDate}
                                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="endDate">End Date</label>
                            <input
                                type="date"
                                id="endDate"
                                value={dateRange.endDate}
                                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="employee">Employee</label>
                            <select
                                id="employee"
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                            >
                                {mockEmployees.map(emp => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="department">Department</label>
                            <select
                                id="department"
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                            >
                                {mockDepartments.map(dept => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="report-actions">
                        <button type="submit" className="generate-button">
                            Generate Report
                        </button>
                        <button type="button" className="export-button">
                            Export as PDF
                        </button>
                    </div>
                </form>

                <div className="report-preview">
                    <h2>Report Preview</h2>
                    <div className="preview-content">
                        {showChart ? (
                            <div className="chart-container">
                                {renderChart()}
                            </div>
                        ) : (
                            <div className="preview-placeholder">
                                <p>Select report type and parameters to generate a report preview</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerReports;
