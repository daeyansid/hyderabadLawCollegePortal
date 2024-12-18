// components/users/teacher/TeacherDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../AuthProvider';
import img1 from '../../assets/teacher.png';
import img2 from '../../assets/staff.png';
import img3 from '../../assets/present.png';
import img4 from '../../assets/emp.png';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { getTeacherDashboardData } from '../../api/teacherApi';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const TeacherDashboard = () => {
    const { userInfo } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        const hasReloaded = sessionStorage.getItem('hasReloaded');
        if (!hasReloaded) {
            sessionStorage.setItem('hasReloaded', 'true');
            window.location.reload();
        }

        const fetchDashboardData = async () => {
            try {
                const teacherId = localStorage.getItem('adminSelfId');
                const branchId = localStorage.getItem('branchId');
                const data = await getTeacherDashboardData(teacherId, branchId);
                setDashboardData(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching teacher dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, []);

    // Prepare data for charts
    const dataBar = {
        labels: ['Approved', 'Rejected', 'Pending'],
        datasets: [
            {
                label: 'Leave Status',
                data: dashboardData
                    ? [
                        dashboardData.totalLeavesApproved,
                        dashboardData.totalLeavesRejected,
                        dashboardData.totalLeavesPending,
                    ]
                    : [0, 0, 0],
                backgroundColor: ['#16a34a', '#dc2626', '#f59e0b'],
            },
        ],
    };

    const dataLine = {
        labels: ['Assigned Classes'],
        datasets: [
            {
                label: 'Total Assigned Classes',
                data: dashboardData ? [dashboardData.totalAssignedClasses] : [0],
                borderColor: '#4F46E5',
                backgroundColor: '#6f9bf2',
                fill: true,
            },
        ],
    };

    return (
        <div className="container mx-auto px-4">
            <div className="mb-4">
                <p className="text-custom-blue text-lg md:text-xl">
                    Welcome Back <b>{userInfo.branchTypeAdmin}</b> Teacher, <b>{userInfo.adminName}</b>
                </p>
            </div>

            {/* Grid for Analytics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-4">
                <div className="bg-custom-white flex flex-col gap-4 py-3 pr-4 pl-6 border rounded-lg">
                    <p className="text-custom-text-color font-medium">Total Leaves Approved</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={img1} alt="Total Leaves Approved" className="w-12 h-12" />
                        <h6 className="text-2xl font-bold text-custom-number-color">
                            {dashboardData ? dashboardData.totalLeavesApproved : '---'}
                        </h6>
                    </div>
                </div>
                <div className="bg-custom-white flex flex-col gap-4 py-3 pr-4 pl-6 border rounded-lg">
                    <p className="text-custom-text-color font-medium">Total Leaves Rejected</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={img2} alt="Total Leaves Rejected" className="w-12 h-12" />
                        <h6 className="text-2xl font-bold text-custom-number-color">
                            {dashboardData ? dashboardData.totalLeavesRejected : '---'}
                        </h6>
                    </div>
                </div>
                <div className="bg-custom-white flex flex-col gap-4 py-3 pr-4 pl-6 border rounded-lg">
                    <p className="text-custom-text-color font-medium">Total Leaves Pending</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={img3} alt="Total Leaves Pending" className="w-12 h-12" />
                        <h6 className="text-2xl font-bold text-custom-number-color">
                            {dashboardData ? dashboardData.totalLeavesPending : '---'}
                        </h6>
                    </div>
                </div>
                <div className="bg-custom-white flex flex-col gap-4 py-3 pr-4 pl-6 border rounded-lg">
                    <p className="text-custom-text-color font-medium">Total Assigned Classes</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={img4} alt="Total Assigned Classes" className="w-12 h-12" />
                        <h6 className="text-2xl font-bold text-custom-number-color">
                            {dashboardData ? dashboardData.totalAssignedClasses : '---'}
                        </h6>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-medium text-gray-800">Leave Status</h2>
                    <div className="mt-4">
                        <Bar data={dataBar} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-medium text-gray-800">Assigned Classes</h2>
                    <div className="mt-4">
                        <Line data={dataLine} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
