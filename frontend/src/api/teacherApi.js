import axiosInstance from '../axiosInstance';
import Swal from 'sweetalert2';

// Fetch all teachers for a specific branch
export const fetchTeachers = async () => {
    try {
        const branchId = localStorage.getItem('branchId');
        if (!branchId) {
            throw new Error('Branch ID is missing from local storage');
        }

        const response = await axiosInstance.get('/teacher/get-all', {
            params: { branchId }
        });

        return response.data; // Handle the fetched teachers
    } catch (error) {
        console.error('Error fetching teachers:', error);
    }
};

// Fetch available Teachers by branch verification
export const getAvailableTeachersByBranchVerification = async (branchId) => {
    try {
        const response = await axiosInstance.get(`/teacher/available-by-branch-verification/${branchId}`);
        return response.data.data.teachers;
    } catch (error) {
        console.error('Error fetching Available Teachers:', error);
        throw error.response?.data || { message: 'An error occurred while fetching Available Teachers.' };
    }
};

// Fetch a teacher by ID
export const fetchTeacherById = async (id) => {
    try {
        const response = await axiosInstance.get(`/teacher/get-by-id/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching teacher by ID:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
        });
        throw error;
    }
};

// Create a new teacher
export const createTeacher = async (teacherData) => {
    try {
        const response = await axiosInstance.post('/teacher/create', teacherData);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Teacher created successfully!',
        });
        return response.data;
    } catch (error) {
        console.error('Error creating teacher:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
        });
        throw error;
    }
};

// Update a teacher by ID
export const updateTeacher = async (id, teacherData) => {
    try {
        const response = await axiosInstance.put(`/teacher/update/${id}`, teacherData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        // Optionally, you can remove the Swal here as it's handled in the component
        return response.data;
    } catch (error) {
        console.error('Error updating teacher:', error);
        if (error.response && error.response.data && error.response.data.message) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message,
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An unexpected error occurred. Please try again later.',
            });
        }
        throw error;
    }
};

// Delete a teacher by ID
export const deleteTeacher = async (id) => {
    try {
        const response = await axiosInstance.delete(`/teacher/delete/${id}`);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Teacher deleted successfully!',
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting teacher:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
        });
        throw error;
    }
};


export const getTeacherDashboardData = async (teacherId, branchId) => {
    const response = await axiosInstance.get('/teacher/dashboard-data', {
        params: {
            teacherId,
            branchId,
        },
    });
    return response.data;
};