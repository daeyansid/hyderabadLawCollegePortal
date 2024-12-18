import React, { useEffect, useState } from 'react';
import { fetchSubjectById } from '../../../../api/subjectApi';
import Swal from 'sweetalert2';

const ViewSubjectModal = ({ id, onClose }) => {
    const [subject, setSubject] = useState(null);

    useEffect(() => {
        const loadSubject = async () => {
            try {
                const response = await fetchSubjectById(id);
                if (response) {
                    setSubject(response.data);
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Unable to fetch subject details. Please try again later.',
                });
                onClose(); // Close modal on error
            }
        };

        loadSubject();
    }, [id, onClose]);

    if (!subject) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-4 w-full">
                    <h2 className="text-2xl font-semibold text-indigo-900 mb-6">Subject Details</h2>
                    <p className="text-gray-600 mb-4">No subject data available.</p>
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-4 w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-indigo-900">Subject Details</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-lg font-semibold">✖</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-6 rounded-md shadow-sm">
                        <h3 className="text-lg font-medium text-gray-800">Subject Information</h3>
                        <div className="mt-4">
                            <span className="font-medium text-gray-600">Subject Name:</span>
                            <p className="text-gray-900 mt-1">{subject.subjectName || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-md shadow-sm">
                        <h3 className="text-lg font-medium text-gray-800">Section Information</h3>
                        <div className="mt-4">
                            <span className="font-medium text-gray-600">Section Name:</span>
                            <p className="text-gray-900 mt-1">{subject.sectionId ? subject.sectionId.sectionName : 'N/A'}</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end mt-8">
                    <button
                        onClick={onClose}
                        className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewSubjectModal;
