import axiosInstance from '../axiosInstance';
import Swal from 'sweetalert2';

// Fetch all classes
export const fetchClasses = async () => {
    try {
        // Retrieve branchId from localStorage
        const branchId = localStorage.getItem('branchId');
        
        if (!branchId) {
            throw new Error('Branch ID is missing from local storage');
        }

        // Make API request with branchId as a query parameter
        const response = await axiosInstance.get('/class/get-all', {
            params: { branchId }
        });

        return response.data; // Handle the fetched classes
    } catch (error) {
    }
};

// Fetch class by ID
export const fetchClassById = async (id) => {
    try {
        const response = await axiosInstance.get(`/class/get-by-id/${id}`);
        return response.data; // Handle the fetched class
    } catch (error) {
        // console.error('Error fetching class by ID:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unable to fetch class details. Please try again later.',
        });
        throw error; // Handle or propagate error
    }
};

// Create a new class
export const createClass = async (classData) => {
    try {
        const branchId = localStorage.getItem('branchId');
        const response = await axiosInstance.post('/class/create', { ...classData, branchId });
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Class created successfully!',
        });
        return response.data; // Handle the newly created class
    } catch (error) {
        console.error('Error creating class:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
        });
        throw error; // Handle or propagate error
    }
};

// Update a class
export const updateClass = async (id, classData) => {
    try {
        const response = await axiosInstance.put(`/class/update/${id}`, classData);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Class updated successfully!',
        });
        return response.data; // Handle the updated class
    } catch (error) {
        console.error('Error updating class:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
        });
        throw error; // Handle or propagate error
    }
};

// Delete a class
export const deleteClass = async (id) => {
    try {
        const response = await axiosInstance.delete(`/class/delete/${id}`);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Class deleted successfully!',
        });
        return response.data; // Handle the deleted class
    } catch (error) {
        console.error('Error deleting class:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
        });
        throw error; // Handle or propagate error
    }
};