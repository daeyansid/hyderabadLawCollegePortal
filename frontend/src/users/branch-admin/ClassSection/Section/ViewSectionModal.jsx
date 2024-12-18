import React, { useState, useEffect } from 'react';
import { fetchSectionById } from '../../../../api/sectionApi';
import Swal from 'sweetalert2';
import moment from 'moment';

const ViewSectionModal = ({ id, onClose }) => {
    const [section, setSection] = useState(null);

    useEffect(() => {
        const loadSection = async () => {
            try {
                const data = await fetchSectionById(id);
                setSection(data.data);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Unable to fetch section details. Please try again later.',
                });
                onClose(); // Close modal on error
            }
        };

        loadSection();
    }, [id, onClose]);

    if (!section) {
        return <div className="text-center text-gray-600">No section data available.</div>;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-indigo-900">Section Details</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">General Information</h3>
                        <div>
                            <label className="block text-gray-600 font-medium">Section Name</label>
                            <p className="text-gray-900">{section.sectionName || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="block text-gray-600 font-medium">Max Number of Students</label>
                            <p className="text-gray-900">{section.maxNoOfStudents || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="block text-gray-600 font-medium">Room Number</label>
                            <p className="text-gray-900">{section.roomNumber || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Dates and Associations</h3>
                        <div>
                            <label className="block text-gray-600 font-medium">Start Date</label>
                            <p className="text-gray-900">{moment(section.startDate).format('MMMM D, YYYY')}</p>
                        </div>
                        <div>
                            <label className="block text-gray-600 font-medium">End Date</label>
                            <p className="text-gray-900">{moment(section.endDate).format('MMMM D, YYYY')}</p>
                        </div>
                        <div>
                            <label className="block text-gray-600 font-medium">Class Name</label>
                            <p className="text-gray-900">{section.classId ? section.classId.className : 'N/A'}</p>
                        </div>
                        <div>
                            <label className="block text-gray-600 font-medium">Branch Name</label>
                            <p className="text-gray-900">{section.branchId ? section.branchId.branchName : 'N/A'}</p>
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

export default ViewSectionModal;
