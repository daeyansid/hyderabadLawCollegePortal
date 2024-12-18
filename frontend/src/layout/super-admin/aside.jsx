import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import userIcon from '../../assets/user.svg';
import overview from '../../assets/Icon (from Tabler.io).svg';
import connection from '../../assets/connection.svg';
import { username, adminEmail } from '../..';
import { useAuth } from '../../AuthProvider';

export default function Aside() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navigate = useNavigate();
    const { logout } = useAuth();
    const { userInfo } = useAuth();

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };
    
    const handleLogout = () => {
        logout();
        navigate('/login');
    };


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
                                to="/super-admin/dashboard"
                                className="flex items-center p-2 text-custom-blue rounded-lg group hover:bg-gray-100 cursor-pointer"
                            >
                                <img src={overview} alt="Overview" />
                                <span className="ms-3 text-custom-blue">Overview</span>
                            </Link>
                        </li>

                        {/* User Management */}
                        <li>
                            <Link
                                to="/super-admin/user"
                                className="flex items-center p-2 text-custom-blue rounded-lg group hover:bg-gray-100 cursor-pointer"
                            >
                                <img src={userIcon} />
                                <span className="ms-3 text-custom-blue">User Management</span>
                            </Link>
                        </li>


                        {/* Branch Management */}
                        <li>
                            <Link
                                to="/super-admin/branch"
                                className="flex items-center p-2 text-custom-blue rounded-lg group hover:bg-gray-100 cursor-pointer"
                            >
                                <img src={connection} />
                                <span className="ms-3 text-custom-blue">Branch Management</span>
                            </Link>
                        </li>

                        {/* Leave Management */}
                        <li>
                            <Link
                                to="/super-admin/leave"
                                className="flex items-center p-2 text-custom-blue rounded-lg group hover:bg-gray-100 cursor-pointer"
                            >
                                <img src={connection} />
                                <span className="ms-3 text-custom-blue">Leave Management</span>
                            </Link>
                        </li>

                        {/* Holiday Management */}
                        <li>
                            <Link
                                to="/super-admin/holiday"
                                className="flex items-center p-2 text-custom-blue rounded-lg group hover:bg-gray-100 cursor-pointer"
                            >
                                <img src={connection} />
                                <span className="ms-3 text-custom-blue">Holiday Management</span>
                            </Link>
                        </li>
                    </ul>

                    {/* User Info and Logout */}
                    <div className="mt-4 border-t border-gray-200 pt-4">
                        <div className="flex items-center justify-between space-x-4">
                            <div className="flex items-center space-x-4">
                                <img className="w-10 h-10 rounded-full" src={userIcon} alt="User Image" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-900">{userInfo.adminName}</span>
                                    <span className="text-xs text-gray-500">{userInfo.adminEmail}</span>
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
