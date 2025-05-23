import React, { useState, useEffect } from 'react';
import '../Style/Reports.css';
import axios from 'axios';
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

const API_BASE = 'http://localhost:5000';

const Reports = () => {
    const [selectedReport, setSelectedReport] = useState('attendance');
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });
    const [selectedEmployee, setSelectedEmployee] = useState('all');
    const [showChart, setShowChart] = useState(false);
    const [attendanceData, setAttendanceData] = useState([]);
    const [performanceData, setPerformanceData] = useState([]);
    const [leaveData, setLeaveData] = useState([]);
    const [taskData, setTaskData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [employees, setEmployees] = useState([]);

    // Fetch real employees from backend
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_BASE}/employees`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEmployees([{ id: 'all', name: 'All Employees', employeeId: 'all', department: 'all' },
                ...res.data.map(emp => ({
                    id: emp.id,
                    name: emp.name,
                    employeeId: emp.id,
                    department: emp.department || ''
                }))
                ]);
            } catch (err) {
                setEmployees([{ id: 'all', name: 'All Employees', employeeId: 'all', department: 'all' }]);
            }
        };
        fetchEmployees();
    }, []);

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
                            backgroundColor: '#00A884',
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
                            borderColor: '#00A884',
                            backgroundColor: 'rgba(0, 168, 132, 0.2)',
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
                                '#00A884',
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
                                '#00A884',
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
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: `${selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} Report`,
                    font: {
                        size: 16
                    }
                }
            }
        };

        if (selectedReport === 'performance') {
            return {
                ...baseOptions,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            };
        }

        return baseOptions;
    };

    // Fetch attendance data for the report
    const fetchAttendanceData = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const params = {
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                employeeId: selectedEmployee !== 'all' ? selectedEmployee : undefined
            };
            const res = await axios.get(`${API_BASE}/attendance/report`, {
                headers: { Authorization: `Bearer ${token}` },
                params
            });
            setAttendanceData(res.data);
        } catch (err) {
            setError('Failed to fetch attendance data.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch performance data for the report
    const fetchPerformanceData = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const params = {
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                employeeId: selectedEmployee !== 'all' ? selectedEmployee : undefined
            };
            const res = await axios.get(`${API_BASE}/performance-metrics/report`, {
                headers: { Authorization: `Bearer ${token}` },
                params
            });
            setPerformanceData(res.data);
        } catch (err) {
            setError('Failed to fetch performance data.');
        } finally {
            setLoading(false);
        }
    };

    const fetchLeaveData = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const params = {
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                employeeId: selectedEmployee !== 'all' ? selectedEmployee : undefined
            };
            const res = await axios.get(`${API_BASE}/leaves/report`, {
                headers: { Authorization: `Bearer ${token}` },
                params
            });
            setLeaveData(res.data);
        } catch (err) {
            setError('Failed to fetch leave data.');
        } finally {
            setLoading(false);
        }
    };

    const fetchTaskData = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const params = {
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                employeeId: selectedEmployee !== 'all' ? selectedEmployee : undefined
            };
            const res = await axios.get(`${API_BASE}/tasks/report`, {
                headers: { Authorization: `Bearer ${token}` },
                params
            });
            setTaskData(res.data);
        } catch (err) {
            setError('Failed to fetch task data.');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReport = async (e) => {
        e.preventDefault();
        setShowChart(true);
        if (selectedReport === 'attendance') {
            await fetchAttendanceData();
        } else if (selectedReport === 'performance') {
            await fetchPerformanceData();
        } else if (selectedReport === 'leave') {
            await fetchLeaveData();
        } else if (selectedReport === 'task') {
            await fetchTaskData();
        }
    };

    const renderAttendanceTable = () => (
        <div className="attendance-table-section">
            <h3>Attendance Records</h3>
            {loading ? (
                <div>Loading attendance data...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : attendanceData.length === 0 ? (
                <div>No attendance records found for the selected criteria.</div>
            ) : (
                <div className="attendance-table-wrapper">
                    <table className="attendance-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Employee</th>
                                <th>Action</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceData.map((row, idx) => (
                                <tr key={idx}>
                                    <td>{row.date}</td>
                                    <td>{row.userName} (ID: {row.userId}{row.department ? `, ${row.department}` : ''})</td>
                                    <td>{row.action === 'checked-in' ? 'Checked In' : 'Checked Out'}</td>
                                    <td>{row.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    // Chart data for performance
    const getPerformanceChartData = () => {
        if (!performanceData.length) return null;
        const labels = performanceData.map(row => row.date);
        const datasets = [
            {
                label: 'Performance Score',
                data: performanceData.map(row => row.value),
                borderColor: '#00A884',
                backgroundColor: 'rgba(0, 168, 132, 0.2)',
                tension: 0.4
            }
        ];
        return { labels, datasets };
    };

    // Chart data for leave
    const getLeaveChartData = () => {
        if (!leaveData.length) return null;
        const leaveTypes = {};
        leaveData.forEach(row => {
            leaveTypes[row.leaveType] = (leaveTypes[row.leaveType] || 0) + 1;
        });
        return {
            labels: Object.keys(leaveTypes),
            datasets: [
                {
                    label: 'Leave Distribution',
                    data: Object.values(leaveTypes),
                    backgroundColor: [
                        '#00A884',
                        '#4CAF50',
                        '#2196F3',
                        '#FFC107',
                        '#dc3545'
                    ],
                }
            ]
        };
    };

    // Chart data for task
    const getTaskChartData = () => {
        if (!taskData.length) return null;
        const statusCounts = {};
        taskData.forEach(row => {
            statusCounts[row.status] = (statusCounts[row.status] || 0) + 1;
        });
        return {
            labels: Object.keys(statusCounts),
            datasets: [
                {
                    label: 'Task Status',
                    data: Object.values(statusCounts),
                    backgroundColor: [
                        '#00A884',
                        '#FFC107',
                        '#2196F3',
                        '#dc3545'
                    ],
                }
            ]
        };
    };

    const renderChart = () => {
        if (selectedReport === 'attendance') {
            return renderAttendanceTable();
        }
        if (selectedReport === 'performance') {
            const chartData = getPerformanceChartData();
            const chartOptions = getChartOptions();
            return chartData ? <Line data={chartData} options={chartOptions} /> : <div>No performance data found for the selected criteria.</div>;
        }
        if (selectedReport === 'leave') {
            const chartData = getLeaveChartData();
            const chartOptions = getChartOptions();
            return chartData ? <Bar data={chartData} options={chartOptions} /> : <div>No leave data found for the selected criteria.</div>;
        }
        if (selectedReport === 'task') {
            const chartData = getTaskChartData();
            const chartOptions = getChartOptions();
            return chartData ? <Bar data={chartData} options={chartOptions} /> : <div>No task data found for the selected criteria.</div>;
        }
        const chartData = getChartData();
        const chartOptions = getChartOptions();

        switch (selectedReport) {
            case 'performance':
                return <Line data={chartData} options={chartOptions} />;
            default:
                return <Bar data={chartData} options={chartOptions} />;
        }
    };

    return (
        <div className="reports-container">
            <div className="page-header">
                <h1>Generate Reports</h1>
            </div>

            <div className="reports-content">
                <div className="report-types">
                    <h2>Report Types</h2>
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
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.name} (ID: {emp.employeeId}{emp.department && emp.department !== 'all' ? `, ${emp.department}` : ''})
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

export default Reports;
