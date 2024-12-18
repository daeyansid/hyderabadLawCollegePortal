// src/api/studentAttendanceApi.js

import axiosInstance from '../axiosInstance';

export const getAttendanceRecords = async (subjectId) => {
    try {
        const studentId = localStorage.getItem('adminSelfId');

        if (!studentId) {
            throw new Error('studentId is required.');
        }

        const response = await axiosInstance.get('/student-attendance/get-attendance', {
            params: {
                studentId,
                subjectId,
            },
        });

        return response.data.data;
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        throw error.response?.data || { message: 'An error occurred while fetching attendance records.' };
    }
};
