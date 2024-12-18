import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
    updateDiary,
    getDiaryById,
    getClassesByBranch,
    getSectionsByClass,
    getSubjectsBySection,
    getStudentsByClassAndSection,
    getTeacherAssignments
} from '../../../api/diaryApi';

const EditDiaryModal = ({ showModal, setShowModal, diaryId, reloadDiaries }) => {
    const [formData, setFormData] = useState({
        date: '',
        subject: '',
        description: '',
        class: '',
        section: '',
        remarks: '',
        assignedStudents: [],
        assignToAll: false,
    });
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assignmentData, setAssignmentData] = useState([]);

    const branchId = localStorage.getItem('branchId'); // Assuming branchId is stored in localStorage

    // Fetch teacher assignments
    const fetchAssignments = async () => {
        try {
            const assignments = await getTeacherAssignments();
            setAssignmentData(assignments);
        } catch (error) {
            console.error('Error fetching assignments', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to fetch teacher assignments.',
            });
        }
    };

    // Fetch diary data and pre-populate form
    const fetchDiaryData = async () => {
        try {
            const diary = await getDiaryById(diaryId);
            const formattedDate = new Date(diary.date).toISOString().substring(0, 10);
            setFormData({
                date: formattedDate,
                subject: diary.subject._id,
                description: diary.description,
                class: diary.class._id,
                section: diary.section._id,
                remarks: diary.remarks || '',
                assignedStudents: diary.assignedStudents.map(student => student._id),
                assignToAll: diary.assignToAll,
            });

            // Fetch assignments first
            await fetchAssignments();

            // Fetch classes, sections, subjects, and students
            await fetchClasses(branchId, diary.class._id); // Pass selectedClassId to ensure it's included
            await fetchSections(diary.class._id, diary.section._id); // Pass selectedSectionId
            await fetchSubjects(diary.section._id, diary.subject._id); // Pass selectedSubjectId
            await fetchStudents(diary.class._id, diary.section._id); // Fetch students for the selected class and section

            setLoading(false);
        } catch (error) {
            console.error('Error fetching diary data', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to fetch diary data.',
            });
            setLoading(false);
        }
    };

    useEffect(() => {
        if (showModal && diaryId) {
            fetchDiaryData();
        }
    }, [showModal, diaryId]);

    // Fetch classes based on branchId and filter using assignmentData
    const fetchClasses = async (branchId, selectedClassId = null) => {
        try {
            const classData = await getClassesByBranch(branchId);

            // Extract class IDs from assignments
            const assignedClassIds = new Set(assignmentData.map(a => a.classId._id));

            // Always include the selected class to ensure it's available for editing
            if (selectedClassId) {
                assignedClassIds.add(selectedClassId);
            }

            // Filter classes based on assignmentData
            const filteredClasses = classData.filter(cls => assignedClassIds.has(cls._id));

            setClasses(filteredClasses);
        } catch (error) {
            console.error('Error fetching classes', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to fetch classes.',
            });
        }
    };

    // Fetch sections based on classId and filter using assignmentData
    const fetchSections = async (classId, selectedSectionId = null) => {
        try {
            const sectionData = await getSectionsByClass(classId);

            // Extract section IDs from assignments for the selected class
            const assignedSections = assignmentData
                .filter(a => a.classId._id === classId)
                .map(a => a.sectionId._id);

            const assignedSectionSet = new Set(assignedSections);

            // Always include the selected section to ensure it's available for editing
            if (selectedSectionId) {
                assignedSectionSet.add(selectedSectionId);
            }

            // Filter sections based on assignmentData
            const filteredSections = sectionData.filter(sec => assignedSectionSet.has(sec._id));

            setSections(filteredSections);
        } catch (error) {
            console.error('Error fetching sections', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to fetch sections.',
            });
        }
    };

    // Fetch subjects based on sectionId and filter using assignmentData
    const fetchSubjects = async (sectionId, selectedSubjectId = null) => {
        try {
            const subjectData = await getSubjectsBySection(sectionId);

            // Extract subject IDs from assignments for the selected section
            const assignedSubjects = assignmentData
                .filter(a => a.sectionId._id === sectionId)
                .map(a => a.subjectId._id);

            const assignedSubjectSet = new Set(assignedSubjects);

            // Always include the selected subject to ensure it's available for editing
            if (selectedSubjectId) {
                assignedSubjectSet.add(selectedSubjectId);
            }

            // Filter subjects based on assignmentData
            const filteredSubjects = subjectData.filter(sub => assignedSubjectSet.has(sub._id));

            setSubjects(filteredSubjects);
        } catch (error) {
            console.error('Error fetching subjects', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to fetch subjects.',
            });
        }
    };

    // Fetch students based on classId and sectionId
    const fetchStudents = async (classId, sectionId) => {
        try {
            const studentData = await getStudentsByClassAndSection(classId, sectionId);
            setStudents(studentData);
        } catch (error) {
            console.error('Error fetching students', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to fetch students.',
            });
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
            // Reset dependent fields when higher-level selections change
            ...(name === 'class' ? { section: '', subject: '', assignedStudents: [] } : {}),
            ...(name === 'section' ? { subject: '', assignedStudents: [] } : {}),
        }));

        if (name === 'class') {
            // Fetch sections for the selected class
            fetchSections(value);
            setSections([]);
            setSubjects([]);
            setStudents([]);
        } else if (name === 'section') {
            // Fetch subjects and students for the selected section
            fetchSubjects(value);
            fetchStudents(formData.class, value);
            setSubjects([]);
            setStudents([]);
        }
    };

    // Handle student selection
    const handleStudentSelection = (e) => {
        const options = e.target.options;
        const selected = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selected.push(options[i].value);
            }
        }
        setFormData(prevData => ({ ...prevData, assignedStudents: selected }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.assignToAll && formData.assignedStudents.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please assign the diary to at least one student or select "Assign To All".',
            });
            return;
        }

        try {
            await updateDiary(diaryId, formData);
            Swal.fire({
                icon: 'success',
                title: 'Diary updated successfully!',
            });
            setShowModal(false);
            reloadDiaries(); // Reload the list of diaries after update
        } catch (error) {
            console.error('Error updating diary', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update diary. Please try again.',
            });
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    if (!showModal) return null;

    return (
        <div
            id="modalOverlay"
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
            onClick={(e) => {
                if (e.target.id === 'modalOverlay') handleCloseModal();
            }}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-full overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Edit Diary Entry</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {/* Date */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        {/* Class Selection */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Class</label>
                            <select
                                name="class"
                                value={formData.class}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select Class</option>
                                {classes.map((cls) => (
                                    <option key={cls._id} value={cls._id}>
                                        {cls.className}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Section Selection */}
                        {formData.class && (
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold">Section</label>
                                <select
                                    name="section"
                                    value={formData.section}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    <option value="">Select Section</option>
                                    {sections.map((section) => (
                                        <option key={section._id} value={section._id}>
                                            {section.sectionName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Subject Selection */}
                        {formData.section && (
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold">Subject</label>
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    <option value="">Select Subject</option>
                                    {subjects.map((subject) => (
                                        <option key={subject._id} value={subject._id}>
                                            {subject.subjectName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Description */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                rows="3"
                                required
                                placeholder="Enter description"
                            ></textarea>
                        </div>

                        {/* Assign To All */}
                        {formData.class && formData.section && (
                            <div className="mb-4 flex items-center">
                                <label className="block text-gray-700 font-semibold">Assign To All</label>
                                <input
                                    type="checkbox"
                                    name="assignToAll"
                                    checked={formData.assignToAll}
                                    onChange={handleInputChange}
                                    className="ml-2"
                                />
                            </div>
                        )}

                        {/* Student Selection */}
                        {!formData.assignToAll && formData.section && (
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold">Assign to Students</label>
                                <select
                                    name="assignedStudents"
                                    multiple
                                    value={formData.assignedStudents}
                                    onChange={handleStudentSelection}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required={!formData.assignToAll}
                                >
                                    {students.map((student) => (
                                        <option key={student._id} value={student._id}>
                                            {student.fullName} ({student.rollNumber})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Remarks */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Remarks (Optional)</label>
                            <textarea
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                rows="3"
                            ></textarea>
                        </div>

                        {/* Submit and Cancel Buttons */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                            >
                                Update Diary
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EditDiaryModal;
