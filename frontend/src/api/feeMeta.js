// src/api/feeApi.js
import axiosInstance from '../axiosInstance';

// Create a new fee metadata entry
export const createFeeMeta = async (feeData) => {
    try {
        const response = await axiosInstance.post('/feeMeta/create', feeData);
        return response.data;
    } catch (error) {
        console.error('Error creating fee metadata:', error);
        throw error;
    }
};

// Fetch all fee metadata entries
export const getAllFeeMeta = async () => {
    try {
        const response = await axiosInstance.get('/feeMeta/get-all');
        return response.data;
    } catch (error) {
        console.error('Error fetching fee metadata:', error);
        throw error;
    }
};

// Fetch a fee metadata entry by ID
export const getFeeMetaById = async (id) => {
    try {
        const response = await axiosInstance.get(`/fee/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching fee metadata by ID:', error);
        throw error;
    }
};

// Get current active fee structure
export const getCurrentFeeMeta = async () => {
    try {
        const response = await axiosInstance.get('/feeMeta/get-all');
        // Return the first fee structure since we only allow one
        return response.data?.data?.[0] || null;
    } catch (error) {
        console.error('Error fetching current fee metadata:', error);
        throw error;
    }
};

// Update a fee metadata entry
export const updateFeeMeta = async (id, feeData) => {
    try {
        const response = await axiosInstance.put(`/feeMeta/update/${id}`, feeData);
        return response.data;
    } catch (error) {
        console.error('Error updating fee metadata:', error);
        throw error;
    }
};

// Delete a fee metadata entry
export const deleteFeeMeta = async (id) => {
    try {
        const response = await axiosInstance.delete(`/feeMeta/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting fee metadata:', error);
        throw error;
    }
};
