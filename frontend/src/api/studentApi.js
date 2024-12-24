import axiosInstance from '../axiosInstance';
import Swal from 'sweetalert2';

// Fetch all students for a specific branch
export const fetchStudents = async () => {
    try {
        const branchId = localStorage.getItem('branchId');
        if (!branchId) {
            throw new Error('Branch ID is missing from local storage');
        }

        const response = await axiosInstance.get('/student/get-all', {
            params: { branchId }
        });

        return response.data; // Handle the fetched students
    } catch (error) {
        console.error('Error fetching students:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unable to fetch students. Please try again later.',
        });
        throw error;
    }
};

// Fetch a student by ID
export const fetchStudentById = async (id) => {
    try {
        const response = await axiosInstance.get(`/student/get-by-id/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching student by ID:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unable to fetch student details. Please try again later.',
        });
        throw error;
    }
};

// Create a new student
export const createStudent = async (studentData) => {
    try {
        const response = await axiosInstance.post('/student/create', studentData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Student created successfully!',
        });
        return response.data; // Handle the newly created student
    } catch (error) {
        console.error('Error creating student:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
        });
        throw error;
    }
}

// Update a student by ID
export const updateStudent = async (id, studentData) => {
    try {
        const response = await axiosInstance.put(`/student/update/${id}`, studentData);
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Student updated successfully!',
        });
        return response.data; // Handle the updated student
    } catch (error) {
        console.error('Error updating student:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
        });
        throw error;
    }
};

export const deleteStudent = async (studentId) => {
    try {

            // Make the DELETE request to the backend
            const response = await axiosInstance.delete(`/student/delete/${studentId}`);
            return response.data;

    } catch (error) {
        console.error('Error deleting student:', error);

        // Show error message
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'An error occurred.',
        });

        throw error;
    }
};

// Fetch a guardian by CNIC
export const fetchGuardianByCnic = async (cnic) => {
    try {
        const response = await axiosInstance.get(`/guardian/get-by-cnic/${cnic}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching guardian by CNIC:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message,
        });
        throw error;
    }
};

// Fetch classes by branchId
export const fetchClasses = async (branchId) => {
    try {
        const response = await axiosInstance.get(`/class/classes?branchId=${branchId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching classes:', error);
        throw error;
    }
};

// Fetch subject by classId and branchId
export const fetchSubjectByClassAndBranch = async (classId, branchId) => {
    try {
        const response = await axiosInstance.get(`/subject/get-all-subject-by-class-batch?classId=${classId}&branchId=${branchId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching sections:', error);
        throw error;
    }
};

export const fetchStudentsByBatchYear = async (batchYear) => {
    try {
        const response = await axiosInstance.get('/student/fetch-by-batch-year', {
            params: { batchYear}
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching students by batch year and branch ID:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unable to fetch students by batch year and branch. Please try again later.',
        });
        throw error;
    }
};

// Fetch students by semester ID
export const fetchStudentsBySemester = async (semesterId) => {
    try {
        const response = await axiosInstance.get(`/student/by-semester/${semesterId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching students by semester:', error);
        throw error;
    }
};