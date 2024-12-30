import axiosInstance from '../axiosInstance';

// Check existing attendance by teacherId, classId, slotId, and date
export const checkExistingAttendance = async (teacherId, classId, slotId, date) => {
    try {
        const params = { teacherId, classId, slotId, date };
        const response = await axiosInstance.post('/teacher-attendance/check', { params });
        return response.data;
    } catch (error) {
        console.error('Error checking existing attendance:', error);
        throw error.response?.data || error;
    }
};

// Create a new attendance record
export const createAttendance = async (attendanceData) => {
    try {
        const response = await axiosInstance.post('/teacher-attendance/create', attendanceData);
        return response.status;
    } catch (error) {
        console.error('Error creating attendance:', error);
        throw error.response?.data || error;
    }
};

// Update an attendance record by ID
export const updateAttendance = async (id, attendanceData) => {
    try {
        const response = await axiosInstance.put(`/teacher-attendance/${id}`, attendanceData);
        return response.data;
    } catch (error) {
        console.error('Error updating attendance:', error);
        throw error.response?.data || error;
    }
};

// Get attendance count by month and year
export const getAttendanceCount = async (teacherId, month, year) => {
    try {
        const response = await axiosInstance.get(`/teacher-attendance/count/${teacherId}/${month}/${year}`);
        return response.data;
    } catch (error) {
        console.error('Error getting attendance count:', error);
        throw error.response?.data || error;
    }
};
