import axiosInstance from '../axiosInstance';

// Check if the selected date is a holiday
export const checkHoliday = async (date) => {
    return await axiosInstance.get('/class-attendance/check-holiday', {
        params: { date },
    });
};

// Check if the teacher is present (dummy for now)
export const checkTeacherAttendance = async () => {
    return await axiosInstance.get('/class-attendance/check-teacher-attendance');
};

// Check if attendance exists for the given date and class
export const checkAttendanceExists = async (date, classId, sectionId, subjectId, teacherId) => {
    return await axiosInstance.get('/class-attendance/check-attendance', {
        params: {
            date,
            classId,
            sectionId,
            subjectId,
            teacherId
        },
    });
};

// Get existing attendance records
export const getAttendanceRecords = async (date, classId, sectionId, subjectId, teacherId) => {
    return await axiosInstance.get('/class-attendance/attendance-records', {
        params: {
            date,
            classId,
            sectionId,
            subjectId,
            teacherId
        },
    });
};

// Get the list of students for the class and section
export const getStudentsList = async (classId, sectionId) => {
    return await axiosInstance.get('/class-attendance/students-list', {
        params: {
            classId,
            sectionId,
        },
    });
};

// Save attendance records
export const saveAttendanceRecords = async (date, classId, sectionId, subjectId,  teacherId, attendanceData) => {
    return await axiosInstance.post('/class-attendance/save-attendance', {
        date,
        classId,
        sectionId,
        subjectId,
        teacherId,
        attendanceData,
    });
};
