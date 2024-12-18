import axiosInstance from '../../axiosInstance';
import Swal from 'sweetalert2';

// Fetch all Holidays
export const fetchHolidays = async () => {
    try {
        const response = await axiosInstance.get('/holiday/get-all');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching holidays:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Failed to fetch holidays.',
        });
        throw error;
    }
};

// Create a new Holiday
export const createHoliday = async (holidayData) => {
    try {
        const response = await axiosInstance.post('/holiday/create', holidayData);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Holiday created successfully!',
        });
        return response.data;
    } catch (error) {
        console.error('Error creating holiday:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Failed to create holiday.',
        });
        throw error;
    }
};

// Update an existing Holiday
export const updateHoliday = async (id, holidayData) => {
    try {
        const response = await axiosInstance.put(`/holiday/update/${id}`, holidayData);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Holiday updated successfully!',
        });
        return response.data;
    } catch (error) {
        console.error('Error updating holiday:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Failed to update holiday.',
        });
        throw error;
    }
};

// Delete a Holiday
export const deleteHoliday = async (id) => {
    try {
        const response = await axiosInstance.delete(`/holiday/delete/${id}`);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Holiday deleted successfully!',
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting holiday:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Failed to delete holiday.',
        });
        throw error;
    }
};