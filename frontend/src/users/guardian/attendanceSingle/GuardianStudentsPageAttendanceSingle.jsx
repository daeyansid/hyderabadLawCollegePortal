// src/pages/GuardianStudentsPageAttendanceSingle.jsx

import React, { useEffect, useState } from 'react';
import { getStudentsByGuardian } from '../../../api/guardianStudentsApi';
import { AiOutlineEye, AiOutlineArrowLeft } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const GuardianStudentsPageAttendanceSingle = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch students
    const fetchStudents = async () => {
        setLoading(true);
        try {
            const data = await getStudentsByGuardian();
            console.log('Students Data:', data);

            if (Array.isArray(data) && data.length > 0) {
                setStudents(data);
                setError(null);
            } else {
                setError('No students found for this guardian.');
                setStudents([]);
            }
        } catch (error) {
            console.error('Failed to fetch students:', error);
            setError(error.message || 'Failed to fetch students.');
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Handle View Student Attendance
    const handleView = (studentId) => {
        // Navigate to attendance page for the selected student
        navigate(`/guardian/select-student-attendance-single/${studentId}`);
    };

    return (
        <div className="p-6 bg-white min-h-screen">

            {/* Heading */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-indigo-700">
                    Select Your Children for Attendance
                </h2>
            </div>

            {/* Error Handling */}
            {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md shadow">
                    <p>{error}</p>
                </div>
            )}

            {/* Students List */}
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
                    <span className="text-indigo-600 text-lg">Loading students...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {students.length > 0 ? (
                        students.map((student) => (
                            <div
                                key={student._id}
                                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-700">
                                        {student.fullName}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Class: {student.classId?.className || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Section: {student.sectionId?.sectionName || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Roll Number: {student.rollNumber}
                                    </p>
                                </div>
                                <div className="mt-4">
                                    <button
                                        onClick={() => handleView(student._id)}
                                        className="flex items-center text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                                        title="View Attendance"
                                    >
                                        <AiOutlineEye size={20} />
                                        <span className="ml-2 text-sm font-medium">View Attendance</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full p-6 text-center text-gray-500">
                            No students found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GuardianStudentsPageAttendanceSingle;
