// Aside.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import userIcon from '../../assets/user.svg';
import usersIcon from '../../assets/users.svg';
import umbrella from '../../assets/umbrella.svg';
import overview from '../../assets/Icon (from Tabler.io).svg';
import dollarSign from '../../assets/dollar-sign.svg';
import aperture from '../../assets/aperture.svg';
import clock from '../../assets/clock.svg';
import { useAuth } from '../../AuthProvider';
import { adminName, adminEmail, machineAttendance as importedMachineAttendance, dairy as importedDairy } from '../..';

export default function Aside() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
    const [isClassSectionOpen, setIsClassSectionOpen] = useState(false);
    const [isLeaveManagementOpen, setIsLeaveManagementOpen] = useState(false);
    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [isAttendanceManagementOpen, setIsAttendanceManagementOpen] = useState(false);
    const [machineAttendance, setMachineAttendance] = useState(false);
    const [dairy, setDairy] = useState(false);

    const { logout } = useAuth();
    const { userInfo } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = (setter) => {
        setter(prev => !prev);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Convert imported strings to booleans
    useEffect(() => {
        setMachineAttendance(importedMachineAttendance === 'true');
        setDairy(importedDairy === 'true');
    }, [importedMachineAttendance, importedDairy]);

    return (
        <>
            {/* Sidebar Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-50 p-2 text-custom-blue md:hidden"
                aria-label="Toggle sidebar"
            >
                <i className="fa-solid fa-bars w-6 h-6"></i>
            </button>

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
                                <img src={overview} alt="Overview" />
                                <span className="ms-3 text-custom-blue">Overview</span>
                            </Link>
                        </li>

                        {/* User Management */}
                        <li>
                            <button
                                onClick={() => toggleMenu(setIsUserManagementOpen)}
                                className="whitespace-nowrap flex items-center p-2 text-custom-blue rounded-lg group hover:bg-gray-100 cursor-pointer w-full text-left"
                            >
                                <img src={userIcon} alt="User Management" />
                                <span className="ms-3 text-custom-blue">User Management</span>
                            </button>
                            {isUserManagementOpen && (
                                <div className="flex flex-col items-start pl-6 md:pl-8">
                                    <ul>
                                        <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-pointer p-3">
                                            <Link to="/branch-admin/user-management/staff">Admin Staff</Link>
                                        </li>
                                        <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-pointer p-3">
                                            <Link to="/branch-admin/user-management/teacher">Teacher</Link>
                                        </li>
                                        <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-pointer p-3">
                                            <Link to="/branch-admin/user-management/guardian">Guardian</Link>
                                        </li>
                                        <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-pointer p-3">
                                            <Link to="/branch-admin/user-management/student">Student</Link>
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
                                <img src={aperture} alt="Classes And Sections" />
                                <span className="ms-3 text-custom-blue">Classes And Sections</span>
                            </Link>
                        </li>

                        {/* Scheduling and Assign */}
                        <li>
                            <button
                                onClick={() => toggleMenu(setIsAssignOpen)}
                                className="flex items-center p-2 text-custom-blue rounded-lg group hover:bg-gray-100 cursor-pointer w-full text-left"
                            >
                                <img src={clock} alt="Scheduling and Assign" />
                                <span className="ms-3 text-custom-blue">Scheduling and Assign</span>
                            </button>
                            {isAssignOpen && (
                                <div className="flex flex-col items-start pl-6 md:pl-8">
                                    <ul>
                                        <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-pointer p-3">
                                            <Link to="/branch-admin/scheduleAndAssign/teacherAssign">Assign Class</Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </li>

                        {/* Leave Management */}
                        <li>
                            <button
                                onClick={() => toggleMenu(setIsLeaveManagementOpen)}
                                className="flex items-center p-2 text-custom-blue rounded-lg group hover:bg-gray-100 cursor-pointer w-full text-left"
                            >
                                <img src={umbrella} alt="Leave Management" />
                                <span className="ms-3 text-custom-blue">Leave Management</span>
                            </button>
                            {isLeaveManagementOpen && (
                                <div className="flex flex-col items-start pl-6 md:pl-8">
                                    <ul>
                                        <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-pointer p-3">
                                            <Link to="/branch-admin/user-management/view-leave-request">View Leaves Requests</Link>
                                        </li>
                                        <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-pointer p-3">
                                            <Link to="/branch-admin/user-management/apply-leave-request">Apply For Leave</Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </li>

                        {/* Payroll */}
                        <li>
                            <div
                                className="flex items-center p-2 text-custom-blue rounded-lg group hover:bg-gray-100 cursor-no-drop"
                            >
                                <img src={dollarSign} alt="Payroll Management" />
                                <span className="ms-3 text-custom-blue">Payroll Management</span>
                            </div>
                        </li>

                        {/* Attendance Management */}
                        <li>
                            <button
                                onClick={() => toggleMenu(setIsAttendanceManagementOpen)}
                                className="flex items-center p-2 text-custom-blue rounded-lg group hover:bg-gray-100 cursor-pointer w-full text-left"
                            >
                                <img src={usersIcon} alt="Attendance Management" />
                                <span className="ms-3 text-custom-blue whitespace-nowrap">Attendance Management</span>
                            </button>
                            {isAttendanceManagementOpen && (
                                <div className="flex flex-col items-start pl-6 md:pl-8">
                                    <ul>
                                        {/* Staff Attendance - Always Shows */}
                                        <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-pointer p-3">
                                            <Link to="/branch-admin/attendance/staff">Staff Attendance</Link>
                                        </li>

                                        {/* Conditional Submenus */}
                                        {machineAttendance ? (
                                            <>
                                                <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-pointer p-3">
                                                    <Link to="/branch-admin/attendance/student-subject-wise">Student Class Attendance</Link>
                                                </li>
                                                <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-no-drop p-3">
                                                    <Link to="/branch-admin/attendance/student-machine-wise">Student Machine Attendance</Link>
                                                </li>
                                            </>
                                        ) : (
                                            <li className="text-custom-blue rounded-lg group hover:bg-gray-300 cursor-pointer p-3">
                                                <Link to="/branch-admin/attendance/class-wise">Class Wise Attendance</Link>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </li>

                        {/* Fee Management */}
                        <li>
                            <div
                                className="flex items-center p-2 text-custom-blue rounded-lg group hover:bg-gray-100 cursor-no-drop"
                            >
                                <img src={dollarSign} alt="Fee Management" />
                                <span className="ms-3 text-custom-blue">Fee Management</span>
                            </div>
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
        </>
    );
}