import axiosInstance from '../../axiosInstance';
import Swal from 'sweetalert2';

// Fetch all branch admins
export const fetchBranchAdmins = async () => {
    try {
        const response = await axiosInstance.get('/branch-admin/get-all-branch-admins');
        return response.data;
    } catch (error) {
        console.error('Error fetching branch admins:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
        });
        throw error;
    }
};

// Delete a branch admin by ID
export const deleteBranchAdmin = async (id) => {
    try {
        const response = await axiosInstance.delete(`/branch-admin/delete-branch-admin/${id}`);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Branch admin deleted successfully!',
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting branch admin:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
        });
        throw error;
    }
};

// Update a branch admin by ID
export const updateBranchAdmin = async (id, branchAdminData) => {
    try {
        const response = await axiosInstance.put(`/branch-admin/update-branch-admin/${id}`, branchAdminData);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Branch admin updated successfully!',
        });
        return response.data;
    } catch (error) {
        console.error('Error updating branch admin:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
        });
        throw error;
    }
};

// Create a new branch admin
export const createBranchAdmin = async (branchAdminData) => {
    try {
        const response = await axiosInstance.post('/branch-admin/create-branch-admin', branchAdminData);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Branch admin created successfully!',
        });
        return response.data;
    } catch (error) {
        console.error('Error creating branch admin:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
        });
        throw error;
    }
};