import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { updateTeacherLeaveById, updateStaffLeaveById } from '../../../api/combinedLeaveApi'; // API methods to update leave
import moment from 'moment';

const EditLeaveModal = ({ showModal, setShowModal, leave, reloadLeaves }) => {
    const [formData, setFormData] = useState({
        leaveStartDate: '',
        leaveEndDate: '',
        totalLeaveDays: 0,
    });

    useEffect(() => {
        if (leave) {
            setFormData({
                leaveStartDate: moment(leave.leaveStartDate).format('YYYY-MM-DD'),
                leaveEndDate: moment(leave.leaveEndDate).format('YYYY-MM-DD'),
                totalLeaveDays: leave.totalLeaveDays,
            });
        }
    }, [leave]);

    // Automatically calculate total leave days
    const calculateTotalLeaveDays = (startDate, endDate) => {
        if (!startDate || !endDate) return; // Ensure both dates are set

        const start = new Date(startDate);
        const end = new Date(endDate);

        // Only calculate if start date is before or same as end date
        if (start <= end) {
            const diffTime = Math.abs(end - start);
            const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end date
            setFormData((prevFormData) => ({ ...prevFormData, totalLeaveDays: totalDays }));
        }
    };

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));

        // Recalculate the total leave days if dates are changed
        if (name === 'leaveStartDate' || name === 'leaveEndDate') {
            const newStartDate = name === 'leaveStartDate' ? value : formData.leaveStartDate;
            const newEndDate = name === 'leaveEndDate' ? value : formData.leaveEndDate;
            calculateTotalLeaveDays(newStartDate, newEndDate);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            // Call the appropriate API based on user type (Teacher or Staff)
            if (leave.userType === 'Teacher') {
                await updateTeacherLeaveById(leave._id, {
                    leaveStartDate: formData.leaveStartDate,
                    leaveEndDate: formData.leaveEndDate,
                    totalLeaveDays: formData.totalLeaveDays,
                });
            } else {
                await updateStaffLeaveById(leave._id, {
                    leaveStartDate: formData.leaveStartDate,
                    leaveEndDate: formData.leaveEndDate,
                    totalLeaveDays: formData.totalLeaveDays,
                });
            }

            Swal.fire('Success!', 'Leave has been updated.', 'success');
            setShowModal(false); // Close the modal
            reloadLeaves(); // Reload the leaves data
        } catch (error) {
            console.error('Error updating leave:', error); // Debugging
            Swal.fire('Error!', 'Failed to update leave.', 'error');
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
                <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Edit Leave</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-semibold">Name</label>
                            <p className="border px-2 py-1 rounded-md bg-gray-100">
                                {leave.userType === 'Teacher' ? leave.teacherId.fullName : leave.staffId.fullName}
                            </p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">Leave Reason</label>
                            <p className="border px-2 py-1 rounded-md bg-gray-100">{leave.leaveReason}</p>
                        </div>
                        <div>
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
                        <div>
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
                        <div>
                            <label className="block text-gray-700 font-semibold">Total Days</label>
                            <input
                                type="number"
                                value={formData.totalLeaveDays}
                                disabled
                                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
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
                            Update Leave
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditLeaveModal;
