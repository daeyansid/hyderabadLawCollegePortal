import axiosInstance from '../axiosInstance';
import Swal from 'sweetalert2';

export const createTeacherNotice = async (noticeData) => {
    try {
        const response = await axiosInstance.post('/teacher-notice/create', noticeData);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Notice created successfully!',
        });
        return response.data;
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Error creating notice',
        });
        throw error;
    }
};

export const getAllTeacherNotices = async () => {
    try {
        const response = await axiosInstance.get('/teacher-notice/get-all');
        // Ensure we're returning an array
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error fetching notices',
        });
        return []; // Return empty array on error
    }
};

export const updateTeacherNotice = async (id, noticeData) => {
    try {
        const response = await axiosInstance.put(`/teacher-notice/update&id=${id}`, noticeData);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Notice updated successfully!',
        });
        return response.data;
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Error updating notice',
        });
        throw error;
    }
};

export const deleteTeacherNotice = async (id) => {
    try {
        const response = await axiosInstance.delete(`/teacher-notice/delete&id=${id}`);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Notice deleted successfully!',
        });
        return response.data;
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Error deleting notice',
        });
        throw error;
    }
};
