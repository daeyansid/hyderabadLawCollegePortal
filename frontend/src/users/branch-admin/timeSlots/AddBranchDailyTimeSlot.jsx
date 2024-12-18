import React, { useEffect, useState } from 'react';
import { getBranchSettings } from '../../../api/branchSettingsApi';
import {
    createBranchDailyTimeSlot,
    updateBranchDailyTimeSlot,
    getBranchDailyTimeSlotsByDay,
} from '../../../api/branchDailyTimeSlotsApi';
import Swal from 'sweetalert2';

const AddBranchDailyTimeSlot = ({
    showModal,
    setShowModal,
    branchClassDaysId,
    reload,
    selectedSlot, // Optional: for editing, passing the selected slot to edit
}) => {
    const [branchSettings, setBranchSettings] = useState(null);

    // Slot Start and End Time
    const [slotStart, setSlotStart] = useState('');
    const [slotEnd, setSlotEnd] = useState('');
    const [slotType, setSlotType] = useState('');
    const [loading, setLoading] = useState(false);
    const [existingSlots, setExistingSlots] = useState([]); // To track already assigned slots

    // Fetch branch settings and existing slots on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const branchId = localStorage.getItem('branchId');
                if (!branchId) {
                    Swal.fire('Error', 'Branch ID not found in localStorage.', 'error');
                    setShowModal(false);
                    return;
                }

                // Fetch Branch Settings
                const settings = await getBranchSettings(branchId);
                setBranchSettings(settings);

                // Fetch existing time slots for the selected branchClassDaysId to prevent duplicates
                const existingTimeSlots = await getBranchDailyTimeSlotsByDay(branchClassDaysId);
                setExistingSlots(existingTimeSlots);

                // If editing, pre-fill form with selected slot details
                if (selectedSlot) {
                    const [start, end] = selectedSlot.slot.split(' to ');
                    setSlotStart(convertTo24Hour(start));
                    setSlotEnd(convertTo24Hour(end));
                    setSlotType(selectedSlot.slotType);
                }
            } catch (error) {
                console.error('Failed to fetch branch settings or existing slots:', error);
                Swal.fire('Error', 'Failed to fetch necessary data.', 'error');
                setShowModal(false);
            }
        };

        if (showModal) {
            fetchData();
        }
    }, [showModal, setShowModal, branchClassDaysId, selectedSlot]);

    // Helper function to convert "8:00 AM" to "08:00" (24-hour format)
    const convertTo24Hour = (timeStr) => {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (modifier === 'PM' && hours !== 12) {
            hours += 12;
        }
        if (modifier === 'AM' && hours === 12) {
            hours = 0;
        }

        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}`;
    };

    // Helper function to convert "08:00" (24-hour format) to "8:00 AM"
    const convertTo12Hour = (timeStr) => {
        let [hours, minutes] = timeStr.split(':').map(Number);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    };

    // Helper function to convert "08:00" to minutes
    const convertToMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // Helper function to check if the new slot overlaps with existing slots
    const isOverlapping = (newStartMinutes, newEndMinutes) => {
        for (const slot of existingSlots) {
            const [existingStart, existingEnd] = slot.slot.split(' to ');
            // Convert existing times to 24-hour format
            const existingStart24 = convertTo24Hour(existingStart);
            const existingEnd24 = convertTo24Hour(existingEnd);
            const existingStartMinutes = convertToMinutes(existingStart24);
            const existingEndMinutes = convertToMinutes(existingEnd24);

            // Check for overlap
            if (
                newStartMinutes < existingEndMinutes && newEndMinutes > existingStartMinutes
            ) {
                return true;
            }
        }
        return false;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !slotStart ||
            !slotEnd ||
            !slotType
        ) {
            Swal.fire('Error', 'Please fill in all required fields.', 'error');
            return;
        }

        const branchStartMinutes = convertToMinutes(branchSettings.startTime);
        const branchEndMinutes = convertToMinutes(branchSettings.endTime);

        const startMinutes = convertToMinutes(slotStart);
        const endMinutes = convertToMinutes(slotEnd);

        // Validate that times are within operational hours
        if (startMinutes < branchStartMinutes || endMinutes > branchEndMinutes) {
            Swal.fire(
                'Error',
                `Please select times within operational hours: ${convertTo12Hour(branchSettings.startTime)} to ${convertTo12Hour(branchSettings.endTime)}.`,
                'error'
            );
            return;
        }

        // Validate that start time is before end time
        if (startMinutes >= endMinutes) {
            Swal.fire('Error', 'Start time must be before end time.', 'error');
            return;
        }

        // Check for overlapping slots
        const overlapping = existingSlots.some(slot => {
            if (selectedSlot && slot._id === selectedSlot._id) return false; // Skip the slot being edited
            const [existingStart, existingEnd] = slot.slot.split(' to ');
            const existingStart24 = convertTo24Hour(existingStart);
            const existingEnd24 = convertTo24Hour(existingEnd);
            const existingStartMinutes = convertToMinutes(existingStart24);
            const existingEndMinutes = convertToMinutes(existingEnd24);
            return (startMinutes < existingEndMinutes && endMinutes > existingStartMinutes);
        });

        if (overlapping) {
            Swal.fire('Error', 'This slot overlaps with an existing slot.', 'error');
            return;
        }

        const slotFormatted = `${convertTo12Hour(slotStart)} to ${convertTo12Hour(slotEnd)}`;

        try {
            setLoading(true);
            const branchId = localStorage.getItem('branchId');
            const data = {
                branchId,
                branchClassDaysId,
                slot: slotFormatted,
                slotType,
            };

            if (selectedSlot) {
                // If editing, update the existing slot
                await updateBranchDailyTimeSlot(selectedSlot._id, data);
                Swal.fire('Success', 'Branch Daily Time Slot updated successfully.', 'success');
            } else {
                // Otherwise, create a new slot
                await createBranchDailyTimeSlot(data);
                Swal.fire('Success', 'Branch Daily Time Slot created successfully.', 'success');
            }

            setShowModal(false);
            reload();
        } catch (error) {
            console.error('Failed to create/update Branch Daily Time Slot:', error);
            const errorMsg = error?.response?.data?.message || 'Failed to save Branch Daily Time Slot.';
            Swal.fire('Error', errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    // Handle closing the modal
    const handleClose = () => {
        if (!loading) {
            setShowModal(false);
        }
    };

    return (
        <>
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={handleClose}
                >
                    <div
                        className="bg-white rounded-lg shadow-lg w-96 p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-semibold mb-4">
                            {selectedSlot ? 'Edit' : 'Add'} Branch Daily Time Slot
                        </h2>

                        {branchSettings && (
                            <div className="mb-4 flex items-center space-x-2 bg-blue-100 p-3 rounded-md">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 9h10M5.46 19h13.08c.84 0 1.46-.72 1.46-1.5v-11c0-.84-.62-1.5-1.46-1.5H5.46C4.62 5 4 5.66 4 6.5v11c0 .78.62 1.5 1.46 1.5z"></path>
                                </svg>
                                <p className="text-gray-700 font-semibold">
                                    Operational Hours: <span className="text-indigo-600">{convertTo12Hour(branchSettings.startTime)}</span> to <span className="text-indigo-600">{convertTo12Hour(branchSettings.endTime)}</span>
                                </p>
                            </div>
                        )}


                        <form onSubmit={handleSubmit}>
                            {/* Slot Type */}
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Slot Type</label>
                                <select
                                    value={slotType}
                                    onChange={(e) => setSlotType(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    <option value="">Select Slot Type</option>
                                    <option value="Class Slot">Class Slot</option>
                                    <option value="Break Slot">Break Slot</option>
                                </select>
                            </div>

                            {/* Slot Start Time */}
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Slot Start Time</label>
                                <input
                                    type="time"
                                    value={slotStart}
                                    onChange={(e) => setSlotStart(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                    min={branchSettings ? branchSettings.startTime : ''}
                                    max={branchSettings ? branchSettings.endTime : ''}
                                />
                            </div>

                            {/* Slot End Time */}
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Slot End Time</label>
                                <input
                                    type="time"
                                    value={slotEnd}
                                    onChange={(e) => setSlotEnd(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                    min={slotStart || branchSettings ? branchSettings.startTime : ''}
                                    max={branchSettings ? branchSettings.endTime : ''}
                                />
                            </div>

                            {/* Submit and Cancel Buttons */}
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ${
                                        loading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    disabled={loading}
                                >
                                    {loading ? (selectedSlot ? 'Updating...' : 'Adding...') : selectedSlot ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );

};

export default AddBranchDailyTimeSlot;