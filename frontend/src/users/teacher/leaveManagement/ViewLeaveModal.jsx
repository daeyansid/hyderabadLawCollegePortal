import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { getLeaveById } from '../../../api/teacherLeaveApi';
import { baseURLDoc } from '../../../index'; // Ensure this is correctly imported
import Swal from 'sweetalert2';

const ViewLeaveModal = ({ showModal, setShowModal, leaveId }) => {
    const [leaveData, setLeaveData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch leave data from API
    const fetchLeaveData = async () => {
        try {
            const data = await getLeaveById(leaveId);
            setLeaveData(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (showModal && leaveId) {
            fetchLeaveData();
        }
    }, [showModal, leaveId]);

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
                    <button onClick={handleCloseModal} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    // Correctly extract and construct the document URL
    const documentUrl = leaveData?.doc
        ? `${baseURLDoc}docs/${leaveData.doc.replace(/\\/g, '/').split('/').pop()}`
        : '';
    console.log("documentUrl", documentUrl);

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
                <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Leave Details</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold">Leave Reason</label>
                        <p>{leaveData.leaveReason}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Start Date</label>
                        <p>{moment(leaveData.leaveStartDate).format('YYYY-MM-DD')}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">End Date</label>
                        <p>{moment(leaveData.leaveEndDate).format('YYYY-MM-DD')}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Total Leave Days</label>
                        <p>{leaveData.totalLeaveDays}</p>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-gray-700 font-semibold">Description</label>
                        <p>{leaveData.description || 'No description provided'}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Status</label>
                        <p>{leaveData.status}</p>
                    </div>

                    {/* Show the PDF document link if available */}
                    <div className="col-span-2">
                        <label className="block text-gray-700 font-semibold">Document</label>
                        {leaveData.doc ? (
                            <a
                                href={documentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                            >
                                View PDF Document
                            </a>
                        ) : (
                            <p>Document not attached</p>
                        )}
                    </div>
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

export default ViewLeaveModal;