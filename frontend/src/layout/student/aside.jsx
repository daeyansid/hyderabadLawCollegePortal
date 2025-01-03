import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import userIcon from '../../assets/user.svg';
import overview from '../../assets/Icon (from Tabler.io).svg';
import connection from '../../assets/connection.svg';
import { useAuth } from '../../AuthProvider';

// Add these icons from react-icons
import { 
    FaChalkboardTeacher, 
    FaMoneyBillWave, 
    FaClipboardList,
    FaUserGraduate,
    FaBullhorn,
    FaCalendarCheck
} from 'react-icons/fa';

export default function Aside({ isSidebarOpen }) {
    const [isAttendanceManagementOpen, setIsAttendanceManagementOpen] = useState(false);
    const [machineAttendance, setMachineAttendance] = useState(false);
    const [dairy, setDairy] = useState(false);

    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        // Retrieve values from localStorage
        const machineAttendanceValue = localStorage.getItem('machineAttendance');
        const dairyValue = localStorage.getItem('dairy');

        // Set state based on localStorage values
        setMachineAttendance(machineAttendanceValue === 'true');
        setDairy(dairyValue === 'true');
    }, []);

    const toggleAttendanceManagement = () => {
        setIsAttendanceManagementOpen(prevState => !prevState);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Retrieve adminName and adminEmail from localStorage
    const adminName = localStorage.getItem('adminName') || 'User';
    const adminEmail = localStorage.getItem('adminEmail') || '';

    return (
        <aside
            id="logo-sidebar"
            className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 lg:pt-24 bg-white border-r border-gray-200 transition-transform transform ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0`}
            aria-label="Sidebar"
        >
            <div className="h-full flex flex-col justify-between px-3 pb-4 overflow-y-auto bg-white">
                <ul className="space-y-2 font-medium">
                    <li>
                        <Link
                            to="/student/dashboard"
                            className="flex items-center p-2 text-custom-blue rounded-lg group hover:bg-gray-100 cursor-pointer"
                        >
                            <FaChalkboardTeacher className="w-5 h-5 text-indigo-600" />
                            <span className="ml-3 text-custom-blue">Overview</span>
                        </Link>
                    </li>

                    {/* Attendance Management */}
                    <li>
                        <button
                            onClick={toggleAttendanceManagement}
                            className="flex items-center p-2 text-custom-blue rounded-lg group hover:bg-gray-100 cursor-pointer w-full text-left"
                        >
                            <FaCalendarCheck className="w-5 h-5 text-green-600" />
                            <span className="ml-3 text-custom-blue">Attendance Management</span>
                            <svg className={`w-3 h-3 transform ${isAttendanceManagementOpen ? 'rotate-180' : ''}`} 
                                fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        </button>

                        {isAttendanceManagementOpen && (
                            <div className="flex flex-col items-start pl-6 md:pl-8">
                                <ul>
                                    {machineAttendance ? (
                                        <>
                                            <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-pointer p-3">
                                                <Link to="/student/view-subjects">
                                                    Student Subject Attendance
                                                </Link>
                                            </li>
                                            <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-no-drop p-3">
                                                <Link to="#">
                                                    Student Machine Attendance
                                                </Link>
                                            </li>
                                            <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-pointer p-3">
                                                <Link to="/student/view-attendance-single">
                                                    Class Wise Attendance
                                                </Link>
                                            </li>
                                        </>
                                    ) : (
                                        <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-pointer p-3">
                                            <Link to="/student/view-attendance-single">
                                                Class Wise Attendance
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </li>

                    {/* Notice Management */}
                    {dairy && (
                        <li>
                            <Link
                                to="/student/dairy"
                                className="flex items-center p-2 text-custom-blue rounded-lg group hover:bg-gray-100 cursor-pointer"
                            >
                                <FaBullhorn className="w-5 h-5 text-yellow-600" />
                                <span className="ml-3 text-custom-blue">Notice</span>
                            </Link>
                        </li>
                    )}

                    {/* Assigned Classes */}
                    <li>
                        <Link
                            to="/student/assigned-classes"
                            className="flex items-center p-2 text-custom-blue rounded-lg group hover:bg-gray-100 cursor-pointer"
                        >
                            <FaUserGraduate className="w-5 h-5 text-purple-600" />
                            <span className="ml-3 text-custom-blue">Assigned Classes</span>
                        </Link>
                    </li>

                    {/* Fee */}
                    <li>
                        <Link
                            to="/student/fee"
                            className="flex items-center p-2 text-custom-blue rounded-lg group hover:bg-gray-100 cursor-pointer"
                        >
                            <FaMoneyBillWave className="w-5 h-5 text-emerald-600" />
                            <span className="ml-3 text-custom-blue">Fee</span>
                        </Link>
                    </li>

                    {/* Test */}
                    <li>
                        <Link
                            to="/student/test"
                            className="flex items-center p-2 text-custom-blue rounded-lg group hover:bg-gray-100 cursor-pointer"
                        >
                            <FaClipboardList className="w-5 h-5 text-blue-600" />
                            <span className="ml-3 text-custom-blue">Test</span>
                        </Link>
                    </li>
                </ul>

                {/* User Info and Logout */}
                <div className="mt-4 border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between space-x-4">
                        <div className="flex items-center space-x-4">
                            <img className="w-10 h-10 rounded-full" src={userIcon} alt="User Image" />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900">{adminName}</span>
                                <span className="text-xs text-gray-500">{adminEmail}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-red-500 hover:text-red-600 flex items-center"
                            aria-label="Logout"
                        >
                            <i className="fa-solid fa-right-from-bracket text-xl"></i>
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
