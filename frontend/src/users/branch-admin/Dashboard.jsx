// src/pages/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../AuthProvider';
import imgTeacher from '../../assets/teacher.png';
import imgStaff from '../../assets/staff.png';
import imgPresent from '../../assets/present.png';
import imgEmployee from '../../assets/emp.png';
import imgAssignClasses from '../../assets/class.png';
import imgFeePaid from '../../assets/fee.png';
import imgFeeRemaining from '../../assets/re-fee.png';
import { getBranchAdminDashboardStats } from '../../api/branchAdminDashboardApi';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
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
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Update the formatCurrency function
const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "---";
    return new Intl.NumberFormat('ur-PK', {
        style: 'currency',
        currency: 'PKR',
        maximumFractionDigits: 0
    }).format(amount);
};

const Dashboard = () => {
    const { userInfo } = useAuth();
    const [dashboardStats, setDashboardStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        assignClassesToday: 0,
        teacherAttendance: {
            totalPresent: 0,
            totalAbsent: 0,
            totalLeave: 0,
            attendancePercentage: 0,
        },
        feeStatistics: {
            totalFeesExpected: 0,
            totalFeesPaid: 0,
            totalFeesRemaining: 0,
            totalLateFees: 0,
            totalPenalties: 0,
            totalDiscount: 0,
        },
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            setLoading(true);
            try {
                const data = await getBranchAdminDashboardStats();
                // console.log("dashboard data", data); // Corrected typo in console log
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
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${formatCurrency(value)}`;
                    }
                }
            }
        },
        maintainAspectRatio: false, // Allows chart to resize based on container
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => formatCurrency(value),
                },
            },
        },
    };

    const feeChartData = {
        labels: [
            'Expected',
            'Paid',
            'Remaining',
            'Late Fees',
            'Penalties',
            'Discounts',
        ],
        datasets: [
            {
                label: 'Fee Statistics',
                data: loading
                    ? []
                    : [
                        dashboardStats.feeStatistics?.totalFeesExpected,
                        dashboardStats.feeStatistics?.totalFeesPaid,
                        dashboardStats.feeStatistics?.totalFeesRemaining,
                        dashboardStats.feeStatistics?.totalLateFees,
                        dashboardStats.feeStatistics?.totalPenalties,
                        dashboardStats.feeStatistics?.totalDiscount,
                    ],
                backgroundColor: [
                    '#4B70E2',
                    '#48BB78',
                    '#F56565',
                    '#ED8936',
                    '#9F7AEA',
                    '#38B2AC',
                ],
                borderWidth: 1,
            },
        ],
    };

    const attendanceChartData = {
        labels: ['Present', 'Absent', 'Leave'],
        datasets: [
            {
                data: loading
                    ? []
                    : [
                        dashboardStats.teacherAttendance?.totalPresent || 0,
                        dashboardStats.teacherAttendance?.totalAbsent || 0,
                        dashboardStats.teacherAttendance?.totalLeave || 0,
                    ],
                backgroundColor: ['#48BB78', '#F56565', '#ECC94B'],
            },
        ],
    };

    return (
        <div className="container mx-auto px-4">
            {/* Welcome Section */}
            <div className="mb-4">
                <p className="text-custom-blue text-lg md:text-xl">
                    Welcome Back <b>{userInfo.branchTypeAdmin}</b> Branch Admin, <b>{userInfo.adminName}</b>
                </p>
                <p className="text-gray-500 text-sm md:text-base">
                    Track your Analytics and Manage your School Teacher and Staff
                </p>
            </div>

            {/* Error Handling */}
            {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md shadow">
                    <p>{error}</p>
                </div>
            )}

            {/* Teacher Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-4">
                {/* Total Teachers */}
                <div className="bg-custom-white flex flex-col gap-4 py-3 px-4 border rounded-lg">
                    <p className="text-custom-text-color font-medium">Total Teachers</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={imgTeacher} alt="Total Teacher" className="w-12 h-12 object-contain" />
                        <h6 className="text-2xl font-bold text-custom-number-color">
                            {loading ? '---' : dashboardStats.totalTeachers}
                        </h6>
                    </div>
                </div>

                {/* Present Today */}
                <div className="bg-custom-white flex flex-col gap-4 py-3 px-4 border rounded-lg">
                    <p className="text-custom-text-color font-medium">Present Today</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={imgPresent} alt="Present" className="w-12 h-12 object-contain" />
                        <h6 className="text-2xl font-bold text-custom-number-color">
                            {loading ? '---' : dashboardStats.teacherAttendance?.totalPresent}
                        </h6>
                    </div>
                </div>

                {/* On Leave */}
                <div className="bg-custom-white flex flex-col gap-4 py-3 px-4 border rounded-lg">
                    <p className="text-custom-text-color font-medium">On Leave</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={imgEmployee} alt="Leave" className="w-12 h-12 object-contain" />
                        <h6 className="text-2xl font-bold text-custom-number-color">
                            {loading ? '---' : dashboardStats.teacherAttendance?.totalLeave}
                        </h6>
                    </div>
                </div>

                {/* Attendance Percentage */}
                <div className="bg-custom-white flex flex-col gap-4 py-3 px-4 border rounded-lg">
                    <p className="text-custom-text-color font-medium">Attendance %</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={imgStaff} alt="Attendance" className="w-12 h-12 object-contain" />
                        <h6 className="text-2xl font-bold text-custom-number-color">
                            {loading ? '---' : `${dashboardStats.teacherAttendance?.attendancePercentage}%`}
                        </h6>
                    </div>
                </div>
            </div>

            {/* Student and Fee Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-4">
                {/* Total Students */}
                <div className="bg-custom-white flex flex-col gap-4 py-3 px-4 border rounded-lg">
                    <p className="text-custom-text-color font-medium">Total Students</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={imgAssignClasses} alt="Students" className="w-12 h-12 object-contain" />
                        <h6 className="text-2xl font-bold text-custom-number-color">
                            {loading ? '---' : dashboardStats.totalStudents}
                        </h6>
                    </div>
                </div>

                {/* Total Fees Expected */}
                <div className="bg-custom-white flex flex-col gap-4 py-3 px-4 border rounded-lg">
                    <p className="text-custom-text-color font-medium">Total Fees Expected</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={imgFeePaid} alt="Expected Fees" className="w-12 h-12 object-contain" />
                        <h6 className="text-2xl font-bold text-custom-number-color">
                            {loading
                                ? '---'
                                : formatCurrency(dashboardStats.feeStatistics?.totalFeesExpected)}
                        </h6>
                    </div>
                </div>

                {/* Fees Paid */}
                <div className="bg-custom-white flex flex-col gap-4 py-3 px-4 border rounded-lg">
                    <p className="text-custom-text-color font-medium">Fees Paid</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={imgFeePaid} alt="Paid Fees" className="w-12 h-12 object-contain" />
                        <h6 className="text-2xl font-bold text-custom-number-color">
                            {loading
                                ? '---'
                                : formatCurrency(dashboardStats.feeStatistics?.totalFeesPaid)}
                        </h6>
                    </div>
                </div>

                {/* Fees Remaining */}
                <div className="bg-custom-white flex flex-col gap-4 py-3 px-4 border rounded-lg">
                    <p className="text-custom-text-color font-medium">Fees Remaining</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={imgFeeRemaining} alt="Remaining Fees" className="w-12 h-12 object-contain" />
                        <h6 className="text-2xl font-bold text-custom-number-color">
                            {loading
                                ? '---'
                                : formatCurrency(dashboardStats.feeStatistics?.totalFeesRemaining)}
                        </h6>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Fee Statistics Chart */}
                <div className="bg-white p-4 rounded-lg shadow-md flex flex-col h-full">
                    <h2 className="text-lg font-medium text-gray-800">Fee Statistics</h2>
                    <div className="mt-4 flex-1">
                        <div className="h-64 md:h-full">
                            <Bar
                                data={feeChartData}
                                options={chartOptions}
                            />
                        </div>
                    </div>
                </div>

                {/* Teacher Attendance Chart */}
                <div className="bg-white p-4 rounded-lg shadow-md flex flex-col h-full">
                    <h2 className="text-lg font-medium text-gray-800">Today's Teacher Attendance</h2>
                    <div className="mt-4 flex-1">
                        <div className="h-64 md:h-full">
                            {!loading && dashboardStats.teacherAttendance && (
                                <Pie
                                    data={attendanceChartData}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: function (context) {
                                                        const label = context.label || '';
                                                        const value = context.raw || 0;
                                                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                                        const percentage = total ? Math.round((value / total) * 100) : 0;
                                                        return `${label}: ${value} (${percentage}%)`;
                                                    }
                                                }
                                            }
                                        },
                                    }}
                                />
                            )}
                            {loading && <div className="text-center py-8">Loading...</div>}
                            {!loading && (!dashboardStats.teacherAttendance ||
                                (dashboardStats.teacherAttendance.totalPresent === 0 &&
                                    dashboardStats.teacherAttendance.totalAbsent === 0 &&
                                    dashboardStats.teacherAttendance.totalLeave === 0)) && (
                                    <div className="text-center py-8">No attendance data available for today</div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default Dashboard;
