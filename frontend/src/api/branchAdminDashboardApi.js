// src/api/branchAdminDashboardApi.js

import axiosInstance from '../axiosInstance';

export const getBranchAdminDashboardStats = async () => {
    try {
        const branchAdminId = localStorage.getItem('adminSelfId');
        const branchId = localStorage.getItem('branchId');

        if (!branchAdminId) {
            throw new Error('Branch Admin ID not found in localStorage.');
        }

        if (!branchId) {
            throw new Error('Branch ID not found in localStorage.');
        }

        const response = await axiosInstance.get('/branch-admin-dashboard/get-dashboard-stats', {
            params: {
                branchAdminId,
                branchId,
            },
        });

        return response.data.data;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error.response?.data || { message: 'An error occurred while fetching dashboard stats.' };
    }
};
