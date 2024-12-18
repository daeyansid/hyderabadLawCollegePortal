// src/api/diaryApi.js
import axiosInstance from '../axiosInstance';

// Fetch classes by branchId
export const getClassesByBranch = async (branchId) => {
    try {
        const response = await axiosInstance.get(`/class/branch/${branchId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching classes:', error);
        throw error;
    }
};

// Fetch sections by classId
export const getSectionsByClass = async (classId) => {
    try {
        const response = await axiosInstance.get(`/section/class/${classId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching sections:', error);
        throw error;
    }
};

// Fetch subjects by sectionId
export const getSubjectsBySection = async (sectionId) => {
    try {
        const response = await axiosInstance.get(`/subject/section/${sectionId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching subjects:', error);
        throw error;
    }
};

// Fetch students by classId and sectionId
export const getStudentsByClassAndSection = async (classId, sectionId) => {
    try {
        const response = await axiosInstance.get(`/student/class/${classId}/section/${sectionId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
};

// Create a new diary entry
export const createDiary = async (diaryData) => {
    try {
        const response = await axiosInstance.post('/diary/create', diaryData);
        return response.data;
    } catch (error) {
        console.error('Error creating diary entry:', error);
        throw error;
    }
};

// Fetch all diary entries
export const getDiaries = async () => {
    try {
        const response = await axiosInstance.get('/diary/get-all');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching diary entries:', error);
        throw error;
    }
};

// Fetch a diary entry by ID
export const getDiaryById = async (diaryId) => {
    try {
        const response = await axiosInstance.get(`/diary/get/${diaryId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching diary entry:', error);
        throw error;
    }
};

// Update a diary entry
export const updateDiary = async (diaryId, diaryData) => {
    try {
        const response = await axiosInstance.put(`/diary/update/${diaryId}`, diaryData);
        return response.data;
    } catch (error) {
        console.error('Error updating diary entry:', error);
        throw error;
    }
};

// Delete a diary entry
export const deleteDiary = async (diaryId) => {
    try {
        const response = await axiosInstance.delete(`/diary/delete/${diaryId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting diary entry:', error);
        throw error;
    }
};

// get by teacherId
export const getTeacherAssignments = async () => {
    try {
        const teacherId = localStorage.getItem('adminSelfId');

        if (!teacherId) {
            throw new Error('Teacher ID not found in localStorage.');
        }

        const response = await axiosInstance.get('/class-slot-assignments/get-assignments', {
            params: {
                teacherId,
            },
        });

        return response.data.data;
    } catch (error) {
        console.error('Error fetching teacher assignments:', error);
        throw error.response?.data || { message: 'An error occurred while fetching teacher assignments.' };
    }
};