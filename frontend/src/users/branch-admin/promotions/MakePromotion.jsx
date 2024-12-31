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
                setSelectedStudents([]);
                loadStudents(selectedFromClass);
            } catch (error) {
                console.error('Error during promotion:', error);
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex gap-4 mb-6">
                <select 
                    className="form-select w-1/4"
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
                    className="form-select w-1/4"
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
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handlePromote}
                    disabled={!selectedFromClass || !selectedToClass || selectedStudents.length === 0}
                >
                    Promote Selected Students
                </button>
            </div>

            {loading ? (
                <div>Loading students...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border p-2">Select</th>
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Roll Number</th>
                                <th className="border p-2">Current Class</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student._id}>
                                    <td className="border p-2">
                                        <input 
                                            type="checkbox"
                                            checked={selectedStudents.includes(student._id)}
                                            onChange={() => handleStudentSelection(student._id)}
                                        />
                                    </td>
                                    <td className="border p-2">{student.fullName}</td>
                                    <td className="border p-2">{student.rollNumber}</td>
                                    <td className="border p-2">{student.classId.className}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default MakePromotion;