import React, { useState, useEffect } from 'react';
import { createBranchClassDay, getAllBranchClassDays } from '../../../api/branchClassDaysApi';
import Swal from 'sweetalert2';
import { DAYS_OF_WEEK } from '../../../utils/constants';

const AddBranchClassDay = ({ showModal, setShowModal, reload }) => {
    const [formData, setFormData] = useState({
        day: ''
    });
    const [branchId, setBranchId] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [existingDays, setExistingDays] = useState([]);

    useEffect(() => {
        if (showModal) {
            const storedBranchId = localStorage.getItem('branchId');
            if (storedBranchId) {
                setBranchId(storedBranchId);
                fetchExistingDays(storedBranchId); // Fetch existing days
                setLoading(false);
            } else {
                setLoading(false);
                Swal.fire('Error', 'Branch ID is missing. Please log in again.', 'error');
                setShowModal(false);
            }
        }
    }, [showModal, setShowModal]);

    // Fetch existing class days for the branch
    const fetchExistingDays = async (branchId) => {
        try {
            const data = await getAllBranchClassDays();
            setExistingDays(data.map((item) => item.day));
        } catch (error) {
            console.error('Failed to fetch existing class days:', error);
            // Swal.fire('Error', 'Failed to fetch existing class days.', 'error');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.day) {
            return Swal.fire('Error', 'Please select a day.', 'error');
        }

        // Check for duplicate day
        if (existingDays.includes(formData.day)) {
            return Swal.fire('Error', `The day "${formData.day}" has already been added to this branch.`, 'error');
        }

        setIsSubmitting(true); // Start submission

        try {
            await createBranchClassDay({ branchId, day: formData.day });
            Swal.fire('Success', 'Class day added successfully.', 'success');
            // Update existingDays state
            setExistingDays((prevDays) => [...prevDays, formData.day]);
            setFormData({ day: '' });
            setShowModal(false); // Close the modal after successful addition
            reload(); // Refresh the list
        } catch (error) {
            console.error('Failed to create class day:', error);
            const errorMessage = error.response?.data?.message || 'Failed to add class day.';
            Swal.fire('Error', errorMessage, 'error');
        } finally {
            setIsSubmitting(false); // End submission
        }
    };

    const handleCloseModal = () => {
        if (!isSubmitting) { // Prevent closing modal while submitting
            setShowModal(false);
        }
    };

    if (!showModal) return null;

    return (
        <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleCloseModal}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-indigo-900">Add Branch Class Day</h2>
                    <button
                        onClick={handleCloseModal}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        aria-label="Close Modal"
                        disabled={isSubmitting} // Disable close button while submitting
                    >
                        &times;
                    </button>
                </div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-semibold">Day</label>
                            <select
                                name="day"
                                value={formData.day}
                                onChange={handleChange}
                                className="border border-gray-300 p-2 rounded-md w-full"
                                required
                                disabled={isSubmitting} // Disable input while submitting
                            >
                                <option value="">Select Day</option>
                                {DAYS_OF_WEEK.map((day) => (
                                    <option
                                        key={day}
                                        value={day}
                                        disabled={existingDays.includes(day)}
                                    >
                                        {day} {existingDays.includes(day) ? '(Already Added)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                                disabled={isSubmitting} // Disable cancel button while submitting
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`px-4 py-2 rounded-md ${
                                    isSubmitting
                                        ? 'bg-indigo-400 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700'
                                } text-white`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Adding...' : 'Add'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AddBranchClassDay;
