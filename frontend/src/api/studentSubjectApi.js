// src/api/studentSubjectApi.js

import axiosInstance from '../axiosInstance';

export const getSubjects = async () => {
    try {
        const classId = localStorage.getItem('classId');
        const sectionId = localStorage.getItem('sectionId');

        if (!classId || !sectionId) {
            throw new Error('classId and sectionId are required.');
        }

        const response = await axiosInstance.get('/student-subjects/get-subjects', {
            params: {
                classId,
                sectionId,
            },
        });

        return response.data.data;
    } catch (error) {
        console.error('Error fetching subjects:', error);
        throw error.response?.data || { message: 'An error occurred while fetching subjects.' };
    }
};
