// frontend/src/users/student/StudentAssignClassDays.jsx

import React, { useEffect, useState } from 'react';
import { getAllBranchClassDays } from '../../../api/branchClassDaysApi';
import { AiOutlineArrowRight, AiOutlineEye } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const StudentAssignClassDays = () => {
    const [days, setDays] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Define the order of days in a week
    const weekDaysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Fetch all available days
    const fetchAvailableDays = async () => {
        try {
            const response = await getAllBranchClassDays();
            
            if (!Array.isArray(response)) {
                throw new Error('Invalid data format received from API.');
            }

            // Sort the days based on the defined week order
            const sortedDays = response.sort((a, b) => {
                const dayAIndex = weekDaysOrder.indexOf(a.day);
                const dayBIndex = weekDaysOrder.indexOf(b.day);

                // Handle days not found in weekDaysOrder
                if (dayAIndex === -1 && dayBIndex === -1) return 0;
                if (dayAIndex === -1) return 1;
                if (dayBIndex === -1) return -1;

                return dayAIndex - dayBIndex;
            });

            setDays(sortedDays);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch available days:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAvailableDays();
    }, []);

    // Navigate to view day details
    const handleView = (dayId) => {
        navigate(`/student/assigned-classes/slots/${dayId}`);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Assigned Days</h2>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <svg
                        className="animate-spin h-10 w-10 text-indigo-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span className="ml-2 text-indigo-600">Loading available days...</span>
                </div>
            ) : (
                <ul className="space-y-4">
                    {days.map((day) => (
                        <li
                            key={day._id}
                            className="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-sm"
                        >
                            <span className="text-lg font-medium text-gray-700">{day.day}</span>
                            <div className="flex items-center space-x-4">
                                {/* View Button */}
                                <button
                                    onClick={() => handleView(day._id)}
                                    className="flex items-center text-blue-600 hover:text-blue-800"
                                    title="View Day Details"
                                >
                                    <AiOutlineEye size={24} />
                                    <span className="ml-2">View Slots</span>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default StudentAssignClassDays;