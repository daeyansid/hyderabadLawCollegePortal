import axiosInstance from '../axiosInstance';

// Create a new staff leave
export const createStaffLeave = async (leaveData) => {
    const formData = new FormData();
    Object.keys(leaveData).forEach((key) => {
        formData.append(key, leaveData[key]);
    });

    try {
        const response = await axiosInstance.post('/staff-leave/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating staff leave:', error);
        throw error;
    }
};
