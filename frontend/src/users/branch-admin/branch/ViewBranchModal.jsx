import React from 'react';
import moment from 'moment';

const ViewBranchModal = ({ showModal, setShowModal, branch }) => {
    if (!showModal) return null;

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOverlayClick = (e) => {
        if (e.target.id === 'modalOverlay') {
            handleCloseModal();
        }
    };

    return (
        <div
            id="modalOverlay"
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleOverlayClick}
        >
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Branch Details</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold">Branch Name</label>
                        <p>{branch.branchName}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Branch Address</label>
                        <p>{branch.branchAddress}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Branch Phone Number</label>
                        <p>{branch.branchPhoneNumber}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Branch Email Address</label>
                        <p>{branch.branchEmailAddress}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Assigned To</label>
                        <p>{branch.assignedTo?.fullName || 'N/A'}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Machine Attendance</label>
                        <p>{branch.branchSettings.machineAttendance ? "Enabled" : "Disabled"}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Dairy</label>
                        <p>{branch.branchSettings.dairy ? "Enabled" : "Disabled"}</p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Start Time</label>
                        <p>{branch.branchSettings.startTime}</p>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold">End Time</label>
                        <p>{branch.branchSettings.endTime}</p>
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

export default ViewBranchModal;
