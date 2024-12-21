import React, { useState, useEffect } from 'react';
import { getDayById } from '../../../api/branchClassDaysApi';
import { getBranchDailyTimeSlotsByDayBranch } from '../../../api/branchDailyTimeSlotsApi';
import { fetchClassById } from '../../../api/classApi';
import { getAllSubjectsByClassId } from '../../../api/subjectApi';
import { getAvailableTeachersByBranchVerification } from '../../../api/teacherApi';
import { updateClassSlotAssignment, getAllClassSlotAssignments } from '../../../api/classSlotAssignmentsApi';
import Swal from 'sweetalert2';

const EditClassSlotAssignmentModal = ({ showModal, setShowModal, reloadAssignments, assignment }) => {
    const [branchClassDays, setBranchClassDays] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [existingAssignments, setExistingAssignments] = useState([]);
    const [form, setForm] = useState({
        day: assignment.branchClassDaysId || '',
        timeSlot: assignment.branchDailyTimeSlotsId || '',
        classId: assignment.classId._id || '',
        subjectId: assignment.subjectId._id || '',
        teacherId: assignment.teacherId._id || '',
        classType: assignment.classType || 'Main Class',
    });

    const branchId = localStorage.getItem('branchId');

    useEffect(() => {
        if (showModal) {
            fetchInitialData();
        }
    }, [showModal]);

    const fetchInitialData = async () => {
        try {
            const dayData = await getDayById(assignment.branchClassDaysId);
            setBranchClassDays(dayData);
        } catch (error) {
            Swal.fire('Error fetching day data', error.message, 'error');
            return;
        }

        try {
            const classData = await fetchClassById(assignment.classId._id);
            setClasses([classData.data]);
        } catch (error) {
            Swal.fire('Error fetching class data', error.message, 'error');
            return;
        }

        try {
            await fetchTimeSlots();
        } catch (error) {
            Swal.fire('Error fetching time slots', error.message, 'error');
            return;
        }

        try {
            const assignments = await getAllClassSlotAssignments(assignment.branchClassDaysId);
            setExistingAssignments(assignments);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }

        try {
            await fetchSubjects();
        } catch (error) {
            Swal.fire('Error fetching subjects', error.message, 'error');
        }

        try {
            await fetchAvailableTeachers();
        } catch (error) {
            Swal.fire('Error fetching teachers', error.message, 'error');
        }
    };

    const fetchTimeSlots = async () => {
        try {
            const slotsData = await getBranchDailyTimeSlotsByDayBranch(assignment.branchClassDaysId);
            const classSlots = slotsData.filter(slot => slot.slotType === 'Class Slot');
            setTimeSlots(classSlots);
        } catch (error) {
            console.error('Error fetching time slots:', error);
        }
    };

    const fetchSubjects = async () => {
        try {
            const subjectsData = await getAllSubjectsByClassId(form.classId);
            setSubjects(subjectsData);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    const fetchAvailableTeachers = async () => {
        try {
            const teachersData = await getAvailableTeachersByBranchVerification(branchId);
            setTeachers(teachersData);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const validateSlot = () => {
        const { timeSlot, teacherId, classId } = form;
        const currentAssignmentId = assignment._id;

        const sameSlotInClassExists = existingAssignments.some(
            existingAssignment =>
                existingAssignment.branchDailyTimeSlotsId?._id === timeSlot &&
                existingAssignment.classId?._id === classId &&
                existingAssignment._id !== currentAssignmentId
        );

        if (sameSlotInClassExists) {
            Swal.fire('Error', 'This slot is already assigned on the same day for the same class.', 'error');
            return false;
        }

        const teacherAssignedInDifferentClassOrSlot = existingAssignments.some(
            existingAssignment =>
                existingAssignment.branchDailyTimeSlotsId?._id === timeSlot &&
                existingAssignment.teacherId?._id === teacherId &&
                existingAssignment._id !== currentAssignmentId
        );

        if (teacherAssignedInDifferentClassOrSlot) {
            Swal.fire('Error', 'This teacher is already assigned to another class for this slot on the same day.', 'error');
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
            setSubjects([]);
            setTeachers([]);
            fetchSubjects();
        } else if (name === 'subjectId') {
            setTeachers([]);
            fetchAvailableTeachers();
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

            console.log('Updated Assignment Data:', assignmentData);

            await updateClassSlotAssignment(assignment._id, assignmentData);
            Swal.fire('Success', 'Class Slot Assignment updated successfully.', 'success');
            setShowModal(false);
            reloadAssignments();
        } catch (error) {
            Swal.fire('Error', error.message || 'Failed to update Class Slot Assignment.', 'error');
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
                                    disabled
                                >
                                    <option value={branchClassDays?._id}>{branchClassDays?.day}</option>
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
                                    disabled
                                >
                                    {classes.map(cls => (
                                        <option key={cls._id} value={cls._id}>{cls.className}</option>
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
                                    {timeSlots.map(slot => (
                                        <option key={slot._id} value={slot._id}>{slot.slot}</option>
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
                                >
                                    <option value="">-- Select Subject --</option>
                                    {subjects.map(subject => (
                                        <option key={subject._id} value={subject._id}>{subject.subjectName}</option>
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
                                >
                                    <option value="">-- Select Teacher --</option>
                                    {teachers.map(teacher => (
                                        <option key={teacher._id} value={teacher._id}>{teacher.fullName}</option>
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
                                    disabled
                                >
                                    <option value="Main Class">Main Class</option>
                                </select>
                            </div>
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
                            >
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default EditClassSlotAssignmentModal;
