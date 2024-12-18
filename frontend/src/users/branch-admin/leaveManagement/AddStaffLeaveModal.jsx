import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { createStaffLeave } from '../../../api/staffLeaveApi'; // API call for creating staff leave
import { fetchStaff } from '../../../api/staffApi'; // Use your existing staffApi to fetch staff

const AddStaffLeaveModal = ({ showModal, setShowModal, reloadLeaves }) => {
    const [formData, setFormData] = useState({
        staffId: '',
        leaveStartDate: '',
        leaveEndDate: '',
        leaveReason: '',
        description: '',
        doc: null, // File input for document upload
    });
    const [totalLeaveDays, setTotalLeaveDays] = useState(0); // State to store total leave days
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true); 

    // Fetch branchId from localStorage
    const branchId = localStorage.getItem('branchId');

    // Fetch staff data using the `fetchStaff` API
    const fetchStaffData = async () => {
        try {
            const staffData = await fetchStaff(); 

            // Check if the response contains the expected data
            if (staffData && Array.isArray(staffData.data)) {
                setStaff(staffData.data);
            } else {
                throw new Error('Staff data is not in the expected format.');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching staff data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch staff data.',
            });
            setLoading(false);
        }
    };

    useEffect(() => {
        if (showModal) {
            fetchStaffData(); // Fetch staff data when modal is shown
        }
    }, [showModal]);

    // Calculate the total number of leave days based on start and end date
    const calculateTotalLeaveDays = (startDate, endDate) => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const timeDiff = end.getTime() - start.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // Add 1 to include both start and end date
            setTotalLeaveDays(daysDiff > 0 ? daysDiff : 0); // Ensure total leave days is at least 0
        } else {
            setTotalLeaveDays(0);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Recalculate total leave days when start or end date changes
        if (name === 'leaveStartDate' || name === 'leaveEndDate') {
            const newStartDate = name === 'leaveStartDate' ? value : formData.leaveStartDate;
            const newEndDate = name === 'leaveEndDate' ? value : formData.leaveEndDate;
            calculateTotalLeaveDays(newStartDate, newEndDate);
        }
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, doc: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const leaveData = { ...formData, branchId }; // Add branchId from localStorage to the formData

        try {
            await createStaffLeave(leaveData); // Call the API to create staff leave
            Swal.fire({
                icon: 'success',
                title: 'Leave request created successfully!',
            });
            setShowModal(false); // Close the modal
            reloadLeaves(); // Reload the leave data after submission
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to create leave request. Please try again.',
            });
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    if (!showModal) return null;

    return (
        <div
            id="modalOverlay"
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
            onClick={(e) => {
                if (e.target.id === 'modalOverlay') handleCloseModal();
            }}
        >
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Add Staff Leave</h2>
                <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto">
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Staff Name</label>
                        {loading ? (
                            <p>Loading staff...</p>
                        ) : (
                            <select
                                name="staffId"
                                value={formData.staffId}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select Staff</option>
                                {staff.map((s) => (
                                    <option key={s._id} value={s._id}>
                                        {s.fullName}
                                    </option>
                                ))}
                            </select>
                        )}
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
                            value={totalLeaveDays}
                            disabled
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
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
                            Add Leave
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStaffLeaveModal;
