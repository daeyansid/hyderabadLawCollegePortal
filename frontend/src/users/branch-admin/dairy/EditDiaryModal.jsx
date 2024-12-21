import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
    getClassesByBranch,
    getSubjectsByClass,
    getStudentsByClass,
    updateDiary,
    getDiaryById,
} from '../../../api/diaryApi';

const EditDiaryModal = ({ showModal, setShowModal, diaryId, reloadDiaries }) => {
    const [formData, setFormData] = useState({
        date: '',
        classId: '',
        subjectId: '',
        description: '',
        assignToAll: false,
        assignedStudents: [],
        remarks: '',
    });
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState({
        classes: true,
        subjects: false,
        students: false,
    });

    useEffect(() => {
        if (showModal && diaryId) {
            fetchDiaryData();
            fetchClasses();
        }
    }, [showModal, diaryId]);

    const fetchDiaryData = async () => {
        try {
            const diary = await getDiaryById(diaryId);
            setFormData({
                date: new Date(diary.date).toISOString().substring(0, 10),
                classId: diary.class._id,
                subjectId: diary.subject._id,
                description: diary.description,
                assignToAll: diary.assignToAll,
                assignedStudents: diary.assignedStudents.map((student) => student._id),
                remarks: diary.remarks || '',
            });

            fetchSubjects(diary.class._id);
            fetchStudents(diary.class._id);
        } catch (error) {
            Swal.fire('Error', 'Unable to fetch notice data.', 'error');
        }
    };

    const fetchClasses = async () => {
        setLoading((prev) => ({ ...prev, classes: true }));
        try {
            const branchId = localStorage.getItem('branchId');
            const classData = await getClassesByBranch(branchId);
            setClasses(classData);
        } catch (error) {
            Swal.fire('Error', 'Unable to fetch semester.', 'error');
        } finally {
            setLoading((prev) => ({ ...prev, classes: false }));
        }
    };

    const fetchSubjects = async (classId) => {
        setLoading((prev) => ({ ...prev, subjects: true }));
        try {
            const subjectData = await getSubjectsByClass(classId);

            if (!subjectData || subjectData.length === 0) {
                Swal.fire('Warning', 'No subjects found for this semester.', 'warning');
                setSubjects([]);
            } else {
                setSubjects(subjectData);
            }
        } catch (error) {
            Swal.fire('Error', 'Unable to fetch subjects.', 'error');
        } finally {
            setLoading((prev) => ({ ...prev, subjects: false }));
        }
    };

    const fetchStudents = async (classId) => {
        setLoading((prev) => ({ ...prev, students: true }));
        try {
            const studentData = await getStudentsByClass(classId);
            setStudents(studentData);
        } catch (error) {
            Swal.fire('Error', 'Unable to fetch students.', 'error');
        } finally {
            setLoading((prev) => ({ ...prev, students: false }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData((prev) => ({ ...prev, [name]: checked }));
            if (name === 'assignToAll' && checked) {
                setFormData((prev) => ({ ...prev, assignedStudents: [] }));
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        if (name === 'classId') {
            setFormData((prev) => ({ ...prev, subjectId: '', assignedStudents: [] }));
            setSubjects([]);
            setStudents([]);
            fetchSubjects(value);
        }

        if (name === 'subjectId') {
            fetchStudents(formData.classId);
        }
    };

    const handleStudentSelection = (e) => {
        const options = e.target.options;
        const selected = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selected.push(options[i].value);
            }
        }
        setFormData((prev) => ({ ...prev, assignedStudents: selected }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.assignToAll && formData.assignedStudents.length === 0) {
            Swal.fire('Validation Error', 'Please assign the notice to at least one student or select "Assign To All".', 'error');
            return;
        }
        try {
            await updateDiary(diaryId, formData);
            Swal.fire('Success', 'notice entry updated successfully.', 'success');
            handleCloseModal();
            reloadDiaries();
        } catch (error) {
            Swal.fire('Error', 'Failed to update notice entry.', 'error');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
            date: '',
            classId: '',
            subjectId: '',
            description: '',
            assignToAll: false,
            assignedStudents: [],
            remarks: '',
        });
        setClasses([]);
        setSubjects([]);
        setStudents([]);
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50" onClick={handleCloseModal}>
            <div className="bg-white p-6 h-[500px] rounded-lg shadow-lg w-full max-w-2xl overflow-y-scroll" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Edit Notice Entry</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium">Date</label>
                            <input
                                type="date"
                                name="date"
                                disabled
                                value={formData.date}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Semester</label>
                            <select
                                name="classId"
                                value={formData.classId}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select Semester</option>
                                {classes.map((cls) => (
                                    <option key={cls._id} value={cls._id}>{cls.className}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Subject</label>
                            <select
                                name="subjectId"
                                value={formData.subjectId}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select Subject</option>
                                {subjects.map((sub) => (
                                    <option key={sub._id} value={sub._id}>{sub.subjectName}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-gray-700 font-medium">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                rows="3"
                                required
                            ></textarea>
                        </div>

                        <div className="col-span-2 flex items-center">
                            <input
                                type="checkbox"
                                name="assignToAll"
                                checked={formData.assignToAll}
                                onChange={handleInputChange}
                                className="mr-2"
                            />
                            <label className="text-gray-700 font-medium">Assign To All</label>
                        </div>

                        {!formData.assignToAll && (
                            <div className="col-span-2">
                                <label className="block text-gray-700 font-medium">Assign to Students</label>
                                <select
                                    multiple
                                    value={formData.assignedStudents}
                                    onChange={handleStudentSelection}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                >
                                    {students && students.length > 0 ? (
                                        students.map((student) => (
                                            <option key={student._id} value={student._id}>
                                                {student.fullName} ({student.rollNumber})
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>
                                            No students found
                                        </option>
                                    )}

                                </select>
                            </div>
                        )}

                        <div className="col-span-2">
                            <label className="block text-gray-700 font-medium">Remarks</label>
                            <textarea
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                rows="3"
                            ></textarea>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Update Notice
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditDiaryModal;
