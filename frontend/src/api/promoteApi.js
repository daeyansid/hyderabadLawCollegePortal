import axiosInstance from '../axiosInstance';
import Swal from 'sweetalert2';

export const promoteStudents = async (fromClassId, toClassId, studentIds) => {
    try {
        const response = await axiosInstance.post('/promote/create', {
            fromClassId,
            toClassId,
            studentIds
        });
        
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Students promoted successfully!',
        });
        
        return response.data;
    } catch (error) {
        console.error('Error promoting students:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Failed to promote students',
        });
        throw error;
    }
};
