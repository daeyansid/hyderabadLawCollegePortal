// src/api/guardianDashboardApi.js

import axiosInstance from '../axiosInstance';

export const getGuardianDashboardStats = async () => {
    try {
        const guardianId = localStorage.getItem('adminSelfId');

        if (!guardianId) {
            throw new Error('Guardian ID not found in localStorage.');
        }

        const response = await axiosInstance.get('/guardian-dashboard/get-dashboard-stats', {
            params: {
                guardianId,
            },
        });

        return response.data.data;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error.response?.data || { message: 'An error occurred while fetching dashboard stats.' };
    }
};
