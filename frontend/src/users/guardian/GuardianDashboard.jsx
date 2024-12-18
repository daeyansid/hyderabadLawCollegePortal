// src/pages/GuardianDashboard.jsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../AuthProvider';
import img1 from '../../assets/teacher.png'; // Update with appropriate image
import img2 from '../../assets/staff.png';   // Update with appropriate image
import img3 from '../../assets/present.png'; // Update with appropriate image
import img6 from '../../assets/newJoin.png'; // Update with appropriate image
import { getGuardianDashboardStats } from '../../api/guardianDashboardApi';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GuardianDashboard = () => {
    const { userInfo } = useAuth();
    const [dashboardStats, setDashboardStats] = useState({
        totalPresent: 0,
        totalAbsent: 0,
        totalLeave: 0,
        totalChildren: 0,
        attendanceOverTime: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            setLoading(true);
            try {
                const data = await getGuardianDashboardStats();
                setDashboardStats(data);
                setError(null);
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
                setError(error.message || 'Failed to fetch dashboard stats.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    // Prepare data for the chart
    const chartData = {
        labels: dashboardStats.attendanceOverTime.map(entry => {
            const date = new Date(entry.date);
            return date.toLocaleDateString();
        }),
        datasets: [
            {
                label: 'Present',
                data: dashboardStats.attendanceOverTime.map(entry => entry.Present),
                backgroundColor: '#4caf50',
            },
            {
                label: 'Absent',
                data: dashboardStats.attendanceOverTime.map(entry => entry.Absent),
                backgroundColor: '#f44336',
            },
            {
                label: 'Leave',
                data: dashboardStats.attendanceOverTime.map(entry => entry.Leave),
                backgroundColor: '#ff9800',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Attendance Over Last 7 Days',
            },
        },
    };

    return (
        <div className="container mx-auto px-4">
            <div className="mb-4">
                <p className="text-custom-blue text-lg md:text-xl">
                    Welcome Back Dear <b>{userInfo.adminName}</b> Guardian
                </p>
                <p className="text-gray-500 text-sm md:text-base"></p>
            </div>

            {/* Error Handling */}
            {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md shadow">
                    <p>{error}</p>
                </div>
            )}

            {/* Grid for Analytics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-4">
                {/* Total Present */}
                <div className="bg-white flex flex-col gap-4 py-3 pr-4 pl-6 border rounded-lg">
                    <p className="text-gray-700 font-medium">Total Present</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={img1} alt="Total Present" className="w-12 h-12" />
                        {loading ? (
                            <h6 className="text-2xl font-bold text-gray-800">Loading...</h6>
                        ) : (
                            <h6 className="text-2xl font-bold text-gray-800">
                                {dashboardStats.totalPresent}
                            </h6>
                        )}
                    </div>
                </div>

                {/* Total Absent */}
                <div className="bg-white flex flex-col gap-4 py-3 pr-4 pl-6 border rounded-lg">
                    <p className="text-gray-700 font-medium">Total Absent</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={img2} alt="Total Absent" className="w-12 h-12" />
                        {loading ? (
                            <h6 className="text-2xl font-bold text-gray-800">Loading...</h6>
                        ) : (
                            <h6 className="text-2xl font-bold text-gray-800">
                                {dashboardStats.totalAbsent}
                            </h6>
                        )}
                    </div>
                </div>

                {/* Total Leave */}
                <div className="bg-white flex flex-col gap-4 py-3 pr-4 pl-6 border rounded-lg">
                    <p className="text-gray-700 font-medium">Total Leave</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={img3} alt="Total Leave" className="w-12 h-12" />
                        {loading ? (
                            <h6 className="text-2xl font-bold text-gray-800">Loading...</h6>
                        ) : (
                            <h6 className="text-2xl font-bold text-gray-800">
                                {dashboardStats.totalLeave}
                            </h6>
                        )}
                    </div>
                </div>

                {/* Total Children */}
                <div className="bg-white flex flex-col gap-4 py-3 pr-4 pl-6 border rounded-lg">
                    <p className="text-gray-700 font-medium">Total Children</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={img6} alt="Total Children" className="w-12 h-12" />
                        {loading ? (
                            <h6 className="text-2xl font-bold text-gray-800">Loading...</h6>
                        ) : (
                            <h6 className="text-2xl font-bold text-gray-800">
                                {dashboardStats.totalChildren}
                            </h6>
                        )}
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="mt-8">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <svg
                            className="animate-spin h-12 w-12 text-indigo-600 mr-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                        </svg>
                        <span className="text-indigo-600 text-lg">Loading chart...</span>
                    </div>
                ) : (
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default GuardianDashboard;
