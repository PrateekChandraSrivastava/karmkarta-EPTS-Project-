// src/components/KPIChart.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import '../Style/KPIChart.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const KPIChart = ({ employeeId }) => {
    // State to hold chart data
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'KPI Scores',
                data: [],
                backgroundColor: 'rgba(0, 43, 61, 0.6)',
                borderColor: 'rgba(0, 43, 61, 1)',
                borderWidth: 1,
            },
        ],
    });

    // Function to fetch KPI data from your backend
    const fetchData = useCallback(async () => {
        try {
            // Construct URL; if employeeId is provided, add it as a query parameter
            let url = 'http://localhost:5000/performance-metrics';
            if (employeeId) {
                url += `?employee_id=${employeeId}`;
            }
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            // Assuming your response data is an array of KPI objects with kpi_name and value properties
            const data = response.data;
            const labels = data.map((item) => item.kpi_name);
            const values = data.map((item) => item.value);

            setChartData({
                labels,
                datasets: [
                    {
                        label: 'KPI Scores',
                        data: values,
                        backgroundColor: 'rgba(0, 43, 61, 0.6)',
                        borderColor: 'rgba(0, 43, 61, 1)',
                        borderWidth: 1,
                    },
                ],
            });
        } catch (error) {
            console.error('Error fetching KPI data for chart:', error);
        }
    }, [employeeId]);

    // Re-fetch data when the component mounts or when employeeId changes
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Chart configuration options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 12,
                        family: "'Arial', sans-serif"
                    },
                    color: '#666'
                }
            },
            title: {
                display: true,
                text: 'KPI Performance Overview',
                font: {
                    size: 16,
                    family: "'Arial', sans-serif",
                    weight: 'bold'
                },
                color: '#333',
                padding: 20
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                    size: 14
                },
                bodyFont: {
                    size: 13
                },
                padding: 12,
                cornerRadius: 4
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 5,
                ticks: {
                    stepSize: 1,
                    font: {
                        size: 12
                    },
                    color: '#666'
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            x: {
                ticks: {
                    font: {
                        size: 12
                    },
                    color: '#666'
                },
                grid: {
                    display: false
                }
            }
        }
    };

    return (
        <div className="kpi-chart">
            <div className="chart-container chart-animation">
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
};

export default KPIChart;
