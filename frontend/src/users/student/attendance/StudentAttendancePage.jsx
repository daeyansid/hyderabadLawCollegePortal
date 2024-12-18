// src/pages/StudentAttendancePage.jsx

import React, { useEffect, useState } from 'react';
import { getAttendanceRecords } from '../../../api/studentAttendanceApi';
import { AiOutlineCalendar, AiOutlineArrowLeft } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';

const StudentAttendancePage = () => {
    const { subjectId } = useParams(); // Get subjectId from URL
    const navigate = useNavigate(); // Hook for navigation
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch attendance records
    const fetchAttendanceRecords = async () => {
        setLoading(true);
        try {
            const data = await getAttendanceRecords(subjectId); // Pass subjectId
            console.log('Attendance Records:', data);

            if (Array.isArray(data) && data.length > 0) {
                setAttendanceRecords(data);
                setError(null);
            } else {
                setError('No attendance records found for you.');
                setAttendanceRecords([]);
            }
        } catch (error) {
            console.error('Failed to fetch attendance records:', error);
            setError(error.message || 'Failed to fetch attendance records.');
            setAttendanceRecords([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendanceRecords();
    }, [subjectId]);

    // Calculate attendance statistics
    const calculateAttendanceStats = () => {
        const stats = {
            present: 0,
            absent: 0,
            leave: 0,
        };

        attendanceRecords.forEach(record => {
            switch (record.attendanceStatus) {
                case 'Present':
                    stats.present += 1;
                    break;
                case 'Absent':
                    stats.absent += 1;
                    break;
                case 'Leave':
                    stats.leave += 1;
                    break;
                default:
                    break;
            }
        });

        return stats;
    };

    const attendanceStats = calculateAttendanceStats();

    // Handle Back Button Click
    const handleBack = () => {
        navigate(-1); // Navigate to the previous page
    };

    return (
        <div className="p-6 bg-white min-h-screen">
            {/* Back Button */}
            <div className="mb-6">
                <button
                    onClick={handleBack}
                    className="flex items-center text-indigo-700 hover:text-indigo-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                    title="Go Back"
                >
                    <AiOutlineArrowLeft className="mr-2 text-xl" />
                    Back
                </button>
            </div>

            {/* Heading */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-indigo-700">
                    Your Attendance Records
                </h2>
            </div>

            {/* Overview Section */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Present */}
                <div className="flex items-center p-4 bg-green-100 rounded-lg shadow">
                    <div className="p-3 bg-green-500 rounded-full">
                        <svg
                            className="h-6 w-6 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-700">Present</p>
                        <p className="text-2xl font-semibold text-gray-900">
                            {attendanceStats.present}
                        </p>
                    </div>
                </div>

                {/* Absent */}
                <div className="flex items-center p-4 bg-red-100 rounded-lg shadow">
                    <div className="p-3 bg-red-500 rounded-full">
                        <svg
                            className="h-6 w-6 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-700">Absent</p>
                        <p className="text-2xl font-semibold text-gray-900">
                            {attendanceStats.absent}
                        </p>
                    </div>
                </div>

                {/* Leave */}
                <div className="flex items-center p-4 bg-yellow-100 rounded-lg shadow">
                    <div className="p-3 bg-yellow-500 rounded-full">
                        <svg
                            className="h-6 w-6 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4l3 3"
                            />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-700">Leave</p>
                        <p className="text-2xl font-semibold text-gray-900">
                            {attendanceStats.leave}
                        </p>
                    </div>
                </div>
            </div>

            {/* Error Handling */}
            {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md shadow">
                    <p>{error}</p>
                </div>
            )}

            {/* Attendance Records List */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <svg
                        className="animate-spin h-12 w-12 text-indigo-600 mr-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                    </svg>
                    <span className="text-indigo-600 text-lg">Loading attendance records...</span>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {attendanceRecords.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {attendanceRecords.map((record) => (
                                <li
                                    key={record._id}
                                    className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div>
                                        <p className="text-lg font-medium text-gray-700">
                                            Date: {new Date(record.date).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Subject: {record.subjectId?.subjectName || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Status:{' '}
                                            <span
                                                className={`font-semibold ${
                                                    record.attendanceStatus === 'Present'
                                                        ? 'text-green-700 bg-green-200'
                                                        : record.attendanceStatus === 'Absent'
                                                        ? 'text-red-700 bg-red-200'
                                                        : 'text-yellow-700 bg-yellow-200'
                                                } px-2 py-1 rounded-full text-xs`}
                                            >
                                                {record.attendanceStatus}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <AiOutlineCalendar size={24} className="text-indigo-600" />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-6 text-center text-gray-500">
                            No attendance records found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );

};

export default StudentAttendancePage;
