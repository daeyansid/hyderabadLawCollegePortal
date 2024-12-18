// src/pages/StudentSubjectsPage.jsx

import React, { useEffect, useState } from 'react';
import { getSubjects } from '../../../api/studentSubjectApi';
import { AiOutlineEye } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const StudentSubjectsPage = () => {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch subjects
    const fetchSubjects = async () => {
        setLoading(true);
        try {
            const data = await getSubjects();
            console.log('Subjects Data:', data);

            if (Array.isArray(data) && data.length > 0) {
                setSubjects(data);
                setError(null);
            } else {
                setError('No subjects found for your class and section.');
                setSubjects([]);
            }
        } catch (error) {
            console.error('Failed to fetch subjects:', error);
            setError(error.message || 'Failed to fetch subjects.');
            setSubjects([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    // Handle View Subject Details
    const handleView = (subjectId) => {
        // Navigate to attendance page for the selected subject
        navigate(`/student/view-attendance/${subjectId}`);
    };

    return (
        <div className="p-6 bg-white min-h-screen">
            {/* Heading */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-indigo-700">
                    Your Subjects
                </h2>
                {/* Optional: Add a button to refresh or add subjects */}
            </div>

            {/* Error Handling */}
            {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md shadow">
                    <p>{error}</p>
                </div>
            )}

            {/* Subjects List */}
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
                    <span className="text-indigo-600 text-lg">Loading subjects...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.length > 0 ? (
                        subjects.map((subject) => (
                            <div
                                key={subject._id}
                                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="text-xl font-semibold">
                                        {subject.subjectName}
                                    </h3>
                                    {/* Add more subject details here if needed */}
                                </div>
                                <div className="mt-4">
                                    <button
                                        onClick={() => handleView(subject._id)}
                                        className="flex items-center text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                                        title="View Attendance for this Subject"
                                    >
                                        <AiOutlineEye size={20} />
                                        <span className="ml-2 text-sm font-medium">View Attendance</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full p-6 text-center">
                            No subjects found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );

};

export default StudentSubjectsPage;