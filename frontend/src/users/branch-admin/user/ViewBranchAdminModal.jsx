import React from 'react';
import moment from 'moment';
import { baseURL } from '../../../index';

const ViewBranchAdminModal = ({ showModal, setShowModal, admin }) => {
    if (!showModal) return null;

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOverlayClick = (e) => {
        if (e.target.id === 'modalOverlay') {
            handleCloseModal();
        }
    };

    const imageUrl = admin.photo ? `${baseURL}branchAdmin/${admin.photo}` : '';

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
            onClick={handleOverlayClick}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-full overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Branch Admin Details</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold">Full Name</label>
                        <p>{admin.fullName}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Username</label>
                        <p>{admin.userId.username}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Email</label>
                        <p>{admin.userId.email}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Phone Number</label>
                        <p>{formatPhoneNumber(admin.phoneNumber)}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">CNIC Number</label>
                        <p>{formatCnicNumber(admin.cnicNumber)}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Gender</label>
                        <p>{admin.gender}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Address</label>
                        <p>{admin.address}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Salary</label>
                        <p>{admin.salary}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Join Date</label>
                        <p>{moment(admin.joinDate).format('YYYY-MM-DD')}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Admin ID</label>
                        <p>{admin.adminId}</p>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-gray-700 font-semibold">Photo</label>
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt="Admin"
                                className="w-32 h-32 object-cover rounded-md"
                            />
                        ) : (
                            <p>No photo available</p>
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

export default ViewBranchAdminModal;
