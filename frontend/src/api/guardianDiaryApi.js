// src/api/guardianDiaryApi.js

import axiosInstance from '../axiosInstance';

export const getDiaryByStudentId = async (studentId) => {
    try {
        if (!studentId) {
            throw new Error('studentId is required.');
        }

        const response = await axiosInstance.get('/guardian-diary/get-diary', {
            params: {
                studentId,
            },
        });

        return response.data.data;
    } catch (error) {
        console.error('Error fetching diary entries:', error);
        throw error.response?.data || { message: 'An error occurred while fetching diary entries.' };
    }
};
