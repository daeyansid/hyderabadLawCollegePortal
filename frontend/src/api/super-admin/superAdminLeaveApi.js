// src/api/superAdminLeaveApi.js

import axiosInstance from '../../axiosInstance';

// Get all leaves
export const getAllLeaves = async () => {
    try {
        const response = await axiosInstance.get('/super-admin-leave/leaves');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching all leaves:', error);
        throw error;
    }
};

// Create a leave
export const createLeaveBySuperAdmin = async (leaveData) => {
    try {
        const formData = new FormData();
        Object.keys(leaveData).forEach((key) => {
            formData.append(key, leaveData[key]);
        });

        const response = await axiosInstance.post('/super-admin-leave/leave', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.data;
    } catch (error) {
        console.error('Error creating leave:', error);
        throw error;
    }
};

// Update a leave
export const updateLeaveBySuperAdmin = async (leaveId, leaveData) => {
    try {
        const response = await axiosInstance.put(`/super-admin-leave/leave/${leaveId}`, leaveData);
        return response.data.data;
    } catch (error) {
        console.error('Error updating leave:', error);
        throw error;
    }
};

// Delete a leave
export const deleteLeaveBySuperAdmin = async (leaveId) => {
    try {
        const response = await axiosInstance.delete(`/super-admin-leave/leave/${leaveId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting leave:', error);
        throw error;
    }
};


// Update a leave
export const updateLeave = async (leaveId, formData) => {
    try {
        const response = await axiosInstance.put(`/super-admin-leave/update-status/${leaveId}`, formData, {
            headers: {
                'Content-Type': 'application/json', // Correct content type for sending JSON data
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating leave request:', error);
        throw error;
    }
};