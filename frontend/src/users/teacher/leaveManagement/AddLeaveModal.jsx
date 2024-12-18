import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { createLeave } from '../../../api/teacherLeaveApi';

const AddLeaveModal = ({ showModal, setShowModal, reloadLeaves }) => {
    const [formData, setFormData] = useState({
        leaveReason: '',
        leaveStartDate: '',
        leaveEndDate: '',
        description: '',
        doc: null,
        totalLeaveDays: 0,
    });
    const [fileError, setFileError] = useState('');

    // Maximum file size (5 MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    // Fetch teacherId and branchId from localStorage
    const teacherId = localStorage.getItem('adminSelfId');
    const branchId = localStorage.getItem('branchId');

    // Handle input change for form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Automatically calculate total leave days if both dates are filled
        if (name === 'leaveStartDate' || name === 'leaveEndDate') {
            const startDate = new Date(name === 'leaveStartDate' ? value : formData.leaveStartDate);
            const endDate = new Date(name === 'leaveEndDate' ? value : formData.leaveEndDate);

            if (startDate && endDate && startDate <= endDate) {
                const totalLeaveDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
                setFormData((prevData) => ({ ...prevData, totalLeaveDays }));
            } else {
                setFormData((prevData) => ({ ...prevData, totalLeaveDays: 0 }));
            }
        }
    };

    // Handle file input change with validation
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                setFileError('File size exceeds 5MB.');
                setFormData({ ...formData, doc: null });
                return;
            }

            if (!file.name.toLowerCase().endsWith('.pdf')) {
                setFileError('Only PDF files are allowed.');
                setFormData({ ...formData, doc: null });
                return;
            }

            // If valid, set the file
            setFileError('');
            setFormData({ ...formData, doc: file });
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure there are no file errors before submitting
        if (fileError) {
            Swal.fire({
                icon: 'error',
                title: 'File Error',
                text: fileError,
            });
            return;
        }

        try {
            const leaveData = {
                ...formData,
                teacherId,
                branchId,
            };

            await createLeave(leaveData);
            Swal.fire({
                icon: 'success',
                title: 'Leave request created successfully!',
            });
            setShowModal(false); // Close modal after submission
            reloadLeaves(); // Reload leaves after submission
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to create leave request. Please try again.',
            });
        }
    };

    // Reset the form when modal closes
    const resetForm = () => {
        setFormData({
            leaveReason: '',
            leaveStartDate: '',
            leaveEndDate: '',
            description: '',
            doc: null,
            totalLeaveDays: 0,
        });
        setFileError('');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    const handleOverlayClick = (e) => {
        if (e.target.id === 'modalOverlay') {
            handleCloseModal();
        }
    };

    useEffect(() => {
        if (!showModal) {
            resetForm();
        }
    }, [showModal]);

    if (!showModal) return null;

    return (
        <div
            id="modalOverlay"
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleOverlayClick}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full overflow-y-auto max-h-full"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Add New Leave</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Leave Reason</label>
                        <select
                            name="leaveReason"
                            value={formData.leaveReason}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        >
                            <option value="">Select Leave Reason</option>
                            <option value="Casual Leave">Casual Leave</option>
                            <option value="Sick Leave">Sick Leave</option>
                            <option value="Half Day Leave">Half Day Leave</option>
                            <option value="Short Time Leave">Short Time Leave</option>
                            <option value="Hajj Leave">Hajj Leave</option>
                            <option value="Official Work Leave">Official Work Leave</option>
                            <option value="Personal Work Leave">Personal Work Leave</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Start Date</label>
                        <input
                            type="date"
                            name="leaveStartDate"
                            value={formData.leaveStartDate}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">End Date</label>
                        <input
                            type="date"
                            name="leaveEndDate"
                            value={formData.leaveEndDate}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Total Leave Days</label>
                        <input
                            type="number"
                            name="totalLeaveDays"
                            value={formData.totalLeaveDays}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            disabled
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            rows="3"
                            placeholder="Enter additional information (optional)"
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Upload Document (optional)</label>
                        <input
                            type="file"
                            name="doc"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                        {fileError && <p className="text-red-500 mt-2">{fileError}</p>}
                    </div>
                    <div className="flex justify-end space-x-4">
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
                            Submit Leave Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddLeaveModal;
