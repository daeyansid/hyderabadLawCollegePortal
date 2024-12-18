import axiosInstance from '../axiosInstance';

export const getAllRoles = async () => {
    try {
        const response = await axiosInstance.get('/user-role/get-all');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
};
