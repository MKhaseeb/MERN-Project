import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const JobsApplicationsChart = ({ jobs = [], applications = [] }) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    const getMonthlyCounts = (items, dateField) => {
        const counts = new Array(6).fill(0);
        items.forEach((item) => {
            const date = new Date(item[dateField]);
            const month = date.getMonth();
            if (month >= 0 && month < 6) {
                counts[month]++;
            }
        });
        return counts;
    };

    // Adjust 'createdAt' if your date field is named differently
    const jobsPerMonth = getMonthlyCounts(jobs, 'createdAt');
    const applicationsPerMonth = getMonthlyCounts(applications, 'appliedAt');

    const chartData = {
        labels: months,
        datasets: [
            {
                label: 'Applications',
                data: applicationsPerMonth,
                borderColor: '#3b82f6',
                backgroundColor: '#3b82f655',
                fill: true,
                tension: 0.3,
            },
            {
                label: 'Jobs',
                data: jobsPerMonth,
                borderColor: '#10b981',
                backgroundColor: '#10b98155',
                fill: true,
                tension: 0.3,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                labels: { color: 'white' },
            },
            title: {
                display: true,
                text: 'Monthly Applications and Jobs',
                color: 'white',
            },
        },
        scales: {
            x: {
                ticks: { color: 'white' },
                grid: { color: '#2c343c' },
            },
            y: {
                ticks: { color: 'white' },
                grid: { color: '#2c343c' },
            },
        },
    };

    return <Line data={chartData} options={chartOptions} />;
};

export default JobsApplicationsChart;
