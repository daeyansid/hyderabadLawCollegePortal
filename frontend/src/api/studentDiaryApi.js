// src/api/studentDiaryApi.js

import axiosInstance from '../axiosInstance';

// Fetch diary entries for a student
export const getStudentDiary = async () => {
    try {
        const classId = localStorage.getItem('classId');
        const sectionId = localStorage.getItem('sectionId');
        const adminSelfId = localStorage.getItem('adminSelfId');

        if (!classId || !sectionId || !adminSelfId) {
            throw new Error('Required IDs not found in localStorage.');
        }

        const response = await axiosInstance.get('/student-diary/get-student-diary', {
            params: {
                classId,
                sectionId,
                adminSelfId,
            },
        });

        return response.data.data;
    } catch (error) {
        console.error('Error fetching diary entries:', error);
        throw error.response?.data || { message: 'An error occurred while fetching diary entries.' };
    }
};
