// src/components/KPIs.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import KPIChart from './KPIChart';
import '../Style/KPIs.css';

const KPIs = () => {
    // Form state for KPI input
    const [kpiName, setKpiName] = useState('');
    const [customKpiName, setCustomKpiName] = useState('');
    const [showCustomKpi, setShowCustomKpi] = useState(false);
    const [value, setValue] = useState('');
    const [date, setDate] = useState('');
    // State for KPI entries
    const [metrics, setMetrics] = useState([]);
    // State for list of employees and selected employee ID (from dropdown)
    const [employees, setEmployees] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

    // KPI options for dropdown
    const kpiOptions = [
        'Attendance',
        'Task Completion',
        'Quality of Work',
        'Teamwork',
        'Punctuality',
        'Communication',
        'Problem Solving',
        'Initiative',
        'Customer Feedback',
        'Learning & Development',
        'Leadership',
        'Other',
    ];

    // Fetch the list of employees for the dropdown
    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:5000/employees', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    // Fetch KPI data; if an employee is selected, filter by that employee_id
    const fetchMetrics = useCallback(async () => {
        try {
            let url = 'http://localhost:5000/performance-metrics';
            if (selectedEmployeeId) {
                url += `?employee_id=${selectedEmployeeId}`;
            }
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setMetrics(response.data);
        } catch (error) {
            console.error('Error fetching KPI data:', error);
        }
    }, [selectedEmployeeId]); // Added selectedEmployeeId as a dependency

    // Fetch employees once when the component mounts
    useEffect(() => {
        fetchEmployees();
    }, []);

    // Re-fetch KPI data whenever the selected employee changes or fetchMetrics changes
    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]); // Now depends on the memoized fetchMetrics

    // Handle KPI form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const chosenEmployeeId = selectedEmployeeId !== '' ? parseInt(selectedEmployeeId, 10) : null;
        if (!chosenEmployeeId) {
            alert("Please select an employee from the dropdown.");
            return;
        }
        let finalKpiName = kpiName;
        if (kpiName === 'Other') {
            if (!customKpiName.trim()) {
                alert('Please enter a custom KPI name.');
                return;
            }
            finalKpiName = customKpiName.trim();
        }
        try {
            const payload = {
                employee_id: chosenEmployeeId,
                kpi_name: finalKpiName,
                value: parseInt(value, 10),
                date,
            };
            // const response = await axios.post('http://localhost:5000/performance-metrics', payload, { // This line was causing the unused variable warning, it's correctly removed now if not used.
            await axios.post('http://localhost:5000/performance-metrics', payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            // Reset form fields
            setKpiName('');
            setCustomKpiName('');
            setShowCustomKpi(false);
            setValue('');
            setDate('');
            fetchMetrics();
        } catch (error) {
            console.error('Error submitting KPI:', error);
        }
    };

    return (
        <div className="kpi-container">
            <div className="kpi-header">
                <h2>Input KPI Score</h2>
            </div>

            <form onSubmit={handleSubmit} className="kpi-form stylish-kpi-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Select Employee:</label>
                        <select
                            value={selectedEmployeeId}
                            onChange={(e) => setSelectedEmployeeId(e.target.value)}
                            required
                            className="kpi-select"
                        >
                            <option value="">-- Select Employee --</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name} (ID: {emp.id})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>KPI Name:</label>
                        <select
                            value={kpiName}
                            onChange={(e) => {
                                setKpiName(e.target.value);
                                setShowCustomKpi(e.target.value === 'Other');
                                if (e.target.value !== 'Other') setCustomKpiName('');
                            }}
                            required
                            className="kpi-select"
                        >
                            <option value="">-- Select KPI --</option>
                            {kpiOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        {showCustomKpi && (
                            <input
                                type="text"
                                placeholder="Enter custom KPI name"
                                value={customKpiName}
                                onChange={(e) => setCustomKpiName(e.target.value)}
                                className="custom-kpi-input"
                                required
                            />
                        )}
                    </div>

                    <div className="form-group">
                        <label>Score (1-5):</label>
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            required
                            min="1"
                            max="5"
                            className="score-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Date:</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="date-input"
                        />
                    </div>
                </div>

                <button type="submit" className="kpi-button stylish-kpi-button">Submit KPI</button>
            </form>

            <div className="kpi-table">
                <h3>KPI Scores</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Employee ID</th>
                            <th>KPI Name</th>
                            <th>Score</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {metrics.map((metric) => (
                            <tr key={metric.id}>
                                <td>{metric.id}</td>
                                <td>{metric.employee_id}</td>
                                <td>{metric.kpi_name}</td>
                                <td>{metric.value}</td>
                                <td>{new Date(metric.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="kpi-chart-container">
                <div className="kpi-chart-header">
                    <h3>KPI Performance Chart</h3>
                </div>
                <KPIChart employeeId={selectedEmployeeId} />
            </div>
        </div>
    );
};

export default KPIs;

/* Add/replace in KPIs.css or in a style tag for quick demo:
.stylish-kpi-form {
    background: #f8fafd;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.07);
    padding: 2rem 2.5rem;
    margin-bottom: 2rem;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
}
.kpi-select, .score-input, .date-input, .custom-kpi-input {
    border-radius: 8px;
    border: 1px solid #bfc9d1;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    margin-top: 0.3rem;
    width: 100%;
    box-sizing: border-box;
}
.stylish-kpi-button {
    background: linear-gradient(90deg, #4f8cff 0%, #2355d8 100%);
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 0.7rem 2.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    margin-top: 1.2rem;
    cursor: pointer;
    transition: background 0.2s;
}
.stylish-kpi-button:hover {
    background: linear-gradient(90deg, #2355d8 0%, #4f8cff 100%);
}
.form-group label {
    font-weight: 500;
    color: #2d3a4a;
}
.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
}
@media (max-width: 700px) {
    .form-grid { grid-template-columns: 1fr; }
    .stylish-kpi-form { padding: 1rem; }
}
*/
