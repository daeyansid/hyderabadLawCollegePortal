// src/api/guardianAttendanceApi.js

import axiosInstance from '../axiosInstance';

export const getAttendanceByStudentId = async (studentId) => {
    try {
        if (!studentId) {
            throw new Error('studentId is required.');
        }

        const response = await axiosInstance.get('/guardian-attendance/get-attendance', {
            params: {
                studentId,
            },
        });

        return response.data.data;
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        throw error.response?.data || { message: 'An error occurred while fetching attendance records.' };
    }
};
