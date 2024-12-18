// src/pages/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../AuthProvider';
import imgTeacher from '../../assets/teacher.png';
import imgStaff from '../../assets/staff.png';
import imgPresent from '../../assets/present.png';
import imgEmployee from '../../assets/emp.png';
import imgAssignClasses from '../../assets/class.png';
import imgNewJoin from '../../assets/newJoin.png';
import imgFeePaid from '../../assets/fee.png';
import imgFeeRemaining from '../../assets/re-fee.png';
import { getBranchAdminDashboardStats } from '../../api/branchAdminDashboardApi';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const { userInfo } = useAuth();
    const [dashboardStats, setDashboardStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        totalStaff: 0,
        totalEmployees: 0,
        assignClassesToday: 0,
        newJoinThisMonth: 0,
        attendanceOverTime: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            setLoading(true);
            try {
                const data = await getBranchAdminDashboardStats();
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

    // Prepare data for the chart (e.g., New Join This Month Over Last 6 Months)
    const chartData = {
        labels: dashboardStats.attendanceOverTime.map(entry => entry.month),
        datasets: [
            {
                label: 'New Joins',
                data: dashboardStats.attendanceOverTime.map(entry => entry.joinCount),
                backgroundColor: '#6f9bf2',
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
                text: 'New Joins Over Last 6 Months',
            },
        },
    };

    return (
        <div className="container mx-auto px-4">
            <div className="mb-4">
                <p className="text-custom-blue text-lg md:text-xl">
                    Welcome Back <b>{userInfo.branchTypeAdmin}</b> Branch Admin, <b>{userInfo.adminName}</b>
                </p>
                <p className="text-gray-500 text-sm md:text-base">Track your Analytics and Manage your School Teacher and Staff</p>
            </div>

            {/* Error Handling */}
            {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md shadow">
                    <p>{error}</p>
                </div>
            )}

            {/* Grid for Analytics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-4">
                {/* Total Teacher */}
                <div className="bg-custom-white flex flex-col gap-4 py-3 pr-4 pl-6 border rounded-lg">
                    <p className="text-custom-text-color font-medium">Total Teacher</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={imgTeacher} alt="Total Teacher" className="w-12 h-12" />
                        {loading ? (
                            <h6 className="text-2xl font-bold text-custom-number-color">---</h6>
                        ) : (
                            <h6 className="text-2xl font-bold text-custom-number-color">
                                {dashboardStats.totalTeachers}
                            </h6>
                        )}
                    </div>
                </div>

                {/* Other Staff Members */}
                <div className="bg-custom-white flex flex-col gap-4 py-3 pr-4 pl-6 border rounded-lg">
                    <p className="text-custom-text-color font-medium">Total Admin Staff</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={imgStaff} alt="Total Admin Staff" className="w-12 h-12" />
                        {loading ? (
                            <h6 className="text-2xl font-bold text-custom-number-color">---</h6>
                        ) : (
                            <h6 className="text-2xl font-bold text-custom-number-color">
                                {dashboardStats.totalStaff}
                            </h6>
                        )}
                    </div>
                </div>

                {/* Total Present */}
                <div className="bg-custom-white flex flex-col gap-4 py-3 pr-4 pl-6 border rounded-lg">
                    <p className="text-custom-text-color font-medium">Total Present</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={imgPresent} alt="Total Present" className="w-12 h-12" />
                        {loading ? (
                            <h6 className="text-2xl font-bold text-custom-number-color">---</h6>
                        ) : (
                            <h6 className="text-2xl font-bold text-custom-number-color">
                                {dashboardStats.totalPresent}
                            </h6>
                        )}
                    </div>
                </div>

                {/* Total Employee */}
                <div className="bg-custom-white flex flex-col gap-4 py-3 pr-4 pl-6 border rounded-lg">
                    <p className="text-custom-text-color font-medium">Total Employee</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={imgEmployee} alt="Total Employee" className="w-12 h-12" />
                        {loading ? (
                            <h6 className="text-2xl font-bold text-custom-number-color">---</h6>
                        ) : (
                            <h6 className="text-2xl font-bold text-custom-number-color">
                                {dashboardStats.totalEmployees}
                            </h6>
                        )}
                    </div>
                </div>
            </div>

            {/* Grid for Other Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-4">
                {/* Total Student */}
                <div className="bg-custom-white flex flex-col gap-4 py-3 pr-4 pl-6 border rounded-lg">
                    <p className="text-custom-text-color font-medium">Total Students</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={imgAssignClasses} alt="Total Students" className="w-12 h-12" />
                        {loading ? (
                            <h6 className="text-2xl font-bold text-custom-number-color">---</h6>
                        ) : (
                            <h6 className="text-2xl font-bold text-custom-number-color">
                                {dashboardStats.totalStudents}
                            </h6>
                        )}
                    </div>
                </div>

                {/* New Join This Month */}
                <div className="bg-custom-white flex flex-col gap-4 py-3 pr-4 pl-6 border rounded-lg">
                    <p className="text-custom-text-color font-medium">New Join This Month</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={imgNewJoin} alt="New Join This Month" className="w-12 h-12" />
                        {loading ? (
                            <h6 className="text-2xl font-bold text-custom-number-color">---</h6>
                        ) : (
                            <h6 className="text-2xl font-bold text-custom-number-color">
                                {dashboardStats.newJoinThisMonth}
                            </h6>
                        )}
                    </div>
                </div>

                {/* Fee Paid */}
                <div className="bg-custom-white flex flex-col gap-4 py-3 pr-4 pl-6 border rounded-lg">
                    <p className="text-custom-text-color font-medium">Fee Paid</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={imgFeePaid} alt="Fee Paid" className="w-12 h-12" />
                        <h6 className="text-2xl font-bold text-custom-number-color">---</h6>
                    </div>
                </div>

                {/* Fee Remaining */}
                <div className="bg-custom-white flex flex-col gap-4 py-3 pr-4 pl-6 border rounded-lg">
                    <p className="text-custom-text-color font-medium">Fee Remaining</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={imgFeeRemaining} alt="Fee Remaining" className="w-12 h-12" />
                        <h6 className="text-2xl font-bold text-custom-number-color">---</h6>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bar Chart for New Joins Over Last 6 Months */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-medium text-gray-800">New Joins Over Last 6 Months</h2>
                    <div className="mt-4">
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* You can add another chart here if needed */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-medium text-gray-800">Monthly Attendance</h2>
                    <div className="mt-4">
                        <Bar
                            data={{
                                labels: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                                datasets: [
                                    {
                                        label: 'Monthly Attendance',
                                        data: [60, 50, 70, 80, 40, 90, 50],
                                        backgroundColor: '#6f9bf2',
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    title: {
                                        display: true,
                                        text: 'Monthly Attendance',
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
};

    export default Dashboard;
