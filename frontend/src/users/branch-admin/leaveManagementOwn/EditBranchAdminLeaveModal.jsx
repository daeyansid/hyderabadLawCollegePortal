// src/components/leaveManagementOwn/EditBranchAdminLeaveModal.jsx

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { updateBranchAdminLeave } from '../../../api/branchAdminLeaveApi';
import moment from 'moment';

const EditBranchAdminLeaveModal = ({ showModal, setShowModal, leave, reloadLeaves }) => {
  const [formData, setFormData] = useState({
    leaveStartDate: '',
    leaveEndDate: '',
    leaveReason: '',
    description: '',
    totalLeaveDays: 0,
    doc: null,
  });

  useEffect(() => {
    if (leave) {
      setFormData({
        leaveStartDate: moment(leave.leaveStartDate).format('YYYY-MM-DD'),
        leaveEndDate: moment(leave.leaveEndDate).format('YYYY-MM-DD'),
        leaveReason: leave.leaveReason,
        description: leave.description,
        totalLeaveDays: leave.totalLeaveDays,
        doc: null,
      });
    }
  }, [leave]);

  // Handle input change and recalculate total leave days
  const handleInputChange = (e) => {
    if (leave.status !== 'Pending') {
      // Do not allow changes if status is not Pending
      return;
    }

    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    // Recalculate totalLeaveDays if dates change
    if (name === 'leaveStartDate' || name === 'leaveEndDate') {
      const { leaveStartDate, leaveEndDate } = updatedFormData;
      if (leaveStartDate && leaveEndDate) {
        const startDate = new Date(leaveStartDate);
        const endDate = new Date(leaveEndDate);

        if (startDate <= endDate) {
          const diffTime = Math.abs(endDate - startDate);
          const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          updatedFormData.totalLeaveDays = totalDays;
        } else {
          updatedFormData.totalLeaveDays = 0;
        }
      } else {
        updatedFormData.totalLeaveDays = 0;
      }
    }

    setFormData(updatedFormData);
  };

  // Handle file change
  const handleFileChange = (e) => {
    if (leave.status !== 'Pending') {
      // Do not allow file change if status is not Pending
      return;
    }

    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      const fileSize = file.size / 1024 / 1024;

      if (fileType !== 'application/pdf') {
        Swal.fire('Error!', 'Only PDF files are allowed.', 'error');
        e.target.value = null;
        setFormData({ ...formData, doc: null });
        return;
      }

      if (fileSize > 5) {
        Swal.fire('Error!', 'File size exceeds 5MB.', 'error');
        e.target.value = null;
        setFormData({ ...formData, doc: null });
        return;
      }

      setFormData({ ...formData, doc: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (leave.status !== 'Pending') {
      Swal.fire('Error!', 'Cannot edit leave that is not pending.', 'error');
      return;
    }

    try {
      // Ensure totalLeaveDays is at least 1
      if (formData.totalLeaveDays < 1) {
        Swal.fire('Error!', 'Total leave days must be at least 1.', 'error');
        return;
      }

      await updateBranchAdminLeave(leave._id, formData);
      Swal.fire('Success!', 'Leave has been updated.', 'success');
      setShowModal(false);
      reloadLeaves();
    } catch (error) {
      console.error('Error updating leave:', error);
      Swal.fire('Error!', 'Failed to update leave.', 'error');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (!showModal || !leave) return null;

  const isEditable = leave.status === 'Pending';

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
        <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Edit Leave</h2>
        {!isEditable && (
          <p className="text-red-500 mb-4">
            You cannot edit this leave because it has been {leave.status.toLowerCase()}.
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Leave Start Date */}
          <div>
            <label className="block text-gray-700 font-semibold">Start Date</label>
            <input
              type="date"
              name="leaveStartDate"
              value={formData.leaveStartDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={!isEditable}
            />
          </div>

          {/* Leave End Date */}
          <div>
            <label className="block text-gray-700 font-semibold">End Date</label>
            <input
              type="date"
              name="leaveEndDate"
              value={formData.leaveEndDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={!isEditable}
            />
          </div>

          {/* Total Leave Days */}
          <div>
            <label className="block text-gray-700 font-semibold">Total Leave Days</label>
            <input
              type="number"
              name="totalLeaveDays"
              value={formData.totalLeaveDays}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          {/* Leave Reason */}
          <div>
            <label className="block text-gray-700 font-semibold">Leave Reason</label>
            <select
              name="leaveReason"
              value={formData.leaveReason}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={!isEditable}
            >
              <option value="">Select Reason</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Half Day Leave">Half Day Leave</option>
              <option value="Short Time Leave">Short Time Leave</option>
              <option value="Hajj Leave">Hajj Leave</option>
              <option value="Official Work Leave">Official Work Leave</option>
              <option value="Personal Work Leave">Personal Work Leave</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-semibold">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="3"
              disabled={!isEditable}
            />
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-gray-700 font-semibold">Upload Document (optional)</label>
            <input
              type="file"
              name="doc"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={!isEditable}
            />
            <small className="text-gray-500">Max file size: 5MB. Only PDF allowed.</small>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Close
            </button>
            {isEditable && (
              <button
                type="submit"
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
              >
                Update Leave
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBranchAdminLeaveModal;
