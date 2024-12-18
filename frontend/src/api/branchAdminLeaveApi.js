// src/api/branchAdminLeaveApi.js

import axiosInstance from '../axiosInstance';

// Fetch leaves by branch admin ID
export const getBranchAdminLeavesByBranchAdminId = async (branchAdminId) => {
  try {
    const response = await axiosInstance.get(`/branch-admin-leave/branch-admin/${branchAdminId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching branch admin leaves by branch admin ID:', error);
    throw error;
  }
};

// Create a new branch admin leave
export const createBranchAdminLeave = async (leaveData) => {
  try {
    const formData = new FormData();
    Object.keys(leaveData).forEach((key) => {
      formData.append(key, leaveData[key]);
    });

    const response = await axiosInstance.post('/branch-admin-leave/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating branch admin leave:', error);
    throw error;
  }
};

// Update a branch admin leave
export const updateBranchAdminLeave = async (leaveId, leaveData) => {
  try {
    const formData = new FormData();
    Object.keys(leaveData).forEach((key) => {
      formData.append(key, leaveData[key]);
    });

    const response = await axiosInstance.put(`/branch-admin-leave/update/${leaveId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating branch admin leave:', error);
    throw error;
  }
};

// Delete a branch admin leave
export const deleteBranchAdminLeave = async (leaveId) => {
  try {
    const response = await axiosInstance.delete(`/branch-admin-leave/delete/${leaveId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting branch admin leave:', error);
    throw error;
  }
};