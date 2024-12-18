// src/pages/GuardianStudentDiaryPage.jsx

import React, { useEffect, useState, useCallback } from 'react';
import { getDiaryByStudentId } from '../../../api/guardianDiaryApi';
import { AiOutlineArrowLeft, AiOutlineEye } from 'react-icons/ai';
import { useNavigate, useParams } from 'react-router-dom';
import DiaryDetailModal from './DiaryDetailModal';
import debounce from 'lodash/debounce';

const GuardianStudentDiaryPage = () => {
    const navigate = useNavigate();
    const { studentId } = useParams(); // Get studentId from URL
    const [student, setStudent] = useState(null);
    const [diaries, setDiaries] = useState([]);
    const [filteredDiaries, setFilteredDiaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [error, setError] = useState(null);

    // State for Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDiary, setSelectedDiary] = useState(null);

    // Fetch diaries
    const fetchDiaries = async () => {
        setLoading(true);
        try {
            const data = await getDiaryByStudentId(studentId); // Pass studentId
            console.log('Diary Data:', data);

            if (data) {
                setStudent(data.student);
                setDiaries(data.diaryEntries);
                setFilteredDiaries(data.diaryEntries);
                setError(null);
            } else {
                setError('No diary found for this student.');
                setStudent(null);
                setDiaries([]);
                setFilteredDiaries([]);
            }
        } catch (error) {
            console.error('Failed to fetch diaries:', error);
            setError(error.message || 'Failed to fetch diary entries.');
            setStudent(null);
            setDiaries([]);
            setFilteredDiaries([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiaries();
    }, [studentId]);

    // Debounced Handle Search
    const debouncedHandleSearch = useCallback(
        debounce((value) => {
            const lowercasedValue = value.toLowerCase();
            const filtered = diaries.filter((diary) => {
                const date = new Date(diary.date).toLocaleDateString().toLowerCase();
                const subject = diary.subject?.subjectName?.toLowerCase() || '';
                const description = diary.description?.toLowerCase() || '';
                const remarks = diary.remarks?.toLowerCase() || '';

                return (
                    date.includes(lowercasedValue) ||
                    subject.includes(lowercasedValue) ||
                    description.includes(lowercasedValue) ||
                    remarks.includes(lowercasedValue)
                );
            });
            setFilteredDiaries(filtered);
        }, 300),
        [diaries]
    );

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchText(value);
        debouncedHandleSearch(value);
    };

    // Open Modal with selected diary
    const handleView = (diary) => {
        setSelectedDiary(diary);
        setIsModalOpen(true);
    };

    // Close Modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDiary(null);
    };

    // Handle Back Navigation
    const handleBack = () => {
        navigate(-1); // Navigates to the previous page
    };

    return (
        <div className="p-6 bg-white min-h-screen">
            {/* Back button with arrow */}
            <div className="flex items-center mb-6">
                <button
                    onClick={handleBack}
                    className="flex items-center text-indigo-700 hover:text-indigo-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                >
                    <AiOutlineArrowLeft className="mr-2 text-xl" /> Back
                </button>
            </div>

            {/* Student Info */}
            {student && (
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-indigo-700">
                        Diary for {student.fullName}
                    </h2>
                    <p className="text-lg text-gray-700">
                        Class: {student.classId?.className || 'N/A'}, Section: {student.sectionId?.sectionName || 'N/A'}
                    </p>
                </div>
            )}

            {/* Search Input */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by date, subject, description, remarks..."
                    value={searchText}
                    onChange={handleSearch}
                    className="p-3 border border-gray-300 rounded-md w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* Error Handling */}
            {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md shadow">
                    <p>{error}</p>
                </div>
            )}

            {/* Diary Entries List */}
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
                    <span className="text-indigo-600 text-lg">Loading diary ...</span>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {filteredDiaries.length > 0 ? (
                        <ul className="space-y-4">
                            {filteredDiaries.map((diary) => (
                                <li
                                    key={diary._id}
                                    className="flex justify-between items-center p-4 border-b border-gray-200"
                                >
                                    <div>
                                        <p className="text-lg font-medium text-gray-700">
                                            {new Date(diary.date).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Subject: {diary.subject?.subjectName || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Description: {diary.description}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Remarks: {diary.remarks || 'N/A'}
                                        </p>
                                        <p className="mt-2">
                                            <span className="font-medium text-gray-700">Assignment:</span>{' '}
                                            {diary.assignToAll ? (
                                                <span className="inline-block px-2 py-1 text-green-800 bg-green-200 rounded-full text-sm font-semibold">
                                                    Assigned to All
                                                </span>
                                            ) : (
                                                <span className="inline-block px-2 py-1 text-yellow-800 bg-yellow-200 rounded-full text-sm font-semibold">
                                                    Assigned to Student
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        {/* View Button */}
                                        <button
                                            onClick={() => handleView(diary)}
                                            className="flex items-center text-blue-600 hover:text-blue-800"
                                            title="View Diary Details"
                                        >
                                            <AiOutlineEye size={24} />
                                            <span className="ml-2">View</span>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-6 text-center text-gray-500">
                            No diary found.
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {selectedDiary && (
                <DiaryDetailModal
                    isOpen={isModalOpen}
                    diary={selectedDiary}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default GuardianStudentDiaryPage;
