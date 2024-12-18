import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
    getClassesByBranch,
    getSectionsByClass,
    getSubjectsBySection,
    getStudentsByClassAndSection,
    getTeacherAssignments,
    createDiary
} from '../../../api/diaryApi';

const AddDiaryModal = ({ showModal, setShowModal, reloadDiaries }) => {
    const [formData, setFormData] = useState({
        date: '',
        subject: '',
        description: '',
        class: '',
        section: '',
        assignedStudents: [],
        assignToAll: false,
        remarks: '',
    });
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [loadingClasses, setLoadingClasses] = useState(true);
    const [loadingSections, setLoadingSections] = useState(false);
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [assignmentData, setAssignmentData] = useState([]);

    // Fetch classes based on branchId and filter using assignmentData
    const fetchClasses = async () => {
        const branchId = localStorage.getItem('branchId');
        if (!branchId) {
            Swal.fire({
                icon: 'error',
                title: 'Branch ID not found',
                text: 'Please make sure you are logged in as a teacher or admin.',
            });
            return;
        }
        try {
            const assignments = await getTeacherAssignments();
            setAssignmentData(assignments);

            const classData = await getClassesByBranch(branchId);
            console.log(classData);
            // Extract class IDs from assignments
            const assignedClassIds = new Set(assignments.map(a => a.classId._id));
            // Filter classes based on assignmentData
            const filteredClasses = classData.filter(cls => assignedClassIds.has(cls._id));
            setClasses(filteredClasses);
            setLoadingClasses(false);
        } catch (error) {
            console.error('Unable to fetch classes.', error);
            setLoadingClasses(false);
        }
    };

    // Fetch sections based on selected class and filter using assignmentData
    const fetchSections = async (classId) => {
        setLoadingSections(true);
        try {
            const sectionData = await getSectionsByClass(classId);
            // Extract section IDs from assignments for the selected class
            const assignedSections = assignmentData
                .filter(a => a.classId._id === classId)
                .map(a => a.sectionId._id);
            const assignedSectionSet = new Set(assignedSections);
            // Filter sections based on assignmentData
            const filteredSections = sectionData.filter(sec => assignedSectionSet.has(sec._id));
            setSections(filteredSections);
            setLoadingSections(false);
        } catch (error) {
            console.error('Unable to fetch sections.', error);
            setLoadingSections(false);
        }
    };

    // Fetch subjects based on selected section and filter using assignmentData
    const fetchSubjects = async (sectionId) => {
        setLoadingSubjects(true);
        try {
            const subjectData = await getSubjectsBySection(sectionId);
            // Extract subject IDs from assignments for the selected section
            const assignedSubjects = assignmentData
                .filter(a => a.sectionId._id === sectionId)
                .map(a => a.subjectId._id);
            const assignedSubjectSet = new Set(assignedSubjects);
            // Filter subjects based on assignmentData
            const filteredSubjects = subjectData.filter(sub => assignedSubjectSet.has(sub._id));
            setSubjects(filteredSubjects);
            setLoadingSubjects(false);
        } catch (error) {
            console.error('Unable to fetch subjects.', error);
            setLoadingSubjects(false);
        }
    };

    // Fetch students based on selected class and section
    const fetchStudents = async (classId, sectionId) => {
        setLoadingStudents(true);
        try {
            const studentData = await getStudentsByClassAndSection(classId, sectionId);
            setStudents(studentData);
            setLoadingStudents(false);
        } catch (error) {
            console.error('Unable to fetch students.', error);
            setLoadingStudents(false);
        }
    };

    useEffect(() => {
        if (showModal) {
            fetchClasses();
        }
    }, [showModal]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
            if (name === 'assignToAll' && checked) {
                setFormData((prevData) => ({ ...prevData, assignedStudents: [] }));
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Handle class selection
    const handleClassChange = (e) => {
        const classId = e.target.value;
        setFormData({
            ...formData,
            class: classId,
            section: '',
            subject: '',
            assignedStudents: [],
            assignToAll: false,
        });
        setSections([]);
        setSubjects([]);
        setStudents([]);
        if (classId) {
            fetchSections(classId);
        }
    };

    // Handle section selection
    const handleSectionChange = (e) => {
        const sectionId = e.target.value;
        setFormData({
            ...formData,
            section: sectionId,
            subject: '',
            assignedStudents: [],
            assignToAll: false,
        });
        setSubjects([]);
        setStudents([]);
        if (sectionId) {
            fetchSubjects(sectionId);
            if (formData.class && sectionId) {
                fetchStudents(formData.class, sectionId);
            }
        }
    };

    // Handle subject selection
    const handleSubjectChange = (e) => {
        const subjectId = e.target.value;
        setFormData({
            ...formData,
            subject: subjectId,
        });
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
        setFormData({ ...formData, assignedStudents: selected });
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
            await createDiary(formData);
            Swal.fire({
                icon: 'success',
                title: 'Diary entry created successfully!',
            });
            setShowModal(false);
            reloadDiaries();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to create diary entry. Please try again.',
            });
        }
    };

    const resetForm = () => {
        setFormData({
            date: '',
            subject: '',
            description: '',
            class: '',
            section: '',
            assignedStudents: [],
            assignToAll: false,
            remarks: '',
        });
        setClasses([]);
        setSections([]);
        setSubjects([]);
        setStudents([]);
        setAssignmentData([]);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    const handleOverlayClick = (e) => {
        if (e.target.id === 'modalOverlay') {
            handleCloseModal();
        }
    };

    useEffect(() => {
        if (!showModal) {
            resetForm();
        }
    }, [showModal]);

    if (!showModal) return null;

    return (
        <div
            id="modalOverlay"
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 mt-16"
            onClick={handleOverlayClick}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl overflow-y-auto max-h-full"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Add New Diary</h2>
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
                        {loadingClasses ? (
                            <p>Loading classes...</p>
                        ) : (
                            <select
                                name="class"
                                value={formData.class}
                                onChange={handleClassChange}
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
                        )}
                    </div>

                    {/* Section Selection */}
                    {formData.class && (
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Section</label>
                            {loadingSections ? (
                                <p>Loading sections...</p>
                            ) : (
                                <select
                                    name="section"
                                    value={formData.section}
                                    onChange={handleSectionChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    <option value="">Select Section</option>
                                    {sections.map((sec) => (
                                        <option key={sec._id} value={sec._id}>
                                            {sec.sectionName}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    )}

                    {/* Subject Selection */}
                    {formData.section && (
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Subject</label>
                            {loadingSubjects ? (
                                <p>Loading subjects...</p>
                            ) : (
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleSubjectChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    <option value="">Select Subject</option>
                                    {subjects.map((sub) => (
                                        <option key={sub._id} value={sub._id}>
                                            {sub.subjectName}
                                        </option>
                                    ))}
                                </select>
                            )}
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
                            {loadingStudents ? (
                                <p>Loading students...</p>
                            ) : (
                                <select
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
                            )}
                        </div>
                    )}

                    {/* Remarks */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold">Remarks</label>
                        <textarea
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            rows="3"
                            placeholder="Optional remarks"
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
                            Submit Diary
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDiaryModal;
