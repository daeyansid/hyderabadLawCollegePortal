import React from 'react';
import Swal from 'sweetalert2';
import { updateTeacherLeaveStatus } from '../../../api/combinedLeaveApi'; // API for updating leave status
import { baseURLDoc } from '../../../index'; // Ensure the base URL for document storage is imported

const ViewLeaveModal = ({ showModal, setShowModal, leave, reloadLeaves }) => {
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Handle status change for teacher leave
    const handleStatusChange = async (status) => {
        try {
            await updateTeacherLeaveStatus(leave._id, status); // Update the status
            Swal.fire('Success!', `Leave has been ${status}.`, 'success');
            setShowModal(false); // Close the modal
            reloadLeaves(); // Reload leaves to reflect changes
        } catch (error) {
            Swal.fire('Error!', 'Failed to update leave status.', 'error');
            console.error(error);
        }
    };

    if (!showModal) return null;

    // Correctly construct the document URL
    const documentUrl = leave.doc
        ? `${baseURLDoc}docs/${leave.doc.replace(/\\/g, '/').split('/').pop()}`
        : '';

    return (
        <div
            id="modalOverlay"
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
            onClick={(e) => {
                if (e.target.id === 'modalOverlay') handleCloseModal();
            }}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-full overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Leave Details</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold">Name</label>
                        <p>{leave.userType === 'Teacher' ? leave.teacherId.fullName : leave.staffId.fullName}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Leave Reason</label>
                        <p>{leave.leaveReason}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Start Date</label>
                        <p>{new Date(leave.leaveStartDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">End Date</label>
                        <p>{new Date(leave.leaveEndDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Total Days</label>
                        <p>{leave.totalLeaveDays}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Status</label>
                        <p>{leave.status}</p>
                    </div>

                    {/* Show the PDF document if available or a message if not */}
                    <div className="col-span-2 mt-4">
                        <label className="block text-gray-700 font-semibold">Document</label>
                        {leave.doc ? (
                            <p className="mt-2">
                                <a
                                    href={documentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                >
                                    Download/View Full PDF
                                </a>
                            </p>
                        ) : (
                            <p className="mt-2 text-gray-500">No document available.</p>
                        )}
                    </div>
                </div>

                {/* Show Approve/Reject buttons only when status is 'Pending' */}
                {leave.userType === 'Teacher' && leave.status === 'Pending' && (
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={() => handleStatusChange('Approved')}
                            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                        >
                            Approve
                        </button>
                        <button
                            type="button"
                            onClick={() => handleStatusChange('Rejected')}
                            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                        >
                            Reject
                        </button>
                    </div>
                )}

                <div className="flex justify-end mt-4">
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

export default ViewLeaveModal;
