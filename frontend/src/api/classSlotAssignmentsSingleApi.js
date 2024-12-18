// src/api/classSlotAssignmentsSingleApi.js

import axiosInstance from '../axiosInstance';

// Get assignments by Teacher ID and Branch Day ID
export const getAssignmentsSingleByTeacherAndDay = async (branchDayId, teacherId) => {
    try {
        const endpoint = `/class-slot-assignments-single/assigned-classes/slots/${branchDayId}`;
        const response = await axiosInstance.get(endpoint, {
            params: { teacherId },
        });
        console.log("response",response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching assignments:', error);
        throw error.response?.data || { message: 'An error occurred while fetching assignments.' };
    }
};

// Additional API functions can be added here if needed in the future

// Example: Get all assignments
// export const getAllAssignmentsSingle = async () => {
//     try {
//         const response = await axiosInstance.get('/class-slot-assignments-single');
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching all assignments:', error);
//         throw error.response?.data || { message: 'An error occurred while fetching all assignments.' };
//     }
// };

// Example: Get assignment by ID
// export const getAssignmentSingleById = async (assignmentId) => {
//     try {
//         const response = await axiosInstance.get(`/class-slot-assignments-single/${assignmentId}`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching assignment:', error);
//         throw error.response?.data || { message: 'An error occurred while fetching the assignment.' };
//     }
// };
