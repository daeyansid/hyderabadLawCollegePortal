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

// Fetch subjects by classId
export const getSubjectsByClass = async (classId) => {
    try {
        const response = await axiosInstance.post(`/subject/get-all-by-class?classId=${classId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching subjects:', error);
        throw error;
    }
};

export const getStudentsByClass = async (classId, sectionId) => {
    try {
        const response = await axiosInstance.post(`/student/class/${classId}`);
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