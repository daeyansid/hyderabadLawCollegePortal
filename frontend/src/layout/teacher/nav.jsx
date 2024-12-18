import React, { useState, useRef, useEffect } from 'react';
import logo from '../../assets/logo.png';
import 'font-awesome/css/font-awesome.min.css';
import { useNavigate } from 'react-router-dom';
import { username } from '../../index';
import userIcon from '../../assets/user.svg';
import { useAuth } from '../../AuthProvider';

export default function Nav({ toggleSidebar }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { logout } = useAuth();

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
        navigate('/teacher/dashboard');
    };

    return (
        <nav className="fixed top-0 z-50 w-full flex items-center justify-between bg-custom-backGround border-b border-gray-200 p-4 lg:p-2">
            {/* Logo Section */}
            <div className="flex items-center justify-between w-full lg:w-full md:w-full sm:w-64">
                <a href="#" className="flex items-center">
                    <img src={logo} className="h-10 w-10 sm:h-12 sm:w-12" alt="School Logo" />
                    <span className="ml-2 text-lg sm:text-xl font-semibold text-custom-blue whitespace-nowrap">
                        Blue Jays
                    </span>
                </a>

                {/* Hamburger and Profile Icon for Mobile Screens */}
                <div className="flex items-center">
                    {/* Hamburger Menu */}
                    <button
                        type="button"
                        className="text-custom-blue p-2 lg:hidden md:hidden"
                        aria-label="Toggle navigation"
                        onClick={toggleSidebar}
                    >
                        <i className="fa-solid fa-bars w-6 h-6"></i>
                    </button>

                    {/* Profile Icon */}
                    <button
                        type="button"
                        className="ml-4 flex items-center text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
                        aria-expanded={dropdownOpen}
                        onClick={toggleDropdown}
                    >
                        <span className="sr-only">Open user menu</span>
                        <img className="w-8 h-8 rounded-full bg-white" src={userIcon} alt="user photo" />
                    </button>

                    {dropdownOpen && (
                        <div ref={dropdownRef} className="absolute right-0 top-14 mt-2 w-48 bg-white divide-y divide-gray-100 rounded shadow-lg z-40">
                            <div className="px-4 py-3">
                                <p className="text-sm text-gray-900">{username}</p>
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
        </nav>
    );
}
