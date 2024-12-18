// frontend/src/api/branchDailyTimeSlotsApi.js

import axiosInstance from '../axiosInstance';

// Create a new Branch Daily Time Slot
export const createBranchDailyTimeSlot = async (data) => {
    try {
        const response = await axiosInstance.post('/branch-daily-time-slots', data);
        return response.data.data;
    } catch (error) {
        console.error('Error creating Branch Daily Time Slot:', error);
        throw error.response?.data || error;
    }
};

// Get all time slots by branchClassDaysId
export const getBranchDailyTimeSlotsByDay = async (branchClassDaysId) => {
    try {
        const response = await axiosInstance.get(`/branch-daily-time-slots/by-day/${branchClassDaysId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching branch daily time slots by day:', error);
        throw error;
    }
};

export const getBranchDailyTimeSlotsByDayBranch = async (branchClassDaysId) => {
    try {
        const branchId = localStorage.getItem('branchId');

        if (!branchId) {
            throw { message: 'Branch ID not found in localStorage.' };
        }

        // Make a GET request with branchId as a query parameter
        const response = await axiosInstance.get(
            `/branch-daily-time-slots/by-branch-class-days/${branchClassDaysId}`,
            {
                params: {
                    branchId,
                },
            }
        );

        return response.data.data.timeSlots;
    } catch (error) {
        console.error('Error fetching Branch Daily Time Slots:', error);
        // Handle specific error messages
        if (error.message) {
            throw { message: error.message };
        }
        throw error.response?.data || { message: 'An error occurred while fetching Branch Daily Time Slots.' };
    }
};


// -------------
// Get Branch Daily Time Slots by BranchClassDaysId
export const getBranchDailyTimeSlotsByBranchClassDaysIdSetting = async (branchClassDaysId) => {
    try {
        const response = await axiosInstance.get(`/branch-daily-time-slots/by-branch-class-days-setting/${branchClassDaysId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching branch daily time slots by day:', error);
        throw error.response?.data || error;
    }
};
// -------------

// Update Branch Daily Time Slot by ID
export const updateBranchDailyTimeSlot = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/branch-daily-time-slots/${id}`, data);
        return response.data.data;
    } catch (error) {
        console.error('Error updating Branch Daily Time Slot:', error);
        throw error.response?.data || error;
    }
};

// Delete Branch Daily Time Slot by ID
export const deleteBranchDailyTimeSlot = async (id) => {
    try {
        const response = await axiosInstance.delete(`/branch-daily-time-slots/${id}`);
        return response.data.message;
    } catch (error) {
        console.error('Error deleting Branch Daily Time Slot:', error);
        throw error.response?.data || error;
    }
};
