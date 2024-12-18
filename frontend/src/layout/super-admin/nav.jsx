// src/components/Nav.jsx

import React, { useState, useRef, useEffect } from 'react';
import logo from '../../assets/logo.png';
import 'font-awesome/css/font-awesome.min.css';
import { useNavigate } from 'react-router-dom';
import { username, userRole } from '../../index'; // Ensure these are correctly exported from '../../index'
import userIcon from '../../assets/user.svg';
import { useAuth } from '../../AuthProvider';
import { getBranchAdminsWithUserData } from '../../api/branchAdminUserApi';

export default function Nav() {
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [branchAdminDropdownOpen, setBranchAdminDropdownOpen] = useState(false);
    const userDropdownRef = useRef(null);
    const branchAdminDropdownRef = useRef(null);
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [branchAdmins, setBranchAdmins] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(localStorage.getItem('userId'));
    const [errorErrorData, setErrorErrorData] = useState([]);

    const toggleUserDropdown = () => {
        setUserDropdownOpen(prev => !prev);
    };

    const toggleBranchAdminDropdown = () => {
        setBranchAdminDropdownOpen(prev => !prev);
    };

    const handleClickOutside = (event) => {
        if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
            setUserDropdownOpen(false);
        }
        if (branchAdminDropdownRef.current && !branchAdminDropdownRef.current.contains(event.target)) {
            setBranchAdminDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const goToDashboard = () => {
        navigate('/super-admin/dashboard');
    };

    // Fetch branch admins on component mount
    useEffect(() => {
        const fetchBranchAdmins = async () => {
            try {
                const response = await getBranchAdminsWithUserData();
                // Map and store data in localStorage as 'errorError'
                const data = response.data.map((admin, index) => ({
                    userId: admin.userId.toString(), // Ensure this is a string
                    email: admin.email,
                    userTokenTemp: admin.userTokenTemp,
                    userRole: admin.userRole,
                    fullName: admin.fullName || `Admin ${index}`, // Ensure 'fullName' exists
                    // Include other fields from BranchAdmin model as needed
                }));

                // Log fetched data for debugging
                console.log('Fetched Branch Admins:', data);

                localStorage.setItem('errorError', JSON.stringify(data));
                setErrorErrorData(data);
                setBranchAdmins(data);
            } catch (error) {
                console.error('Error fetching branch admins:', error);
            }
        };

        fetchBranchAdmins();
    }, []);

    const handleSwitch = (userId) => {
        // Update the selected userId in localStorage
        localStorage.setItem('userId', userId);
        setSelectedUserId(userId);

        // Retrieve 'errorError' data from localStorage
        const storedData = JSON.parse(localStorage.getItem('errorError')) || [];

        // Find the selected user's data
        let selectedUser = storedData.find(user => user.userId === userId);

        // If switching to Super Admin, retrieve data from superAdminData
        if (!selectedUser && userId === superAdminData.userId) {
            selectedUser = superAdminData;
        }

        if (selectedUser) {
            console.log('Switched to user:');
            console.log('Email:', selectedUser.email);
            console.log('Password (userTokenTemp):', selectedUser.userTokenTemp);
        } else {
            console.log('Selected user data not found.');
        }

        // Optional: Refresh the page or perform additional actions after switching
    };

    // Get super admin data from localStorage or context
    const superAdminData = {
        userId: 'superAdmin', // Unique identifier for super admin
        fullName: localStorage.getItem('adminName') || 'Super Admin',
        email: localStorage.getItem('adminEmail') || 'superadmin@example.com',
        userRole: localStorage.getItem('userRole') || 'superAdmin',
    };

    return (
        <nav className="fixed top-0 z-50 w-full flex rounded-lg border-b border-gray-200 bg-white shadow">
            <div className="bg-custom-backGround w-64 rounded-l-lg">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <a href="#" className="flex items-center ms-2 md:me-24">
                            <img src={logo} className="h-12 w-12 me-3" alt="Logo" />
                            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-custom-blue">Blue Jays</span>
                        </a>
                    </div>
                </div>
            </div>
            <div className="bg-custom-backGround-content flex-1 rounded-r-lg">
                <div className="px-3 py-3 lg:px-5 lg:pl-3 flex items-center justify-end">
                    {/* Branch Admins Dropdown */}
                    <div className="relative mr-4">
                        <button
                            type="button"
                            className="flex items-center text-sm bg-gray-800 rounded-full focus:ring-2 focus:ring-gray-300"
                            aria-expanded={branchAdminDropdownOpen}
                            onClick={toggleBranchAdminDropdown}
                        >
                            <span className="sr-only">Open branch admins menu</span>
                            <img className="w-8 h-8 rounded-full bg-white" src={userIcon} alt="Branch Admins" />
                        </button>
                        {branchAdminDropdownOpen && (
                            <div ref={branchAdminDropdownRef} className="absolute right-0 top-14 mt-2 w-80 bg-white rounded-lg shadow-lg z-40 max-h-96 overflow-y-auto">
                                <div className="px-4 py-3 border-b">
                                    <p className="text-lg font-semibold text-gray-700">Switch User</p>
                                </div>
                                <ul className="divide-y">
                                    {/* Super Admin Data */}
                                    <li key="super-admin" className="px-4 py-3 flex items-center">
                                        <div className="flex-shrink-0">
                                            <img className="w-10 h-10 rounded-full bg-gray-200" src={userIcon} alt="Super Admin" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">{superAdminData.fullName}</p>
                                            <p className="text-sm text-gray-500">{superAdminData.email}</p>
                                        </div>
                                        <div className="ml-auto">
                                            {selectedUserId === superAdminData.userId ? (
                                                <span className="text-green-600 font-semibold">Selected</span>
                                            ) : (
                                                <button
                                                    onClick={() => handleSwitch(superAdminData.userId)}
                                                    className="text-blue-600 hover:text-blue-800 font-semibold"
                                                >
                                                    Switch
                                                </button>
                                            )}
                                        </div>
                                    </li>
                                    {/* Branch Admins List */}
                                    {branchAdmins.map((admin, index) => (
                                        <li key={`admin-${index}`} className="px-4 py-3 flex items-center">
                                            <div className="flex-shrink-0">
                                                <img className="w-10 h-10 rounded-full bg-gray-200" src={userIcon} alt={admin.fullName} />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">{admin.fullName}</p>
                                                <p className="text-sm text-gray-500">{admin.email}</p>
                                            </div>
                                            <div className="ml-auto">
                                                {selectedUserId === admin.userId ? (
                                                    <span className="text-green-600 font-semibold">Selected</span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleSwitch(admin.userId)}
                                                        className="text-blue-600 hover:text-blue-800 font-semibold"
                                                    >
                                                        Switch
                                                    </button>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* User Dropdown */}
                    <div className="relative">
                        <button
                            type="button"
                            className="flex items-center text-sm bg-gray-800 rounded-full focus:ring-2 focus:ring-gray-300"
                            aria-expanded={userDropdownOpen}
                            onClick={toggleUserDropdown}
                        >
                            <span className="sr-only">Open user menu</span>
                            <img className="w-8 h-8 rounded-full bg-white" src={userIcon} alt="User" />
                        </button>
                        {userDropdownOpen && (
                            <div ref={userDropdownRef} className="absolute right-0 top-14 mt-2 w-48 bg-white rounded-lg shadow-lg z-40">
                                <div className="px-4 py-3 border-b">
                                    <p className="text-sm text-gray-900">{username}</p>
                                    <p className="text-sm text-gray-500">{userRole}</p>
                                </div>
                                <ul className="py-1">
                                    <li>
                                        <button
                                            onClick={goToDashboard}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Dashboard
                                        </button>
                                    </li>
                                    <li>
                                        <a href="#" className="cursor-not-allowed block px-4 py-2 text-sm text-gray-400 hover:bg-gray-100">Settings</a>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
