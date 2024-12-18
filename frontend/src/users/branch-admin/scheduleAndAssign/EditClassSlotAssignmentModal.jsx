// frontend/src/components/scheduleAndAssign/EditClassSlotAssignmentModal.jsx

import React, { useState, useEffect } from 'react';
import { getDayById } from '../../../api/branchClassDaysApi';
import { getBranchDailyTimeSlotsByDayBranch } from '../../../api/branchDailyTimeSlotsApi';
import { getSectionsByClassAndBranchId } from '../../../api/sectionApi'; // Using the original API name
import { getAllSubjectsBySectionId } from '../../../api/subjectApi';
import { getAvailableTeachersByBranchVerification } from '../../../api/teacherApi';
import { updateClassSlotAssignment, getAllClassSlotAssignments } from '../../../api/classSlotAssignmentsApi';
import Swal from 'sweetalert2';

const EditClassSlotAssignmentModal = ({ showModal, setShowModal, reloadAssignments, assignment }) => {
    const [branchClassDays, setBranchClassDays] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [existingAssignments, setExistingAssignments] = useState([]);
    const [form, setForm] = useState({
        day: assignment.branchClassDaysId,
        timeSlot: assignment.branchDailyTimeSlotsId,
        classId: assignment.classId._id,
        sectionId: assignment.sectionId._id,
        subjectId: assignment.subjectId._id,
        teacherId: assignment.teacherId._id,
        classType: assignment.classType,
    });
    const [isLoading, setIsLoading] = useState(false);

    const branchId = localStorage.getItem('branchId');

    useEffect(() => {
        if (showModal) {
            fetchInitialData();
        }
    }, [showModal]);

    // Fetch Initial Data
    const fetchInitialData = async () => {
        try {
            const dayData = await getDayById(assignment.branchClassDaysId);
            setBranchClassDays(dayData);

            // Set classes and sections from the assignment
            setClasses([assignment.classId]);
            setSections([assignment.sectionId]);

            // Fetch time slots
            await fetchTimeSlots();

            // Fetch subjects for the selected section
            await fetchSubjects();

            // Fetch available teachers
            await fetchAvailableTeachers();

            // Fetch existing assignments for validation
            const assignments = await getAllClassSlotAssignments(assignment.branchClassDaysId);
            setExistingAssignments(assignments);
        } catch (error) {
            console.error(error);
            Swal.fire('Error', error.message || 'Failed to fetch initial data.', 'error');
        }
    };

    // Fetch Time Slots
    const fetchTimeSlots = async () => {
        try {
            const slotsData = await getBranchDailyTimeSlotsByDayBranch(assignment.branchClassDaysId);
            const classSlots = slotsData.filter(slot => slot.slotType === 'Class Slot');
            setTimeSlots(classSlots);
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Failed to load time slots.', 'error');
        }
    };

    // Fetch Subjects
    const fetchSubjects = async () => {
        try {
            const subjectsData = await getAllSubjectsBySectionId(form.sectionId);
            setSubjects(subjectsData);
        } catch (error) {
            console.error(error);
            Swal.fire('Error', error.message || 'Failed to load subjects.', 'error');
        }
    };

    // Fetch Available Teachers
    const fetchAvailableTeachers = async () => {
        try {
            const teachersData = await getAvailableTeachersByBranchVerification(branchId);
            setTeachers(teachersData);
        } catch (error) {
            console.error(error);
            Swal.fire('Error', error.message || 'Failed to load teachers.', 'error');
        }
    };

    // Validation Function
    const validateSlot = () => {
        const { timeSlot, teacherId, classId, sectionId } = form;
        const currentAssignmentId = assignment._id;
    
        // Rule 1: Prevent Duplicate Slot Assignments for the Same Class and Section
        const sameSlotInClassExists = existingAssignments.some(
            (existingAssignment) =>
                existingAssignment.branchDailyTimeSlotsId?._id === timeSlot &&
                existingAssignment.classId?._id === classId &&
                existingAssignment.sectionId?._id === sectionId &&
                existingAssignment._id !== currentAssignmentId
        );
    
        if (sameSlotInClassExists) {
            Swal.fire('Error', 'This slot is already assigned on the same day for the same class and section.', 'error');
            return false;
        }
    
        // Rule 2: Prevent Teacher Reassignment for Same Class and Slot
        const sameTeacherInSameSlotForClass = existingAssignments.some(
            (existingAssignment) =>
                existingAssignment.branchDailyTimeSlotsId?._id === timeSlot &&
                existingAssignment.classId?._id === classId &&
                existingAssignment.teacherId?._id === teacherId &&
                existingAssignment._id !== currentAssignmentId
        );
    
        if (sameTeacherInSameSlotForClass) {
            Swal.fire('Error', 'This teacher is already assigned to this slot on the same day for the same class and section.', 'error');
            return false;
        }
    
        // Rule 3: Prevent Teacher from Teaching Multiple Classes/Sections at the Same Slot
        const teacherAssignedInDifferentClassOrSection = existingAssignments.some(
            (existingAssignment) =>
                existingAssignment.branchDailyTimeSlotsId?._id === timeSlot &&
                existingAssignment.teacherId?._id === teacherId &&
                (existingAssignment.classId?._id !== classId || existingAssignment.sectionId?._id !== sectionId) &&
                existingAssignment._id !== currentAssignmentId
        );
    
        if (teacherAssignedInDifferentClassOrSection) {
            Swal.fire('Error', 'This teacher is already assigned to another class or section for this slot on the same day.', 'error');
            return false;
        }
    
        return true;
    };
    
    

    // Handle Input Changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value,
        }));

        if (name === 'timeSlot') {
            setForm(prevForm => ({
                ...prevForm,
                subjectId: '',
                teacherId: '',
                classType: '',
            }));
            setSubjects([]);
            setTeachers([]);
            fetchSubjects();
        } else if (name === 'subjectId') {
            setForm(prevForm => ({
                ...prevForm,
                teacherId: '',
                classType: '',
            }));
            setTeachers([]);
            fetchAvailableTeachers();
        } else if (name === 'teacherId') {
            setForm(prevForm => ({
                ...prevForm,
                classType: 'Main Class', // Set default value
            }));
        }
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the slot before updating
        if (!validateSlot()) return;

        // Set loading state to true
        setIsLoading(true);

        try {
            const assignmentData = {
                branchClassDaysId: form.day,
                branchDailyTimeSlotsId: form.timeSlot,
                classId: form.classId,
                sectionId: form.sectionId,
                subjectId: form.subjectId,
                teacherId: form.teacherId,
                classType: form.classType,
                slotType: 'Class Slot',
            };
            await updateClassSlotAssignment(assignment._id, assignmentData);
            Swal.fire('Success', 'Class Slot Assignment updated successfully.', 'success');
            setShowModal(false);
            reloadAssignments();
        } catch (error) {
            console.error(error);
            Swal.fire('Error', error.message || 'Failed to update Class Slot Assignment.', 'error');
        } finally {
            // Set loading state back to false
            setIsLoading(false);
        }
    };

    // Close Modal Function
    const closeModal = () => {
        setShowModal(false);
    };

    return (
        showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 overflow-y-auto max-h-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-indigo-700">Edit Class Slot Assignment</h2>
                        <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                            &#10005;
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Day Field */}
                            <div>
                                <label className="block mb-1 font-medium">Day</label>
                                <select
                                    name="day"
                                    value={form.day}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
                                    required
                                    disabled
                                >
                                    <option value={branchClassDays?._id}>
                                        {branchClassDays?.day}
                                    </option>
                                </select>
                            </div>

                            {/* Class Field */}
                            <div>
                                <label className="block mb-1 font-medium">Class</label>
                                <select
                                    name="classId"
                                    value={form.classId}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
                                    required
                                    disabled
                                >
                                    {classes.map(cls => (
                                        <option key={cls._id} value={cls._id}>
                                            {cls.className}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Section Field */}
                            <div>
                                <label className="block mb-1 font-medium">Section</label>
                                <select
                                    name="sectionId"
                                    value={form.sectionId}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
                                    required
                                    disabled
                                >
                                    {sections.map(section => (
                                        <option key={section._id} value={section._id}>
                                            {section.sectionName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Time Slot Field */}
                            <div>
                                <label className="block mb-1 font-medium">Select Time Slot</label>
                                <select
                                    name="timeSlot"
                                    value={form.timeSlot}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                    required
                                >
                                    <option value="">-- Select Time Slot --</option>
                                    {timeSlots.map((slot) => (
                                        <option key={slot._id} value={slot._id}>
                                            {slot.slot}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Subject Field */}
                            <div>
                                <label className="block mb-1 font-medium">Select Subject</label>
                                <select
                                    name="subjectId"
                                    value={form.subjectId}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                    required
                                    disabled={!form.timeSlot || isLoading}
                                >
                                    <option value="">-- Select Subject --</option>
                                    {subjects.map((subject) => (
                                        <option key={subject._id} value={subject._id}>
                                            {subject.subjectName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Teacher Field */}
                            <div>
                                <label className="block mb-1 font-medium">Select Teacher</label>
                                <select
                                    name="teacherId"
                                    value={form.teacherId}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                    required
                                    disabled={!form.subjectId || isLoading}
                                >
                                    <option value="">-- Select Teacher --</option>
                                    {teachers.map((teacher) => (
                                        <option key={teacher._id} value={teacher._id}>
                                            {teacher.fullName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Class Type Field */}
                            <div>
                                <label className="block mb-1 font-medium">Select Class Type</label>
                                <select
                                    name="classType"
                                    value={form.classType}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                    required
                                    disabled={!form.teacherId || isLoading}
                                >
                                    <option value="">-- Select Class Type --</option>
                                    <option value="Main Class">Main Class</option>
                                    <option value="Subject Class">Subject Class</option>
                                </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="mr-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                                    (!form.classType || isLoading) ? 'cursor-not-allowed opacity-50' : ''
                                }`}
                                disabled={!form.classType || isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <svg
                                            className="animate-spin h-5 w-5 mr-3 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8H4z"
                                            ></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    'Update'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default EditClassSlotAssignmentModal;
