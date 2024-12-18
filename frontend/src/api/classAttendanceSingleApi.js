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
export const checkAttendanceExists = async (date, classId, sectionId, teacherId) => {
    return await axiosInstance.get('/class-attendance-single/check-attendance', {
        params: {
            date,
            classId,
            sectionId,
            teacherId
        },
    });
};

// Get existing attendance records
export const getAttendanceRecords = async (date, classId, sectionId, teacherId) => {
    return await axiosInstance.get('/class-attendance-single/attendance-records', {
        params: {
            date,
            classId,
            sectionId,
            teacherId
        },
    });
};

// Get the list of students for the class and section
export const getStudentsList = async (classId, sectionId) => {
    return await axiosInstance.get('/class-attendance-single/students-list', {
        params: {
            classId,
            sectionId,
        },
    });
};

// Save attendance records
export const saveAttendanceRecords = async (date, classId, sectionId,  teacherId, attendanceData) => {
    return await axiosInstance.post('/class-attendance-single/save-attendance', {
        date,
        classId,
        sectionId,
        teacherId,
        attendanceData,
    });
};
