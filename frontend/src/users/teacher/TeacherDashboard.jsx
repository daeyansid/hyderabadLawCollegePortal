import React, { useEffect, useState } from 'react';
import { useAuth } from '../../AuthProvider';
import img3 from '../../assets/present.png';
import img4 from '../../assets/emp.png';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { getTeacherDashboardData } from '../../api/teacherApi';

ChartJS.register(CategoryScale, LinearScale, BarElement);

const TeacherDashboard = () => {
    const { userInfo } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const teacherId = localStorage.getItem('adminSelfId');
                const branchId = localStorage.getItem('branchId');
                const data = await getTeacherDashboardData(teacherId, branchId);
                setDashboardData(data);
            } catch (error) {
                console.error('Error fetching teacher dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, []);

    const barChartData = {
        labels: ['Assigned Classes', 'Today\'s Attendance'],
        datasets: [
            {
                label: 'Teacher Statistics',
                data: dashboardData ? [
                    dashboardData.totalAssignedClasses,
                    dashboardData.todayAttendance ? 1 : 0
                ] : [0, 0],
                backgroundColor: ['#4F46E5', dashboardData?.todayAttendance?.attendanceStatus === 'Present' ? '#16a34a' : '#dc2626'],
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                <div className="bg-custom-white flex flex-col gap-4 py-3 pr-4 pl-6 border rounded-lg">
                    <p className="text-custom-text-color font-medium">Total Assigned Classes</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={img4} alt="Total Assigned Classes" className="w-12 h-12" />
                        <h6 className="text-2xl font-bold text-custom-number-color">
                            {dashboardData ? dashboardData.totalAssignedClasses : '---'}
                        </h6>
                    </div>
                </div>
                <div className="bg-custom-white flex flex-col gap-4 py-3 pr-4 pl-6 border rounded-lg">
                    <p className="text-custom-text-color font-medium">Today's Attendance</p>
                    <div className="flex flex-row gap-3 items-center">
                        <img src={img3} alt="Attendance Status" className="w-12 h-12" />
                        <h6 className={`text-2xl font-bold ${
                            dashboardData?.todayAttendance?.attendanceStatus === 'Present' 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                            {dashboardData?.todayAttendance 
                                ? dashboardData.todayAttendance.attendanceStatus 
                                : 'Not Marked'}
                        </h6>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="mt-8">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-medium text-gray-800">Teacher Statistics</h2>
                    <div className="mt-4">
                        <Bar 
                            data={barChartData} 
                            options={{
                                responsive: true,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: { stepSize: 1 }
                                    }
                                }
                            }} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
