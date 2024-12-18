import axiosInstance from '../axiosInstance';
import Swal from 'sweetalert2';

// Fetch all sections
export const fetchSections = async () => {
    try {
        const branchId = localStorage.getItem('branchId');
        
        if (!branchId) {
            throw new Error('Branch ID is not available in localStorage.');
        }

        const response = await axiosInstance.get('/section/get-all', {
            params: { branchId }
        });

        return response.data;
    } catch (error) {
        throw new Error("No section Found");
    }
};

// Fetch Sections by Section ID and Branch ID
export const getSectionsByClassAndBranchId = async (sectionId, branchId) => {
    try {
        const response = await axiosInstance.get(`/section/by-section-and-branch?sectionId=${sectionId}&branchId=${branchId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching Sections:', error);
        throw error.response?.data || { message: 'An error occurred while fetching Sections.' };
    }
};

// Fetch section by ID
export const fetchSectionById = async (id) => {
    try {
        const response = await axiosInstance.get(`/section/get-by-id/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching section by ID:', error);
    }
};

// Create a new section
export const createSection = async (sectionData) => {
    try {
        const branchId = localStorage.getItem('branchId');
        if (!branchId) {
            throw new Error('Branch ID is not available in localStorage.');
        }
        const response = await axiosInstance.post('/section/create', { ...sectionData, branchId });
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Section created successfully!',
        });
        return response.data;
    } catch (error) {
        console.error('Error creating section:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
        });
        throw error;
    }
};

// Update a section
export const updateSection = async (id, sectionData) => {
    try {
        const response = await axiosInstance.put(`/section/update/${id}`, sectionData);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Section updated successfully!',
        });
        return response.data;
    } catch (error) {
        console.error('Error updating section:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
        });
        throw error;
    }
};

// Delete a section
export const deleteSection = async (id) => {
    try {
        const response = await axiosInstance.delete(`/section/delete/${id}`);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Section deleted successfully!',
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting section:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
        });
        throw error;
    }
};