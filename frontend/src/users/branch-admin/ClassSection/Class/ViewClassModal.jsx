import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { fetchClassById } from '../../../../api/classApi';
import moment from 'moment';

const ViewClassModal = ({ id, onClose }) => {
    const [classData, setClassData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchClassById(id);
                setClassData(data.data);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Unable to fetch class data. Please try again later.',
                });
                onClose(); // Close modal on error
            }
        };

        fetchData();
    }, [id, onClose]);

    if (!classData) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="text-center text-gray-600 bg-white p-8 rounded-lg shadow-lg">
                    No class data available.
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-indigo-900">Class Details</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
                </div>
                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div>
                        <label className="block text-gray-700 font-semibold">Class Name</label>
                        <p className="text-gray-900 border border-gray-300 p-3 rounded-md">
                            {classData.className || 'N/A'}
                        </p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Description</label>
                        <p className="text-gray-900 border border-gray-300 p-3 rounded-md">
                            {classData.description || 'N/A'}
                        </p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Created At</label>
                        <p className="text-gray-900 border border-gray-300 p-3 rounded-md">
                            {moment(classData.createdAt).format('YYYY-MM-DD')}
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ViewClassModal;
