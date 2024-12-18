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
            setError(err.response?.data?.message || 'Failed to fetch diary data.');
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
                    <p>Loading...</p>
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
                    <p>Error: {error}</p>
                    <button onClick={handleCloseModal} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 mt-4">
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
                className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-full overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Diary Details</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold">Date</label>
                        <p>{moment(diaryData.date).format('YYYY-MM-DD')}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Subject</label>
                        <p>{diaryData.subject?.subjectName || 'N/A'}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Class</label>
                        <p>{diaryData.class?.className || 'N/A'}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Section</label>
                        <p>{diaryData.section?.sectionName || 'N/A'}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Assign To All</label>
                        <p>{diaryData.assignToAll ? 'Yes' : 'No'}</p>
                    </div>
                    {!diaryData.assignToAll && (
                        <div className="col-span-2">
                            <label className="block text-gray-700 font-semibold">Assigned Students</label>
                            <ul className="list-disc list-inside">
                                {diaryData.assignedStudents && diaryData.assignedStudents.length > 0 ? (
                                    diaryData.assignedStudents.map((student) => (
                                        <li key={student._id}>{student.fullName} ({student.rollNumber})</li>
                                    ))
                                ) : (
                                    <li>No students assigned</li>
                                )}
                            </ul>
                        </div>
                    )}
                    <div className="col-span-2">
                        <label className="block text-gray-700 font-semibold">Description</label>
                        <p>{diaryData.description}</p>
                    </div>
                    {diaryData.remarks && (
                        <div className="col-span-2">
                            <label className="block text-gray-700 font-semibold">Remarks</label>
                            <p>{diaryData.remarks}</p>
                        </div>
                    )}
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        type="button"
                        onClick={handleCloseModal}
                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewDiaryModal;
