// frontend/src/api/classSlotAssignmentsStudentApi.js

import axiosInstance from '../axiosInstance';

// Fetch all Class Slot Assignments for Student
export const getAllClassSlotAssignmentsStudent = async (branchClassDaysId) => {
    try {
        const response = await axiosInstance.get(`/class-slot-assignments-student/get-all?branchClassDaysId=${branchClassDaysId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching Class Slot Assignments for Student:', error);
        throw error.response?.data || { message: 'An error occurred while fetching Class Slot Assignments for Student.' };
    }
};

// Create a new Class Slot Assignment for Student
export const createClassSlotAssignmentStudent = async (assignmentData) => {
    try {
        const response = await axiosInstance.post('/class-slot-assignments-student/create', assignmentData);
        return response.data.data; // Assuming response.data.data contains the created assignment
    } catch (error) {
        console.error('Error creating Class Slot Assignment for Student:', error);
        throw error.response?.data || { message: 'An error occurred while creating the Class Slot Assignment for Student.' };
    }
};

// Update a Class Slot Assignment for Student
export const updateClassSlotAssignmentStudent = async (id, assignmentData) => {
    try {
        const response = await axiosInstance.put(`/class-slot-assignments-student/update/${id}`, assignmentData);
        return response.data.data; // Assuming response.data.data contains the updated assignment
    } catch (error) {
        console.error('Error updating Class Slot Assignment for Student:', error);
        throw error.response?.data || { message: 'An error occurred while updating the Class Slot Assignment for Student.' };
    }
};

// Delete a Class Slot Assignment for Student
export const deleteClassSlotAssignmentStudent = async (id) => {
    try {
        const response = await axiosInstance.delete(`/class-slot-assignments-student/delete/${id}`);
        return response.data.message; // Assuming response.data.message contains the success message
    } catch (error) {
        console.error('Error deleting Class Slot Assignment for Student:', error);
        throw error.response?.data || { message: 'An error occurred while deleting the Class Slot Assignment for Student.' };
    }
};

export const getAllSlotsForDayStudent = async (branchClassDaysIdParam, sectionIdParam) => {
    try {
        // Retrieve branchId from localStorage
        const branchId = localStorage.getItem('branchId');

        if (!branchId) {
            throw { message: 'Branch ID not found in localStorage.' };
        }

        // Make a GET request with branchClassDaysIdParam and sectionIdParam as query parameters
        const response = await axiosInstance.get('/class-slot-assignments-student/get-all-slots-for-day', {
            params: {
                branchClassDaysId: branchClassDaysIdParam,
                sectionId: sectionIdParam,
                branchId,
            },
        });

        return response.data.data;
    } catch (error) {
        console.error('Error fetching Slots for Student:', error);
        throw error.response?.data || { message: 'An error occurred while fetching Slots for Student.' };
    }
};
