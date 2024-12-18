import React, { useState, useEffect } from 'react';
import { updateBranch, fetchBranchAdmins } from '../../../api/super-admin/superAdminBranch';
import Swal from 'sweetalert2';
import moment from 'moment';

const UpdateBranchModal = ({ showModal, setShowModal, branch, reloadBranches }) => {
    const [formData, setFormData] = useState({
        branchName: '',
        branchAddress: '',
        branchPhoneNumber: '',
        branchEmailAddress: '',
        assignedTo: '',
        machineAttendance: false,
        dairy: false,
        startTime: '',
        endTime: '',
    });

    const [branchAdmins, setBranchAdmins] = useState([]);

    useEffect(() => {
        if (branch) {
            setFormData({
                branchName: branch.branchName || '',
                branchAddress: branch.branchAddress || '',
                branchPhoneNumber: branch.branchPhoneNumber || '',
                branchEmailAddress: branch.branchEmailAddress || '',
                assignedTo: branch.assignedTo?._id || '',
                machineAttendance: branch.branchSettings?.machineAttendance || false,
                dairy: branch.branchSettings?.dairy || false,
                startTime: branch.branchSettings?.startTime ? moment(branch.branchSettings.startTime, 'HH:mm').format('HH:mm') : '',
                endTime: branch.branchSettings?.endTime ? moment(branch.branchSettings.endTime, 'HH:mm').format('HH:mm') : '',
            });
        }
    }, [branch]);

    useEffect(() => {
        const loadBranchAdmins = async () => {
            try {
                const data = await fetchBranchAdmins();
                setBranchAdmins(data.data);
            } catch (error) {
                console.error('Error fetching branch admins:', error);
            }
        };

        if (showModal) {
            loadBranchAdmins();
        }
    }, [showModal]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData({ ...formData, [name]: checked });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateBranch(branch._id, formData);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Branch updated successfully!',
            });
            handleCloseModal();
            reloadBranches();
        } catch (error) {
            console.error('Error updating branch:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update branch. Please try again.',
            });
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOverlayClick = (e) => {
        if (e.target.id === 'modalOverlay') {
            handleCloseModal();
        }
    };

    if (!showModal) return null;

    return (
        <div
            id="modalOverlay"
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleOverlayClick}
        >
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Update Branch</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4 col-span-2">
                            <label className="block text-gray-700 font-semibold">Branch Name</label>
                            <input
                                type="text"
                                name="branchName"
                                value={formData.branchName}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4 col-span-1">
                            <label className="block text-gray-700 font-semibold">Assigned To</label>
                            <select
                                name="assignedTo"
                                value={formData.assignedTo}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="" disabled>Select Branch Admin</option>
                                {branchAdmins.map((admin) => (
                                    <option key={admin._id} value={admin._id}>
                                        {admin.fullName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4 col-span-2">
                            <label className="block text-gray-700 font-semibold">Branch Address</label>
                            <input
                                type="text"
                                name="branchAddress"
                                value={formData.branchAddress}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4 col-span-1">
                            <label className="block text-gray-700 font-semibold">Branch Phone Number</label>
                            <input
                                type="text"
                                name="branchPhoneNumber"
                                value={formData.branchPhoneNumber}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4 col-span-1">
                            <label className="block text-gray-700 font-semibold">Branch Email Address</label>
                            <input
                                type="email"
                                name="branchEmailAddress"
                                value={formData.branchEmailAddress}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="mb-4 col-span-1">
                            <label className="block text-gray-700 font-semibold">Start Time</label>
                            <input
                                type="time"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4 col-span-1">
                            <label className="block text-gray-700 font-semibold">End Time</label>
                            <input
                                type="time"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4 col-span-1 flex flex-row gap-2 items-start">
                            <input
                                type="checkbox"
                                name="machineAttendance"
                                checked={formData.machineAttendance}
                                onChange={handleCheckboxChange}
                                className="h-5 w-5 custom-checkbox"
                            />
                            <span className="block text-gray-700 font-semibold">Machine Attendance</span>
                        </div>
                        <div className="mb-4 col-span-1 flex flex-row gap-2 items-start">
                            <input
                                type="checkbox"
                                name="dairy"
                                checked={formData.dairy}
                                onChange={handleCheckboxChange}
                                className="h-5 w-5 custom-checkbox"
                            />
                            <span className="block text-gray-700 font-semibold">Dairy</span>
                        </div>
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
                            Update Branch
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateBranchModal;
