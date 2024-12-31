import React, { useState, useEffect } from 'react';
import { fetchClasses } from '../../../api/studentApi';
import { fetchStudentsByClass } from '../../../api/studentApi';
import { promoteStudents } from '../../../api/promoteApi';
import Swal from 'sweetalert2';

function MakePromotion() {
    const [classes, setClasses] = useState([]);
    const [selectedFromClass, setSelectedFromClass] = useState('');
    const [selectedToClass, setSelectedToClass] = useState('');
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadClasses();
    }, []);

    const loadClasses = async () => {
        try {
            const branchId = localStorage.getItem('branchId');
            const response = await fetchClasses(branchId);
            setClasses(response.data);
        } catch (error) {
            console.error('Error loading classes:', error);
        }
    };

    const loadStudents = async (classId) => {
        try {
            setLoading(true);
            const response = await fetchStudentsByClass(classId);
            console.log("response student -> ", response.data);
            setStudents(response.data);
        } catch (error) {
            console.error('Error loading students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFromClassChange = (e) => {
        const classId = e.target.value;
        setSelectedFromClass(classId);
        setSelectedStudents([]);
        if (classId) {
            loadStudents(classId);
        } else {
            setStudents([]);
        }
    };

    const handleStudentSelection = (studentId) => {
        setSelectedStudents(prev => {
            if (prev.includes(studentId)) {
                return prev.filter(id => id !== studentId);
            }
            return [...prev, studentId];
        });
    };

    const resetForm = () => {
        setSelectedFromClass('');
        setSelectedToClass('');
        setSelectedStudents([]);
        setStudents([]);
    };

    const handlePromote = async () => {
        if (!selectedFromClass || !selectedToClass || selectedStudents.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please select both classes and at least one student',
            });
            return;
        }

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to promote ${selectedStudents.length} students?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, promote them!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                await promoteStudents(selectedFromClass, selectedToClass, selectedStudents);
                // Show success message
                await Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Students promoted successfully',
                    timer: 2000,
                    showConfirmButton: false
                });
                // Reset the form
                resetForm();
            } catch (error) {
                console.error('Error during promotion:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to promote students. Please try again.',
                });
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Student Promotion Management
                </h2>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <select
                        className="form-select w-full md:w-1/4 p-2 rounded-lg border-2 border-blue-200 
                                 focus:border-blue-500 focus:ring focus:ring-blue-200 
                                 transition-all duration-200 bg-white shadow-sm"
                        value={selectedFromClass}
                        onChange={handleFromClassChange}
                    >
                        <option value="">Select From Class</option>
                        {classes.map(cls => (
                            <option key={cls._id} value={cls._id}>
                                {cls.className}
                            </option>
                        ))}
                    </select>

                    <select
                        className="form-select w-full md:w-1/4 p-2 rounded-lg border-2 border-blue-200 
                                 focus:border-blue-500 focus:ring focus:ring-blue-200 
                                 transition-all duration-200 bg-white shadow-sm"
                        value={selectedToClass}
                        onChange={(e) => setSelectedToClass(e.target.value)}
                    >
                        <option value="">Select To Class</option>
                        {classes
                            .filter(cls => {
                                const fromClassIndex = classes.findIndex(c => c._id === selectedFromClass);
                                const currentIndex = classes.findIndex(c => c._id === cls._id);
                                return currentIndex > fromClassIndex;
                            })
                            .map(cls => (
                                <option key={cls._id} value={cls._id}>
                                    {cls.className}
                                </option>
                            ))}
                    </select>

                    <button
                        className={`w-full md:w-auto px-6 py-2 rounded-lg font-semibold text-white 
                                  transition-all duration-200 transform hover:scale-105
                                  ${(!selectedFromClass || !selectedToClass || selectedStudents.length === 0)
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg'
                            }`}
                        onClick={handlePromote}
                        disabled={!selectedFromClass || !selectedToClass || selectedStudents.length === 0}
                    >
                        Promote Selected Students
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-blue-500 to-indigo-600">
                                <tr>
                                    <th className="p-3 text-left text-white">Select</th>
                                    <th className="p-3 text-left text-white">Name</th>
                                    <th className="p-3 text-left text-white">Roll Number</th>
                                    <th className="p-3 text-left text-white">Current Class</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {students.map(student => (
                                    <tr key={student._id}
                                        className="hover:bg-blue-50 transition-colors duration-200">
                                        <td className="p-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedStudents.includes(student._id)}
                                                onChange={() => handleStudentSelection(student._id)}
                                                className="w-4 h-4 text-blue-600 rounded border-gray-300 
                                                         focus:ring-blue-500 cursor-pointer"
                                            />
                                        </td>
                                        <td className="p-3 text-gray-800">{student.fullName}</td>
                                        <td className="p-3 text-gray-600">{student.rollNumber}</td>
                                        <td className="p-3 text-gray-600">{student.classId.className}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {students.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No students available in this class
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MakePromotion;