import axiosInstance from '../axiosInstance';
import Swal from 'sweetalert2';

// Fetch all staff for a specific branch
export const fetchStaff = async () => {
    try {
        const branchId = localStorage.getItem('branchId');
        if (!branchId) {
            throw new Error('Session Expires, Please Login Again');
        }

        const response = await axiosInstance.get('/staff/get-all', {
            params: { branchId }
        });

        return response.data; // Handle the fetched staff
    } catch (error) {
        console.error('Error fetching staff:', error);
    }
};

// Fetch a staff by ID
export const getStaffById = async (id) => {
    try {
        const response = await axiosInstance.get(`/staff/get-by-id/${id}`);
        return response.data; // Handle the fetched staff data
    } catch (error) {
        console.error('Error fetching staff by ID:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
        });
        throw error;
    }
};

// Create a new staff
export const createStaff = async (staffData) => {
    try {
        const response = await axiosInstance.post('/staff/create', staffData);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Staff created successfully!',
        });
        return response.data; // Handle the newly created staff
    } catch (error) {
        console.error('Error creating Staff:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
        });
        throw error;
    }
};

// Update a staff by ID
export const updateStaff = async (id, staffData) => {
    try {
        const response = await axiosInstance.put(`/staff/update/${id}`, staffData);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Teacher updated successfully!',
        });
        return response.data; // Handle the updated staff
    } catch (error) {
        console.error('Error updating staff:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
        });
        throw error;
    }
};

// Delete a staff by ID
export const deleteStaff = async (id) => {
    try {
        const response = await axiosInstance.delete(`/staff/delete/${id}`);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Teacher deleted successfully!',
        });
        return response.data; // Handle the deleted staff
    } catch (error) {
        console.error('Error deleting staff:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
        });
        throw error;
    }
};
