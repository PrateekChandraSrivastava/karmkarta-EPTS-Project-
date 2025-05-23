// src/components/EmployeeKPIs.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import KPIChart from './KPIChart';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const EmployeeKPIs = ({ employeeId }) => {
    const [metrics, setMetrics] = useState([]);

    const fetchMetrics = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/performance-metrics?employee_id=${employeeId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMetrics(response.data);
        } catch (error) {
            console.error('Error fetching employee KPI data:', error);
        }
    }, [employeeId]);

    useEffect(() => {
        if (employeeId) {
            fetchMetrics();
        }
    }, [employeeId, fetchMetrics]);

    return (
        <div>
            <h2>KPI Scores for Employee {employeeId}</h2>
            <table border="1" cellPadding="5" cellSpacing="0">
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
            {/* Optionally, include the KPIChart component */}
            <KPIChart />
        </div>
    );
};

export default EmployeeKPIs;
