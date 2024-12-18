import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getStaffById } from '../../../../api/staffApi';
import moment from 'moment';
import { baseURL } from '../../../../index';

const ViewStaffModal = ({ showModal, setShowModal, staffId }) => {
    const [staffData, setStaffData] = useState(null);

    useEffect(() => {
        const fetchStaffData = async () => {
            try {
                const data = await getStaffById(staffId);
                setStaffData(data.data);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response.data.message,
                });
                setShowModal(false);
            }
        };

        if (showModal && staffId) {
            fetchStaffData();
        }
    }, [staffId, showModal, setShowModal]);

    if (!showModal) return null;
    if (!staffData) {
        return (
            <div className="text-center text-gray-600">
                Loading...
            </div>
        );
    }

    // Base URL for accessing images stored on the server
    const imageUrl = staffData.photo ? `${baseURL}staff/${staffData.photo}` : '';

    // Formatting functions for CNIC and Phone Number
    const formatCnicNumber = (cnic) => {
        if (!cnic) return '';
        const cleanedCnic = cnic.replace(/\D/g, '');
        if (cleanedCnic.length === 13) {
            return `${cleanedCnic.slice(0, 5)}-${cleanedCnic.slice(5, 12)}-${cleanedCnic.slice(12)}`;
        }
        return cnic; // Return unformatted if length is not 13
    };

    const formatPhoneNumber = (phone) => {
        if (!phone) return '';
        const cleanedPhone = phone.replace(/\D/g, '');
        if (cleanedPhone.length === 11) {
            return `${cleanedPhone.slice(0, 4)}-${cleanedPhone.slice(4)}`;
        }
        return phone; // Return unformatted if length is not 11
    };

    return (
        <div
            id="modalOverlay"
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
            onClick={(e) => e.target.id === 'modalOverlay' && setShowModal(false)}
        >
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full max-h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-indigo-900">Admin Staff Details</h2>
                    <button
                        onClick={() => setShowModal(false)}
                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                    >
                        Close
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {/* Display each staff detail */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Full Name</label>
                        <p className="text-gray-900">{staffData.fullName || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">CNIC Number</label>
                        <p className="text-gray-900">{formatCnicNumber(staffData.cnicNumber) || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Phone Number</label>
                        <p className="text-gray-900">{formatPhoneNumber(staffData.phoneNumber) || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Address</label>
                        <p className="text-gray-900">{staffData.address || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Gender</label>
                        <p className="text-gray-900">{staffData.gender || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Cast</label>
                        <p className="text-gray-900">{staffData.cast || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Join Date</label>
                        <p className="text-gray-900">{moment(staffData.joinDate).format('YYYY-MM-DD')}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Basic Salary</label>
                        <p className="text-gray-900">{staffData.basicSalary || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Staff Type</label>
                        <p className="text-gray-900">{staffData.staffType || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Staff Id</label>
                        <p className="text-gray-900">{staffData.staffId || 'N/A'}</p>
                    </div>
                    <div className="mb-4 col-span-2">
                        <label className="block text-gray-700 font-semibold">Photo</label>
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt="Staff"
                                className="w-32 h-32 object-cover rounded-md"
                            />
                        ) : (
                            <p className="text-gray-900">No Photo</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewStaffModal;
