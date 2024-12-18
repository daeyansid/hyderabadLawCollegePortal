import axiosInstance from '../axiosInstance';

// Create a new BranchClassDay
export const createBranchClassDay = async (branchClassDayData) => {
    try {
        const response = await axiosInstance.post('/branch-class-days/create', branchClassDayData);
        return response.data;
    } catch (error) {
        console.error('Error creating branch class day:', error);
        throw error;
    }
};

// Get all BranchClassDays by Branch ID
export const getAllBranchClassDays = async () => {
    try {
        const branchId = localStorage.getItem('branchId');

        if (!branchId) {
            throw new Error('Branch ID not found in localStorage');
        }

        const endpoint = `/branch-class-days/branch/${branchId}`;
        
        const response = await axiosInstance.get(endpoint);

        return response.data.data;
    } catch (error) {
        console.error('Error fetching branch class days:', error);
        throw error;
    }
};

// get branch day data by day id 
export const getDayById = async (dayId) => {
    try {
        const response = await axiosInstance.get(`/branch-class-days/dayId/${dayId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching Branch Class Days:', error);
        throw error.response?.data || { message: 'An error occurred while fetching Branch Class Days.' };
    }
};

// Delete a BranchClassDay
export const deleteBranchClassDay = async (id) => {
    try {
        const response = await axiosInstance.delete(`/branch-class-days/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting branch class day:', error);
        throw error;
    }
};