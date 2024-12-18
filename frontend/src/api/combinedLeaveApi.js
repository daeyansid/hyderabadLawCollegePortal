// api/combinedLeaveApi.js

import axiosInstance from '../axiosInstance';
import Swal from 'sweetalert2';


// Fetch combined teacher and staff leaves
export const getCombinedLeaves = async () => {
    try {
        const branchId = localStorage.getItem('branchId');

        if (!branchId) {
            throw new Error('Branch ID not found in localStorage.');
        }

        const response = await axiosInstance.get('/combined-leave/get-combined-leaves', {
            params: { branchId },
        });

        return response.data.data;
    } catch (error) {
        console.error('Error fetching combined leaves:', error);

        if (error.response && error.response.data && error.response.data.message) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message,
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'An unexpected error occurred.',
            });
        }

        throw error;
    }
};

// Delete Teacher Leave by ID
export const deleteTeacherLeave = async (leaveId) => {
    try {
        const response = await axiosInstance.delete(`/teacher-leave/delete/${leaveId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting teacher leave:', error);
        throw error;
    }
};

// Delete Staff Leave by ID
export const deleteStaffLeave = async (leaveId) => {
    try {
        const response = await axiosInstance.delete(`/staff-leave/delete/${leaveId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting staff leave:', error);
        throw error;
    }
};


// Update teacher leave status
export const updateTeacherLeaveStatus = async (leaveId, status) => {
    try {
        const response = await axiosInstance.put(`/teacher-leave/update-status/${leaveId}`, { status });
        return response.data;
    } catch (error) {
        console.error('Error updating teacher leave status:', error);
        throw error;
    }
};

// Update teacher leave by ID
export const updateTeacherLeaveById = async (leaveId, updatedData) => {
    try {
        const response = await axiosInstance.put(`/teacher-leave/update/${leaveId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error updating teacher leave:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update teacher leave.',
        });
        throw error;
    }
};

// Update staff leave by ID
export const updateStaffLeaveById = async (leaveId, updatedData) => {
    try {
        const response = await axiosInstance.put(`/staff-leave/update/${leaveId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error updating staff leave:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update staff leave.',
        });
        throw error;
    }
};
