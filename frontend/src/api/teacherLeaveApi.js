import axiosInstance from '../axiosInstance';

// Fetch leaves by teacherId
export const getLeavesByTeacherId = async (teacherId) => {
    try {
        const response = await axiosInstance.get(`/teacher-leave/teacher/${teacherId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching leave data:', error);
        throw error;
    }
};

// Create a new leave
export const createLeave = async (leaveData) => {
    try {
        const formData = new FormData();
        Object.keys(leaveData).forEach((key) => {
            formData.append(key, leaveData[key]);
        });

        const response = await axiosInstance.post('/teacher-leave/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating leave request:', error);
        throw error;
    }
};

// Fetch a leave by leaveId
export const getLeaveById = async (leaveId) => {
    try {
        const response = await axiosInstance.get(`/teacher-leave/get/${leaveId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching leave by ID:', error);
        throw error;
    }
};

// Update a leave
export const updateLeave = async (leaveId, formData) => {
    try {
        const response = await axiosInstance.put(`/teacher-leave/update/${leaveId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Required for sending file data
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating leave request:', error);
        throw error;
    }
};

// Delete a leave
export const deleteLeave = async (leaveId) => {
    try {
        const response = await axiosInstance.delete(`/teacher-leave/delete/${leaveId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting leave request:', error);
        throw error;
    }
};
