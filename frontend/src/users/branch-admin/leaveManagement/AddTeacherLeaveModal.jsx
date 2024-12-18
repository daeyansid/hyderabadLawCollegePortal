// src/components/leaveManagementOwn/AddBranchAdminLeaveModal.jsx

import React, { useState, useEffect } from 'react';
import { fetchTeachers } from '../../../api/teacherApi';
import { createLeave } from '../../../api/teacherLeaveApi';
import Swal from 'sweetalert2';

const AddBranchAdminLeaveModal = ({ showModal, setShowModal, reloadLeaves }) => {
  const [formData, setFormData] = useState({
    teacherId: '',
    leaveStartDate: '',
    leaveEndDate: '',
    leaveReason: '',
    description: '',
    totalLeaveDays: 0,
    doc: null,
    branchId: '',
    status: 'Approved',
  });

  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    if (showModal) {
      fetchTeachersData();
    }
  }, [showModal]);

  const fetchTeachersData = async () => {
    try {
      const branchId = localStorage.getItem('branchId');
      if (!branchId) {
        throw new Error('Branch ID is missing. Please login again.');
      }

      const teachersArray = await fetchTeachers(branchId);
      setTeachers(teachersArray.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      Swal.fire('Error!', error.message || 'Failed to fetch teachers.', 'error');
    }
  };

  // Handle input change and calculate total leave days
  const handleInputChange = (e) => {
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

    try {
      // Get branchAdminId from localStorage (if still needed)
      const branchAdminId = localStorage.getItem('adminSelfId');
      if (!branchAdminId) {
        throw new Error('Branch Admin ID is missing. Please login again.');
      }

      // Get branchId from localStorage and set it in formData
      const branchId = localStorage.getItem('branchId');
      if (!branchId) {
        throw new Error('Branch ID is missing. Please login again.');
      }
      formData.branchId = branchId; // Ensure branchId is included

      // Ensure totalLeaveDays is at least 1
      if (formData.totalLeaveDays < 1) {
        Swal.fire('Error!', 'Total leave days must be at least 1.', 'error');
        return;
      }

      // Ensure teacher is selected
      if (!formData.teacherId) {
        Swal.fire('Error!', 'Please select a Teacher.', 'error');
        return;
      }

      const leaveData = { ...formData };

      await createLeave(leaveData);
      Swal.fire('Success!', 'Leave has been created successfully!', 'success');
      setShowModal(false);
      reloadLeaves();
    } catch (error) {
      console.error('Error creating leave:', error);
      Swal.fire('Error!', error.response?.data?.message || error.message || 'Failed to create leave.', 'error');
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
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-full overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Add Leave</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Teacher Selection */}
          <div>
            <label className="block text-gray-700 font-semibold">Select Teacher</label>
            <select
              name="teacherId"
              value={formData.teacherId}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Teacher</option>
              {teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.fullName}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No teachers available
                </option>
              )}
            </select>
          </div>

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
              placeholder="Enter additional information (optional)"
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

export default AddBranchAdminLeaveModal;