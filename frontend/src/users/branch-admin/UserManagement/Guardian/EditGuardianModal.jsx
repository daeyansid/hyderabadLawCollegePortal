import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { fetchGuardianById, updateGuardian } from '../../../../api/guardianApi';

const EditGuardianModal = ({ showModal, setShowModal, guardianId, reloadData }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullName: '',
        relationship: '',
        workOrganisation: '',
        workStatus: '',
        cnicNumber: '',
        studentMotherName: '',
        motherCnicNumber: '',
        motherOccupation: '',
        guardianPhoneNumber: '',
        residentialAddress: '',
        workAddress: '',
        branchId: '',
        password: '', // Optional password field
    });

    useEffect(() => {
        const loadGuardianData = async () => {
            try {
                const guardianData = await fetchGuardianById(guardianId);
                setFormData({
                    username: guardianData.data.userId?.username || '',
                    email: guardianData.data.userId?.email || '',
                    fullName: guardianData.data.fullName || '',
                    relationship: guardianData.data.relationship || '',
                    workOrganisation: guardianData.data.workOrganisation || '',
                    workStatus: guardianData.data.workStatus || '',
                    cnicNumber: guardianData.data.cnicNumber || '',
                    studentMotherName: guardianData.data.studentMotherName || '',
                    motherCnicNumber: guardianData.data.motherCnicNumber || '',
                    motherOccupation: guardianData.data.motherOccupation || '',
                    guardianPhoneNumber: guardianData.data.guardianPhoneNumber || '',
                    residentialAddress: guardianData.data.residentialAddress || '',
                    workAddress: guardianData.data.workAddress || '',
                    branchId: localStorage.getItem('branchId'),
                    password: '', // Initialize password as empty
                });
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

    const formatCnicNumber = (value) => {
        const cnic = value.replace(/\D/g, ''); // Remove non-numeric characters
        if (cnic.length <= 5) {
            return cnic;
        } else if (cnic.length <= 12) {
            return `${cnic.slice(0, 5)}-${cnic.slice(5)}`;
        } else {
            return `${cnic.slice(0, 5)}-${cnic.slice(5, 12)}-${cnic.slice(12, 13)}`;
        }
    };

    const formatPhoneNumber = (value) => {
        const phone = value.replace(/\D/g, ''); // Remove non-numeric characters
        if (phone.length <= 4) {
            return phone;
        } else {
            return `${phone.slice(0, 4)}-${phone.slice(4, 11)}`;
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'cnicNumber' || name === 'motherCnicNumber') {
            setFormData({
                ...formData,
                [name]: formatCnicNumber(value),
            });
        } else if (name === 'guardianPhoneNumber') {
            setFormData({
                ...formData,
                [name]: formatPhoneNumber(value),
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // CNIC format validation: 12345-6789123-3
        const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;

        if (!cnicRegex.test(formData.cnicNumber)) {
            return Swal.fire({
                icon: 'error',
                title: 'Invalid CNIC Format',
                text: 'Please enter the CNIC in the format 12345-6789123-3',
            });
        }

        if (!cnicRegex.test(formData.motherCnicNumber)) {
            return Swal.fire({
                icon: 'error',
                title: 'Invalid Mother CNIC Format',
                text: 'Please enter the mother CNIC in the format 12345-6789123-3',
            });
        }

        try {
            const dataToSend = { ...formData };
            if (!dataToSend.password) {
                delete dataToSend.password; // Remove password if not provided
            }

            await updateGuardian(guardianId, dataToSend);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Guardian updated successfully!',
            });
            setShowModal(false);
            reloadData();
        } catch (error) {
            console.error('Error updating guardian:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message,
            });
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
                <h2 className="text-2xl font-semibold text-indigo-900 mb-6">Edit Guardian Details</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                disabled
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Relationship</label>
                            <input
                                type="text"
                                name="relationship"
                                value={formData.relationship}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Work Organization</label>
                            <input
                                type="text"
                                name="workOrganisation"
                                value={formData.workOrganisation}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Occupation</label>
                            <input
                                type="text"
                                name="workStatus"
                                value={formData.workStatus}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">CNIC Number</label>
                            <input
                                type="text"
                                name="cnicNumber"
                                value={formData.cnicNumber}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                maxLength="15"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Student Mother's Name</label>
                            <input
                                type="text"
                                name="studentMotherName"
                                value={formData.studentMotherName}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Mother's CNIC Number</label>
                            <input
                                type="text"
                                name="motherCnicNumber"
                                value={formData.motherCnicNumber}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                maxLength="15"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Mother's Occupation</label>
                            <input
                                type="text"
                                name="motherOccupation"
                                value={formData.motherOccupation}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Guardian Phone Number</label>
                            <input
                                type="text"
                                name="guardianPhoneNumber"
                                value={formData.guardianPhoneNumber}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                maxLength="12"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Residential Address</label>
                            <input
                                type="text"
                                name="residentialAddress"
                                value={formData.residentialAddress}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Work Address</label>
                            <input
                                type="text"
                                name="workAddress"
                                value={formData.workAddress}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        {/* Optional password input */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">New Password (Optional)</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditGuardianModal;
