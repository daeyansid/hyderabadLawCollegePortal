// src/components/diaryManagement/ViewDiaryModal.jsx

import React, { useEffect, useState } from 'react';
import { getDiaryById } from '../../../api/diaryApi';
import moment from 'moment';
import Swal from 'sweetalert2';

const ViewDiaryModal = ({ showModal, setShowModal, diaryId }) => {
    const [diaryData, setDiaryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch diary data from API
    const fetchDiaryData = async () => {
        try {
            const data = await getDiaryById(diaryId);
            setDiaryData(data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch notice data.');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (showModal && diaryId) {
            fetchDiaryData();
        }
    }, [showModal, diaryId]);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOverlayClick = (e) => {
        if (e.target.id === 'modalOverlay') {
            handleCloseModal();
        }
    };

    if (!showModal) return null;

    if (loading) {
        return (
            <div
                id="modalOverlay"
                className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
                onClick={handleOverlayClick}
            >
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                    <p className="text-center text-gray-500 text-lg">Loading notice details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                id="modalOverlay"
                className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
                onClick={handleOverlayClick}
            >
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                    <p className="text-center text-red-600 text-lg">Error: {error}</p>
                    <button onClick={handleCloseModal} className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 mt-4 w-full">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            id="modalOverlay"
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleOverlayClick}
        >
            <div
                className="bg-white p-6 rounded-lg h-[500px] shadow-lg max-w-3xl w-full max-h-full overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-3xl font-bold text-indigo-800 mb-6 border-b pb-2">Notice Details</h2>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-medium">Date</label>
                        <p className="text-gray-600">{moment(diaryData.date).format('YYYY-MM-DD')}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">Subject</label>
                        <p className="text-gray-600">{diaryData.subject?.subjectName || 'N/A'}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">Semester</label>
                        <p className="text-gray-600">{diaryData.class?.className || 'N/A'}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">Assign To All</label>
                        <p className="text-gray-600">{diaryData.assignToAll ? 'Yes' : 'No'}</p>
                    </div>
                    {!diaryData.assignToAll && (
                        <div className="col-span-2">
                            <label className="block text-gray-700 font-medium">Assigned Students</label>
                            <ul className="list-disc list-inside bg-gray-100 p-4 rounded-md">
                                {diaryData.assignedStudents && diaryData.assignedStudents.length > 0 ? (
                                    diaryData.assignedStudents.map((student) => (
                                        <li key={student._id} className="text-gray-600">
                                            {student.fullName} ({student.rollNumber})
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-600">No students assigned</li>
                                )}
                            </ul>
                        </div>
                    )}
                    <div className="col-span-2">
                        <label className="block text-gray-700 font-medium">Description</label>
                        <p className="text-gray-600 bg-gray-50 p-4 rounded-md">{diaryData.description}</p>
                    </div>
                    {diaryData.remarks && (
                        <div className="col-span-2">
                            <label className="block text-gray-700 font-medium">Remarks</label>
                            <p className="text-gray-600 bg-gray-50 p-4 rounded-md">{diaryData.remarks}</p>
                        </div>
                    )}
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        type="button"
                        onClick={handleCloseModal}
                        className="bg-indigo-500 text-white py-2 px-6 rounded-md hover:bg-indigo-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewDiaryModal;
