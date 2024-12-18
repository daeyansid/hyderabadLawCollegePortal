import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { updateLeave, getLeaveById } from '../../../api/teacherLeaveApi';

const EditLeaveModal = ({ showModal, setShowModal, leaveId, reloadLeaves }) => {
    const [formData, setFormData] = useState({
        leaveReason: '',
        leaveStartDate: '',
        leaveEndDate: '',
        description: '',
        doc: null,
    });
    const [totalLeaveDays, setTotalLeaveDays] = useState(0); // State to store total leave days
    const [loading, setLoading] = useState(true);

    // Fetch the current leave data and pre-fill the form
    const fetchLeaveData = async () => {
        try {
            const leave = await getLeaveById(leaveId);
            const startDate = new Date(leave.leaveStartDate).toISOString().substring(0, 10);
            const endDate = new Date(leave.leaveEndDate).toISOString().substring(0, 10);
            
            setFormData({
                leaveReason: leave.leaveReason,
                leaveStartDate: startDate,
                leaveEndDate: endDate,
                description: leave.description || '',
                doc: null,
            });
            calculateTotalLeaveDays(startDate, endDate); // Calculate leave days on initial load
            setLoading(false);
        } catch (error) {
            console.error('Error fetching leave data', error);
        }
    };

    useEffect(() => {
        if (showModal && leaveId) {
            fetchLeaveData(); // Fetch data when modal opens
        }
    }, [showModal, leaveId]);

    // Calculate the total number of leave days
    const calculateTotalLeaveDays = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const timeDiff = endDate.getTime() - startDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // Add 1 to include both start and end date
        setTotalLeaveDays(daysDiff > 0 ? daysDiff : 0); // Ensure total leave days is at least 0
    };

    // Handle input change and recalculate total leave days when dates change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'leaveStartDate' || name === 'leaveEndDate') {
            const newStartDate = name === 'leaveStartDate' ? value : formData.leaveStartDate;
            const newEndDate = name === 'leaveEndDate' ? value : formData.leaveEndDate;
            calculateTotalLeaveDays(newStartDate, newEndDate); // Recalculate when dates change
        }
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, doc: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Create a new form data object
        const formDataToSend = new FormData();
    
        // Append fields to formDataToSend
        formDataToSend.append('leaveReason', formData.leaveReason);
        formDataToSend.append('leaveStartDate', formData.leaveStartDate);
        formDataToSend.append('leaveEndDate', formData.leaveEndDate);
        formDataToSend.append('description', formData.description);
    
        // Only append the doc if a new file is uploaded
        if (formData.doc) {
            formDataToSend.append('doc', formData.doc);
        }
    
        try {
            await updateLeave(leaveId, formDataToSend); // Call API to update leave
            Swal.fire({
                icon: 'success',
                title: 'Leave updated successfully!',
            });
            setShowModal(false); // Close modal
            reloadLeaves(); // Reload leaves to reflect changes
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update leave request. Please try again.',
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
                <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Edit Leave</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto">
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
                                value={totalLeaveDays}
                                disabled
                                className="w-full p-2 border border-gray-300 rounded-md"
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
                            <label className="block text-gray-700 font-semibold">Upload New Document (optional)</label>
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
                                Update Leave
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EditLeaveModal;
