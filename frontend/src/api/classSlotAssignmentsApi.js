// frontend/src/api/classSlotAssignmentsApi.js

import axiosInstance from '../axiosInstance';

// Fetch all Class Slot Assignments
export const getAllClassSlotAssignments = async (branchClassDaysId) => {
    try {
        const response = await axiosInstance.get(`/class-slot-assignments/get-all?branchClassDaysId=${branchClassDaysId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching Class Slot Assignments:', error);
        throw error.response?.data || { message: 'An error occurred while fetching Class Slot Assignments.' };
    }
};

// Create a new Class Slot Assignment
export const createClassSlotAssignment = async (assignmentData) => {
    try {
        const response = await axiosInstance.post('/class-slot-assignments/create', assignmentData);
        return response.data.data; // Assuming response.data.data contains the created assignment
    } catch (error) {
        console.error('Error creating Class Slot Assignment:', error);
        throw error.response?.data || { message: 'An error occurred while creating the Class Slot Assignment.' };
    }
};

// Update a Class Slot Assignment
export const updateClassSlotAssignment = async (id, assignmentData) => {
    try {
        const response = await axiosInstance.put(`/class-slot-assignments/update/${id}`, assignmentData);
        return response.data.data; // Assuming response.data.data contains the updated assignment
    } catch (error) {
        console.error('Error updating Class Slot Assignment:', error);
        throw error.response?.data || { message: 'An error occurred while updating the Class Slot Assignment.' };
    }
};

// Delete a Class Slot Assignment
export const deleteClassSlotAssignment = async (id) => {
    try {
        const response = await axiosInstance.delete(`/class-slot-assignments/delete/${id}`);
        return response.data.message; // Assuming response.data.message contains the success message
    } catch (error) {
        console.error('Error deleting Class Slot Assignment:', error);
        throw error.response?.data || { message: 'An error occurred while deleting the Class Slot Assignment.' };
    }
};

export const getAllSlotsForDay = async (branchClassDaysIdParam, sectionIdParam) => {
    try {
        // Retrieve branchId from localStorage
        const branchId = localStorage.getItem('branchId');

        if (!branchId) {
            throw { message: 'Branch ID not found in localStorage.' };
        }

        // Make a GET request with branchClassDaysIdParam and sectionIdParam as query parameters
        const response = await axiosInstance.get('/class-slot-assignments/get-all-slots-for-day', {
            params: {
                branchClassDaysId: branchClassDaysIdParam,
                sectionId: sectionIdParam,
                branchId,
            },
        });

        return response.data.data;
    } catch (error) {
        console.error('Error fetching Slots:', error);
        throw error.response?.data || { message: 'An error occurred while fetching Slots.' };
    }
};