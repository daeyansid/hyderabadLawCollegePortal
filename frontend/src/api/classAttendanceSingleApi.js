import axiosInstance from '../axiosInstance';

// Check if the selected date is a holiday
export const checkHoliday = async (date) => {
    return await axiosInstance.get('/class-attendance-single/check-holiday', {
        params: { date },
    });
};

// Check if the teacher is present (dummy for now)
export const checkTeacherAttendance = async () => {
    return await axiosInstance.get('/class-attendance-single/check-teacher-attendance');
};

// Check if attendance exists for the given date and class
export const checkAttendanceExists = async (date, classId, teacherId, slotId) => {
    return await axiosInstance.get('/class-attendance-single/check-attendance', {
        params: {
            date,
            classId,
            teacherId,
            slotId
        },
    });
};

// Get existing attendance records
export const getAttendanceRecords = async (date, classId, teacherId, slotId) => {
    return await axiosInstance.get('/class-attendance-single/attendance-records', {
        params: {
            date,
            classId,
            teacherId,
            slotId
        },
    });
};

// Get the list of students for the class and section
export const getStudentsList = async (classId) => {
    return await axiosInstance.get('/class-attendance-single/students-list', {
        params: {
            classId,
        },
    });
};

// Save attendance records
export const saveAttendanceRecords = async (date, classId, teacherId, attendanceData, slotId) => {
    return await axiosInstance.post('/class-attendance-single/save-attendance', {
        date,
        classId,
        teacherId,
        attendanceData,
        slotId
    });
};
