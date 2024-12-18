import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { fetchGuardianById } from '../../../../api/guardianApi';
import moment from 'moment';

const ViewGuardianModal = ({ showModal, setShowModal, guardianId }) => {
    const [guardianData, setGuardianData] = useState(null);

    useEffect(() => {
        const loadGuardianData = async () => {
            try {
                const data = await fetchGuardianById(guardianId);
                setGuardianData(data.data);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response.data.message,
                });
                setShowModal(false);
            }
        };

        if (showModal && guardianId) {
            loadGuardianData();
        }
    }, [guardianId, showModal, setShowModal]);

    if (!showModal || !guardianData) return null;

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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
                <h2 className="text-2xl font-semibold text-indigo-900 mb-6">Guardian Details</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Username</label>
                        <p className="text-gray-900">{guardianData.userId?.username || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Email</label>
                        <p className="text-gray-900">{guardianData.userId?.email || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Full Name</label>
                        <p className="text-gray-900">{guardianData.fullName || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Relationship</label>
                        <p className="text-gray-900">{guardianData.relationship || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Work Organisation</label>
                        <p className="text-gray-900">{guardianData.workOrganisation || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Occupation</label>
                        <p className="text-gray-900">{guardianData.workStatus || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">CNIC Number</label>
                        <p className="text-gray-900">{formatCnicNumber(guardianData.cnicNumber) || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Student Mother's Name</label>
                        <p className="text-gray-900">{guardianData.studentMotherName || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Mother's CNIC Number</label>
                        <p className="text-gray-900">{formatCnicNumber(guardianData.motherCnicNumber) || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Mother's Occupation</label>
                        <p className="text-gray-900">{guardianData.motherOccupation || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Guardian Phone Number</label>
                        <p className="text-gray-900">{formatPhoneNumber(guardianData.guardianPhoneNumber) || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Residential Address</label>
                        <p className="text-gray-900">{guardianData.residentialAddress || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Work Address</label>
                        <p className="text-gray-900">{guardianData.workAddress || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Joined On</label>
                        <p className="text-gray-900">{moment(guardianData.createdAt).format('YYYY-MM-DD')}</p>
                    </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewGuardianModal;
