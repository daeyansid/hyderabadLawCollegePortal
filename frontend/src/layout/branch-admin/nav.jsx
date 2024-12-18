import React, { useState, useRef, useEffect } from 'react';
import logo from '../../assets/logo.png';
import 'font-awesome/css/font-awesome.min.css';
import { useNavigate } from 'react-router-dom';
import { adminName } from '../../index';
import userIcon from '../../assets/user.svg';
import { useAuth } from '../../AuthProvider';
import { Link } from 'react-router-dom';

export default function Nav() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { userInfo } = useAuth();

    const toggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
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
        navigate('/branch-admin/dashboard');
    };

    return (
        <nav className="fixed top-0 z-50 w-full flex rounded-lg border-b border-gray-200">
            <div className="bg-custom-backGround w-64 rounded-l-lg">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <a href="#" className="flex items-center ms-2 md:me-24">
                            <img src={logo} className="h-12 w-12 me-3" alt="FlowBite Logo" />
                            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-custom-blue">Blue Jays</span>
                        </a>
                    </div>
                </div>
            </div>
            <div className="bg-custom-backGround-content flex-1 rounded-r-lg">
                <div className="px-3 py-3 lg:px-5 lg:pl-3 flex items-center justify-end">
                    <button
                        type="button"
                        className="flex items-center text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
                        aria-expanded={dropdownOpen}
                        onClick={toggleDropdown}
                    >
                        <span className="sr-only">Open user menu</span>
                        <img className="w-8 h-8 rounded-full bg-white" src={userIcon} alt="user photo" />
                    </button>
                    {dropdownOpen && (
                        <div ref={dropdownRef} className="absolute right-0 top-14 mt-2 w-48 bg-white divide-y divide-gray-100 rounded shadow-lg dark:bg-gray-700 dark:divide-gray-600 z-40">
                            <div className="px-4 py-3">
                                <p className="text-sm text-gray-900 dark:text-white">{userInfo.adminName}</p>
                            </div>
                            <ul className="py-1">
                                <li>
                                    <button
                                        onClick={goToDashboard}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                                    >
                                        Dashboard
                                    </button>
                                </li>
                                <li>
                                    <Link
                                        to="/branch-admin/scheduleAndAssign/day"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                                    >
                                        Settings
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
