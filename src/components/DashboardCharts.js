'use client';

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title
} from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title
);

const breadColor = '#ef4444';
const croissantColor = '#3b82f6';
const textColor = '#e0e0e0';

// Helper for consistency
function formatDateLabel(dateString) {
    const date = new Date(dateString);
    // Format: "Jan 7th 3:21PM"
    // Note: "th" suffix logic is custom, but standard 'numeric' is easier. 
    // Let's stick to standard locale for robustness: "Jan 7, 3:21 PM"
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

export function WinPieChart({ breadWins, croissantWins }) {
    if (breadWins === 0 && croissantWins === 0) {
        return <div className="flex h-full items-center justify-center text-gray-500">No games recorded yet</div>;
    }

    const data = {
        labels: ['Bread Wins', 'Croissant Wins'],
        datasets: [
            {
                data: [breadWins, croissantWins],
                backgroundColor: [breadColor, croissantColor],
                borderColor: ['rgba(0,0,0,0)', 'rgba(0,0,0,0)'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '45%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: textColor }
            }
        }
    };

    return <Pie data={data} options={options} />;
}

export function HistoryLineChart({ history }) {
    if (!history || history.length === 0) {
        return <div className="flex h-full items-center justify-center text-gray-500">No history available</div>;
    }

    const labels = history.map(h => formatDateLabel(h.date));

    const data = {
        labels,
        datasets: [
            {
                label: 'Bread Score',
                data: history.map(h => h.breadScore),
                borderColor: breadColor,
                backgroundColor: breadColor,
                tension: 0.3,
            },
            {
                label: 'Croissant Score',
                data: history.map(h => h.croissantScore),
                borderColor: croissantColor,
                backgroundColor: croissantColor,
                tension: 0.3,
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                grid: { color: '#404040' },
                ticks: { color: textColor }
            },
            x: {
                grid: { display: false },
                ticks: { color: textColor }
            }
        },
        plugins: {
            legend: {
                labels: { color: textColor }
            }
        }
    };

    return <Line data={data} options={options} />;
}

export function CumulativeStackedBarChart({ history }) {
    if (!history || history.length === 0) {
        return <div className="flex h-full items-center justify-center text-gray-500">No history available</div>;
    }

    // Sort by date just in case
    const sortedHistory = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));

    let runningBread = 0;
    let runningCroissant = 0;

    const chartLabels = [];
    const breadData = [];
    const croissantData = [];

    sortedHistory.forEach(game => {
        runningBread += (game.breadScore || 0);
        runningCroissant += (game.croissantScore || 0);

        chartLabels.push(formatDateLabel(game.date));
        breadData.push(runningBread);
        croissantData.push(runningCroissant);
    });

    const data = {
        labels: chartLabels,
        datasets: [
            {
                label: 'Bread Cumulative',
                data: breadData,
                backgroundColor: breadColor,
            },
            {
                label: 'Croissant Cumulative',
                data: croissantData,
                backgroundColor: croissantColor,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                stacked: true,
                grid: { display: false },
                ticks: { color: textColor }
            },
            y: {
                stacked: true,
                grid: { color: '#404040' },
                ticks: { color: textColor }
            }
        },
        plugins: {
            legend: {
                labels: { color: textColor }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        }
    };

    return <Bar data={data} options={options} />;
}
