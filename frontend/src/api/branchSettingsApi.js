// frontend/src/api/branchSettingsApi.js

import axiosInstance from '../axiosInstance';

// Get Branch Settings by Branch ID
export const getBranchSettings = async (branchId) => {
    try {
        const response = await axiosInstance.get(`/branch-settings/${branchId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching branch settings:', error);
        throw error;
    }
};
