import axiosInstance from '../axiosInstance';

// Create new fee details
export const createFeeDetails = async (formData) => {
    try {
        const response = await axiosInstance.post('/feeDetails/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error creating fee details:', error);
        throw error;
    }
};

// Get all fee details
export const getAllFeeDetails = async () => {
    try {
        const response = await axiosInstance.get('/feeDetails/get-all');
        return response.data;
    } catch (error) {
        console.error('Error fetching fee details:', error);
        throw error;
    }
};

// Get fee details by student ID
export const getFeeDetailsByStudentId = async (studentId) => {
    try {
        const response = await axiosInstance.get(`/feeDetails/student/${studentId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching student fee details:', error);
        throw error;
    }
};

// Get fee details by class ID
export const getFeeDetailsByClassId = async (classId) => {
    try {
        const response = await axiosInstance.get(`/feeDetails/class/${classId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching class fee details:', error);
        throw error;
    }
};

// Get fee detail by ID with populated data
export const getFeeDetailById = async (id) => {
    try {
        const response = await axiosInstance.get(`/feeDetails/get-by-id/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching fee detail:', error);
        throw error;
    }
};

// Update fee details
export const updateFeeDetails = async (id, formData) => {
    try {
        const response = await axiosInstance.put(`/feeDetails/update/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating fee details:', error);
        throw error;
    }
};

// Delete fee details
export const deleteFeeDetails = async (id) => {
    try {
        const response = await axiosInstance.delete(`/feeDetails/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting fee details:', error);
        throw error;
    }
};
