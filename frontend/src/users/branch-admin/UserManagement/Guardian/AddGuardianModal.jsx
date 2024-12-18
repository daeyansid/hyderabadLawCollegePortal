import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { createGuardian } from '../../../../api/guardianApi';

const AddGuardianModal = ({ showModal, setShowModal, reloadData }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        userRole: 'guardian',
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
    });

    useEffect(() => {
        const branchId = localStorage.getItem('branchId');
        if (branchId) {
            setFormData((prevState) => ({
                ...prevState,
                branchId,
            }));
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Branch ID is missing. Please try again later.',
            });
            setShowModal(false);
        }
    }, [setShowModal]);

    const formatCnicNumber = (value) => {
        const cnic = value.replace(/\D/g, '');
        if (cnic.length <= 5) {
            return cnic;
        } else if (cnic.length <= 12) {
            return `${cnic.slice(0, 5)}-${cnic.slice(5)}`;
        } else {
            return `${cnic.slice(0, 5)}-${cnic.slice(5, 12)}-${cnic.slice(12, 13)}`;
        }
    };

    const formatPhoneNumber = (value) => {
        const phone = value.replace(/\D/g, '');
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

        // CNIC format: 12345-6789123-3
        const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;

        if (!cnicRegex.test(formData.cnicNumber)) {
            return Swal.fire({
                icon: 'error',
                title: 'Invalid Guardian CNIC Format',
                text: 'Please enter the guardian CNIC in the format 12345-6789123-3',
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
            await createGuardian(formData);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Guardian created successfully!',
            });
            reloadData();
            handleCloseModal();
        } catch (error) {
            console.error('Error creating guardian:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message,
            });
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            username: '',
            password: '',
            email: '',
            userRole: 'guardian',
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
        });
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
                <h2 className="text-2xl font-semibold text-indigo-900 mb-6">Add New Guardian</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-3 gap-4">
                        {/* Form Fields */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
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
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddGuardianModal;
