import axiosInstance from '../axiosInstance';
import Swal from 'sweetalert2';

// Create new test record
export const createTest = async (testData) => {
    try {
        const response = await axiosInstance.post('/student-test/create', testData);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Test record created successfully!'
        });
        return response.data;
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Error creating test record'
        });
        throw error;
    }
};

// Get all tests
export const getAllTests = async () => {
    try {
        const response = await axiosInstance.get('/student-test/get-all');
        return response.data;
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unable to fetch test records'
        });
        throw error;
    }
};

// Get tests by classId and studentId
export const getTestsByClassAndStudent = async (classId, studentId) => {
    try {
        const response = await axiosInstance.get('/student-test/get-by-class-and-student', {
            params: { classId, studentId }
        });
        return response.data;
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unable to fetch test records'
        });
        throw error;
    }
};

// Update test
export const updateTest = async (id, testData) => {
    try {
        const response = await axiosInstance.put(`/student-test/update-by-id&id=${id}`, testData);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Test record updated successfully!'
        });
        return response.data;
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Error updating test record'
        });
        throw error;
    }
};

// Delete test
export const deleteTest = async (id) => {
    try {
        const response = await axiosInstance.delete(`/student-test/delete&id=${id}`);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Test record deleted successfully!'
        });
        return response.data;
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error deleting test record'
        });
        throw error;
    }
};
