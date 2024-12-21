import React, { useState, useEffect } from 'react';
import { createSubject } from '../../../../api/subjectApi';
import { fetchClasses } from '../../../../api/classApi';
import Swal from 'sweetalert2';

const AddSubjectModal = ({ onClose, reloadData }) => {
    const [subjectName, setSubjectName] = useState('');
    const [classId, setClassId] = useState('');
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        const loadclasses = async () => {
            try {
                const response = await fetchClasses();
                if (response) {
                    // Sort classes by className
                    const sortedClasses = response.data.sort((a, b) => {
                        if (a.className < b.className) return -1;
                        if (a.className > b.className) return 1;
                        return 0;
                    });
                    setClasses(sortedClasses);
                }
            } catch (error) {
                console.error('Error fetching classes:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load classes. Please try again later.',
                });
            }
        };

        loadclasses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let classIdGet = classId;
            await createSubject({ subjectName, classIdGet });
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Subject added successfully!',
            });
            reloadData();
            onClose();
        } catch (error) {
            console.error('Error adding subject:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Unable to add subject. Please try again later.',
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-indigo-900">Add Subject</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-lg font-semibold">✖</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
                        <input
                            type="text"
                            placeholder="Enter subject name"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={subjectName}
                            onChange={(e) => setSubjectName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                        <select
                            value={classId}
                            onChange={(e) => setClassId(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        >
                            <option value="" disabled>Select a Class</option>
                            {classes.map(classes => (
                                <option key={classes._id} value={classes._id}>
                                    {`${classes.className}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Add Subject
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSubjectModal;
