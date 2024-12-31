import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthProvider';
import {
    FaChalkboardTeacher,
    FaBuilding,
    FaUserTie,
    FaUserGraduate,
    FaChalkboard,
    FaBullhorn,
    FaMoneyBillWave,
    FaClipboardList,
    FaUserClock,
    FaSignOutAlt,
    FaUserCircle,
    FaUniversity,
    FaUsers,
    FaUserCheck,
    FaClock,
    FaRegMoneyBillAlt,
    FaClipboardCheck,
} from 'react-icons/fa';

export default function Aside({ isSidebarOpen }) { // Receive isSidebarOpen as a prop
    // Removed internal isSidebarOpen state
    const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
    const [isNoticeManagementOpen, setIsNoticeManagementOpen] = useState(false);
    const [IsBranchAdminManagementOpen, setIsBranchAdminManagementOpen] = useState(false);
    const [isClassSectionOpen, setIsClassSectionOpen] = useState(false);
    const [isLeaveManagementOpen, setIsLeaveManagementOpen] = useState(false);
    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [isFeeOpen, setIsFeeOpen] = useState(false);
    const [isTestOpen, setIsTestOpen] = useState(false);
    const [isAttendanceManagementOpen, setIsAttendanceManagementOpen] = useState(false);
    const [machineAttendance, setMachineAttendance] = useState(false);
    const [dairy, setDairy] = useState(false);

    const { logout, userInfo } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = (setter) => {
        setter(prev => !prev);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Convert imported strings to booleans
    useEffect(() => {
        setMachineAttendance(machineAttendance === 'true');
        setDairy(dairy === 'true');
    }, [machineAttendance, dairy]);

    return (
        <>
            {/* Sidebar Toggle Button (optional if you want a toggle inside the sidebar) */}
            {/* <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-50 p-2 text-custom-blue md:hidden"
                aria-label="Toggle sidebar"
            >
                {/* Add an icon or text here */}
            {/* </button> */}

            {/* Sidebar */}
            <aside
                id="logo-sidebar"
                className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform md:translate-x-0 md:w-64 md:block bg-white border-r border-gray-200 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:!translate-x-0`}
                aria-label="Sidebar"
            >
                <div className="h-full flex flex-col justify-between px-3 pb-4 overflow-y-auto bg-white">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <Link
                                to="/branch-admin/dashboard"
                                className="flex items-center p-2 text-custom-blue rounded-lg group hover:bg-gray-100 cursor-pointer"
                            >
                                <FaChalkboardTeacher className="w-5 h-5 text-indigo-600" />
                                <span className="ms-3 text-custom-blue">Overview</span>
                            </Link>
                        </li>

                        {/* Branch and Admin */}
                        <li>
                            <button
                                onClick={() => toggleMenu(setIsBranchAdminManagementOpen)}
                                className="whitespace-nowrap flex items-center p-2 text-custom-blue rounded-lg group hover:bg-gray-100 cursor-pointer w-full text-left"
                            >
                                <FaUniversity className="w-5 h-5 text-purple-600" />
                                <span className="ms-3 text-custom-blue">Branch & Admin</span>
                                <svg className={`w-3 h-3 transform ${IsBranchAdminManagementOpen ? 'rotate-180' : ''}`} 
                                    fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                            </button>
                            {IsBranchAdminManagementOpen && (
                                <div className="flex flex-col items-start pl-6 md:pl-8">
                                    <ul>
                                        <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-pointer p-3">
                                            <Link to="/branch-admin/branch" className="flex items-center">
                                                <FaBuilding className="w-4 h-4 text-purple-500" />
                                                <span className="ml-2">Branch</span>
                                            </Link>
                                        </li>
                                        <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-pointer p-3">
                                            <Link to="/branch-admin/user" className="flex items-center">
                                                <FaUserTie className="w-4 h-4 text-purple-500" />
                                                <span className="ml-2">Admin</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </li>

                        {/* User Management */}
                        <li>
                            <button
                                onClick={() => toggleMenu(setIsUserManagementOpen)}
                                className="whitespace-nowrap flex items-center p-2 text-custom-blue rounded-lg group hover:bg-gray-100 cursor-pointer w-full text-left"
                            >
                                <FaUsers className="w-5 h-5 text-blue-600" />
                                <span className="ms-3 text-custom-blue">User Management</span>
                                <svg className={`w-3 h-3 transform ${isUserManagementOpen ? 'rotate-180' : ''}`} 
                                    fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                            </button>
                            {isUserManagementOpen && (
                                <div className="flex flex-col items-start pl-6 md:pl-8">
                                    <ul>
                                        <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-pointer p-3">
                                            <Link to="/branch-admin/user-management/teacher" className="flex items-center">
                                                <FaChalkboardTeacher className="w-4 h-4 text-blue-500" />
                                                <span className="ml-2">Teacher</span>
                                            </Link>
                                        </li>
                                        <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-pointer p-3">
                                            <Link to="/branch-admin/user-management/student" className="flex items-center">
                                                <FaUserGraduate className="w-4 h-4 text-blue-500" />
                                                <span className="ml-2">Student</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </li>

                        {/* Classes And Sections */}
                        <li>
                            <Link
                                to="/branch-admin/class-section"
                                className="flex items-center p-2 text-custom-blue rounded-lg group hover:bg-gray-100 cursor-pointer"
                            >
                                <FaChalkboard className="w-5 h-5 text-green-600" />
                                <span className="ms-3 text-custom-blue">Classes And Sections</span>
                            </Link>
                        </li>

                        {/* Scheduling and Assign */}
                        <li>
                            <button
                                onClick={() => toggleMenu(setIsAssignOpen)}
                                className="flex items-center p-2 text-custom-blue rounded-lg group hover:bg-gray-100 cursor-pointer w-full text-left"
                            >
                                <FaClock className="w-5 h-5 text-yellow-600" />
                                <span className="ms-3 text-custom-blue">Scheduling and Assign</span>
                            </button>
                            {isAssignOpen && (
                                <div className="flex flex-col items-start pl-6 md:pl-8">
                                    <ul>
                                        <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-pointer p-3">
                                            <Link to="/branch-admin/scheduleAndAssign/teacherAssign" className="flex items-center">
                                                <FaChalkboardTeacher className="w-4 h-4 text-yellow-500" />
                                                <span className="ml-2">Assign Class</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </li>

                        {/* Notice Management */}
                        <li>
                            <button
                                onClick={() => toggleMenu(setIsNoticeManagementOpen)}
                                className="whitespace-nowrap flex items-center p-2 text-custom-blue rounded-lg group hover:bg-gray-100 cursor-pointer w-full text-left"
                            >
                                <FaBullhorn className="w-5 h-5 text-red-600" />
                                <span className="ms-3 text-custom-blue">Notice</span>
                                <svg className={`w-3 h-3 transform ${isNoticeManagementOpen ? 'rotate-180' : ''}`} 
                                    fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                            </button>
                            {isNoticeManagementOpen && (
                                <div className="flex flex-col items-start pl-6 md:pl-8">
                                    <ul>
                                        <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-pointer p-3">
                                            <Link to="/branch-admin/notice-teacher" className="flex items-center">
                                                <FaBullhorn className="w-5 h-5 text-red-600" />
                                                <span className="ml-2">Teacher Notice</span>
                                            </Link>
                                        </li>
                                        <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-pointer p-3">
                                            <Link to="/branch-admin/notice" className="flex items-center">
                                                <FaBullhorn className="w-5 h-5 text-red-600" />
                                                <span className="ml-2">Student Notice</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </li>

                        {/* Fee Management */}
                        <li>
                            <button
                                onClick={() => toggleMenu(setIsFeeOpen)}
                                className="flex items-center p-2 text-custom-blue rounded-lg group hover:bg-gray-100 cursor-pointer w-full text-left"
                            >
                                <FaRegMoneyBillAlt className="w-5 h-5 text-green-600" />
                                <span className="ms-3 text-custom-blue">Fees</span>
                            </button>
                            {isFeeOpen && (
                                <div className="flex flex-col items-start pl-6 md:pl-8">
                                    <ul>
                                        <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-pointer p-3">
                                            <Link to="/branch-admin/fee-meta" className="flex items-center">
                                                <FaMoneyBillWave className="w-5 h-5 text-green-600" />
                                                <span className="ml-2">Semester Fee Details</span>
                                            </Link>
                                        </li>
                                        <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-pointer p-3">
                                            <Link to="/branch-admin/fee-management" className="flex items-center">
                                                <FaRegMoneyBillAlt className="w-5 h-5 text-green-600" />
                                                <span className="ml-2">Fee Management</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </li>

                        {/* Test Management */}
                        <li>
                            <button
                                onClick={() => toggleMenu(setIsTestOpen)}
                                className="flex items-center p-2 text-custom-blue rounded-lg group hover:bg-gray-100 cursor-pointer w-full text-left"
                            >
                                <FaClipboardCheck className="w-5 h-5 text-blue-600" />
                                <span className="ms-3 text-custom-blue">Test Management</span>
                            </button>
                            {isTestOpen && (
                                <div className="flex flex-col items-start pl-6 md:pl-8">
                                    <ul>
                                        <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-pointer p-3">
                                            <Link to="/branch-admin/test-management" className="flex items-center">
                                                <FaClipboardList className="w-5 h-5 text-blue-600" />
                                                <span className="ml-3 text-custom-blue">Test Management</span>
                                            </Link>
                                        </li>
                                        <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-pointer p-3">
                                            <Link to="/branch-admin/test-marks-sheet" className="flex items-center">
                                                <FaClipboardCheck className="w-5 h-5 text-blue-600" />
                                                <span className="ml-3 text-custom-blue">Test Marks Sheet</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </li>

                        {/* Attendance Management */}
                        <li>
                            <button
                                onClick={() => toggleMenu(setIsAttendanceManagementOpen)}
                                className="flex items-center p-2 text-custom-blue rounded-lg group hover:bg-gray-100 cursor-pointer w-full text-left"
                            >
                                <FaUserCheck className="w-5 h-5 text-teal-600" />
                                <span className="ms-3 text-custom-blue whitespace-nowrap">Attendance Management</span>
                                <svg className={`w-3 h-3 transform ${isAttendanceManagementOpen ? 'rotate-180' : ''}`} 
                                    fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                            </button>
                            {isAttendanceManagementOpen && (
                                <div className="flex flex-col items-start pl-6 md:pl-8">
                                    <ul>
                                        {/* Staff Attendance - Always Shows */}
                                        <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-pointer p-3">
                                            <Link to="/branch-admin/attendance/staff" className="flex items-center">
                                                <FaUserClock className="w-4 h-4 text-teal-500" />
                                                <span className="ml-2">Staff Attendance</span>
                                            </Link>
                                        </li>

                                        {/* Conditional Submenus */}
                                        {machineAttendance ? (
                                            <>
                                                <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-pointer p-3">
                                                    <Link to="/branch-admin/attendance/student-subject-wise" className="flex items-center">
                                                        <FaUserClock className="w-4 h-4 text-teal-500" />
                                                        <span className="ml-2">Student Class Attendance</span>
                                                    </Link>
                                                </li>
                                                <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-pointer p-3">
                                                    <Link to="/branch-admin/attendance/student-machine-wise" className="flex items-center">
                                                        <FaUserClock className="w-4 h-4 text-teal-500" />
                                                        <span className="ml-2">Student Machine Attendance</span>
                                                    </Link>
                                                </li>
                                            </>
                                        ) : (
                                            <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-pointer p-3">
                                                <Link to="/branch-admin/attendance/select-teacher" className="flex items-center">
                                                    <FaUserClock className="w-4 h-4 text-teal-500" />
                                                    <span className="ml-2">Class Wise Attendance</span>
                                                </Link>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </li>
                    </ul>

                    {/* User Info and Logout */}
                    <div className="mt-4 border-t border-gray-200 pt-4">
                        <div className="flex items-center justify-between space-x-4">
                            <div className="flex items-center space-x-4">
                                <FaUserCircle className="w-10 h-10 text-gray-400" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-900">{userInfo?.adminName || 'User Name'}</span>
                                    <span className="text-xs text-gray-500">{userInfo?.email || 'user@example.com'}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-red-500 hover:text-red-600 flex items-center"
                                aria-label="Logout"
                            >
                                <FaSignOutAlt className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
