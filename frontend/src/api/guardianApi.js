import axiosInstance from '../axiosInstance';
import Swal from 'sweetalert2';

// Fetch all guardians for a specific branch
export const fetchGuardians = async () => {
    try {
        const branchId = localStorage.getItem('branchId');
        if (!branchId) {
            throw new Error('Branch ID is missing from local storage');
        }

        const response = await axiosInstance.get('/guardian/get-all', {
            params: { branchId }
        });

        return response.data; 
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unable to fetch guardians. Please try again later.',
        });
        throw error;
    }
};

// Fetch a guardian by ID
export const fetchGuardianById = async (id) => {
    try {
        const response = await axiosInstance.get(`/guardian/get-by-id/${id}`);
        return response.data; // Handle the fetched guardian data
    } catch (error) {
        // console.error('Error fetching guardian by ID:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
        });
        throw error;
    }
};

// Create a new guardian
export const createGuardian = async (guardianData) => {
    try {
        const response = await axiosInstance.post('/guardian/create', guardianData);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Guardian created successfully!',
        });
        return response.data; // Handle the newly created guardian
    } catch (error) {
        console.error('Error creating guardian:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error,
        });
        throw error;
    }
};

// Update a guardian by ID
export const updateGuardian = async (id, guardianData) => {
    try {
        const response = await axiosInstance.put(`/guardian/update/${id}`, guardianData);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Guardian updated successfully!',
        });
        return response.data; // Handle the updated guardian
    } catch (error) {
        // console.error('Error updating guardian:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
        });
        throw error;
    }
};

// Delete a guardian by ID
export const deleteGuardian = async (id) => {
    try {
        const response = await axiosInstance.delete(`/guardian/delete/${id}`);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Guardian deleted successfully!',
        });
        return response.data; // Handle the deleted guardian
    } catch (error) {
        console.error('Error deleting guardian:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
        });
        throw error;
    }
};
