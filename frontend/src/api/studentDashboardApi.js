// src/api/studentDashboardApi.js

import axiosInstance from '../axiosInstance';

export const getStudentDashboardStats = async () => {
    try {
        const studentId = localStorage.getItem('adminSelfId');

        if (!studentId) {
            throw new Error('Student ID not found in localStorage.');
        }

        const response = await axiosInstance.get('/student-dashboard/get-dashboard-stats', {
            params: {
                studentId,
            },
        });

        return response.data.data;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error.response?.data || { message: 'An error occurred while fetching dashboard stats.' };
    }
};
