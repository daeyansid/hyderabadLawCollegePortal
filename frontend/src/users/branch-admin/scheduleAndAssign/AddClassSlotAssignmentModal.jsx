import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDayById } from '../../../api/branchClassDaysApi';
import { getBranchDailyTimeSlotsByDayBranch } from '../../../api/branchDailyTimeSlotsApi';
import { fetchClassById } from '../../../api/classApi';
import { getAllSubjectsByClassId } from '../../../api/subjectApi';
import { getAvailableTeachersByBranchVerification } from '../../../api/teacherApi';
import { createClassSlotAssignment, getAllClassSlotAssignments } from '../../../api/classSlotAssignmentsApi';
import Swal from 'sweetalert2';

const AddClassSlotAssignmentModal = ({ showModal, setShowModal, reloadAssignments }) => {
    const [branchClassDays, setBranchClassDays] = useState({});
    const { branchClassDaysIdParam, classIdParam } = useParams();
    const [timeSlots, setTimeSlots] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [existingAssignments, setExistingAssignments] = useState([]);
    const [form, setForm] = useState({
        day: branchClassDaysIdParam || '',
        timeSlot: '',
        classId: '',
        subjectId: '',
        teacherId: '',
        classType: 'Main Class',
    });

    const branchId = localStorage.getItem('branchId');

    useEffect(() => {
        if (showModal) {
            fetchInitialData();
        }
    }, [showModal]);

    const fetchInitialData = async () => {
        try {
            // Fetch day data
            const dayData = await getDayById(branchClassDaysIdParam);
            setBranchClassDays(dayData);
        } catch (error) {
            Swal.fire('Error fetching day data', error.message, 'error');
            return; // Exit early if this fails
        }

        try {
            // Fetch class data
            const classData = await fetchClassById(classIdParam);
            setClasses(classData.data);
        } catch (error) {
            Swal.fire('Error fetching class data', error.message, 'error');
            return; // Exit early if this fails
        }

        try {
            // Set the form fields for classId and sectionId
            setForm(prevForm => ({
                ...prevForm,
                classId: classIdParam,
            }));
        } catch (error) {
            Swal.fire('Error validating section', error.message, 'error');
            return; // Exit early if this fails
        }

        try {
            // Fetch time slots
            await fetchTimeSlots();
        } catch (error) {
            Swal.fire('Error fetching time slots', error.message, 'error');
            return; // Exit early if this fails
        }

        try {
            const assignments = await getAllClassSlotAssignments(branchClassDaysIdParam);
            setExistingAssignments(assignments);
        } catch (error) {
            // Swal.fire('Error 1 fetching assignments', error.message, 'error');
            return;
        }
    };


    const fetchTimeSlots = async () => {
        try {
            const slotsData = await getBranchDailyTimeSlotsByDayBranch(branchClassDaysIdParam);
            const classSlots = slotsData.filter(slot => slot.slotType === 'Class Slot');
            console.log("classSlots", classSlots);
            setTimeSlots(classSlots);
        } catch (error) {
            // Swal.fire('Error 2', 'Failed to load time slots.', 'error');
        }
    };

    const fetchSubjects = async () => {
        try {
            const subjectsData = await getAllSubjectsByClassId(form.classId);
            console.log("subjectsData",subjectsData);
            setSubjects(subjectsData);
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    };

    const fetchAvailableTeachers = async () => {
        try {
            const teachersData = await getAvailableTeachersByBranchVerification(branchId);
            setTeachers(teachersData);
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    };

    const validateSlot = () => {
        const { timeSlot, teacherId, classId } = form;

        // Rule 1: Do not enter the same slot again on the same day for the same class.
        const sameSlotInClassExists = existingAssignments.some(
            assignment => assignment.branchDailyTimeSlotsId._id === timeSlot &&
                assignment.classId._id === classId
        );
        if (sameSlotInClassExists) {
            Swal.fire('Error', 'This slot is already assigned on the same day for the same class', 'error');
            return false;
        }

        // Rule 3: Do not assign the same teacher to the same slot on the same day for the same class.
        const sameTeacherInSlotForClass = existingAssignments.some(
            assignment => assignment.branchDailyTimeSlotsId._id === timeSlot &&
                assignment.classId._id === classId &&
                assignment.teacherId._id === teacherId
        );
        if (sameTeacherInSlotForClass) {
            Swal.fire('Error', 'This teacher is already assigned to this slot on the same day for the same class.', 'error');
            return false;
        }

        // New Rule: The same teacher cannot teach in different classes at the same slot on the same day.
        const teacherAssignedInSlot = existingAssignments.some(
            assignment => assignment.branchDailyTimeSlotsId._id === timeSlot &&
                assignment.teacherId._id === teacherId
        );
        if (teacherAssignedInSlot) {
            Swal.fire('Error', 'This teacher is already assigned to this slot for a different class', 'error');
            return false;
        }

        return true;
    };

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
            setForm(prevForm => ({ ...prevForm, classType: 'Main Class' }));
            fetchSubjects();
        } else if (name === 'subjectId') {
            setForm(prevForm => ({
                ...prevForm,
                teacherId: '',
                classType: '',
            }));
            setTeachers([]);
            setForm(prevForm => ({ ...prevForm, classType: 'Main Class' }));
            fetchAvailableTeachers();
        } else if (name === 'teacherId') {
            setForm(prevForm => ({
                ...prevForm,
                classType: 'Main Class', // Set default value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateSlot()) return;
    
        try {
            const assignmentData = {
                branchClassDaysId: form.day,
                branchDailyTimeSlotsId: form.timeSlot,
                classId: form.classId,
                subjectId: form.subjectId,
                teacherId: form.teacherId,
                classType: form.classType,
                slotType: 'Class Slot',
            };
    
            // Log the assignment data before making the API call
            console.log('Assignment Data:', assignmentData);
    
            await createClassSlotAssignment(assignmentData);
            Swal.fire('Success', 'Class Slot Assignment created successfully.', 'success');
            setShowModal(false);
            reloadAssignments();
        } catch (error) {
            Swal.fire('Error', error.message || 'Failed to create Class Slot Assignment.', 'error');
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 overflow-y-auto max-h-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-indigo-700">Add Class Slot</h2>
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
                                    <option value={branchClassDays._id}>
                                        {branchClassDays.day}
                                    </option>
                                </select>
                            </div>

                            {/* Class Field */}
                            <div>
                                <label className="block mb-1 font-medium">Semester</label>
                                <select
                                    name="classId"
                                    value={form.classId}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
                                    required
                                    disabled
                                >
                                    <option key={classes._id} value={classes._id}>
                                        {classes.className}
                                    </option>
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
                                    {timeSlots.map(slot => (
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
                                    disabled={!form.timeSlot}
                                >
                                    <option value="">-- Select Subject --</option>
                                    {subjects.map(subject => (
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
                                    disabled={!form.subjectId}
                                >
                                    <option value="">-- Select Teacher --</option>
                                    {teachers.map(teacher => (
                                        <option key={teacher._id} value={teacher._id}>
                                            {teacher.fullName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Class Type Field
                            <div>
                                <label className="block mb-1 font-medium">Select Class Type</label>
                                <select
                                    name="classType"
                                    value={form.classType}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                    required
                                    disabled
                                >
                                    <option value="Main Class">Main Class</option>
                                </select>
                            </div> */}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="mr-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                disabled={!form.classType}
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default AddClassSlotAssignmentModal;
