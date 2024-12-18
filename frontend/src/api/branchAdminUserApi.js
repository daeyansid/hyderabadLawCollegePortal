// src/api/branchAdminUserApi.js
import axiosInstance from '../axiosInstance';

export const getBranchAdminsWithUserData = async () => {
    try {
    return await axiosInstance.get('/branch-admin-users/list');
    } catch (error) {
        console.error('Error fetching branches Admin for dropdown:', error);
        throw error;
    }
};