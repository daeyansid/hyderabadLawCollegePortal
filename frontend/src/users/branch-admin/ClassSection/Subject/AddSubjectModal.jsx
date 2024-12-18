import React, { useState, useEffect } from 'react';
import { createSubject } from '../../../../api/subjectApi';
import { fetchSections } from '../../../../api/sectionApi';
import Swal from 'sweetalert2';

const AddSubjectModal = ({ onClose, reloadData }) => {
    const [subjectName, setSubjectName] = useState('');
    const [sectionId, setSectionId] = useState('');
    const [sections, setSections] = useState([]);

    useEffect(() => {
        const loadSections = async () => {
            try {
                const response = await fetchSections();
                if (response) {
                    // Optional: Sort sections by className and then by sectionName
                    const sortedSections = response.data.sort((a, b) => {
                        if (a.classId.className < b.classId.className) return -1;
                        if (a.classId.className > b.classId.className) return 1;
                        if (a.sectionName < b.sectionName) return -1;
                        if (a.sectionName > b.sectionName) return 1;
                        return 0;
                    });
                    setSections(sortedSections);
                }
            } catch (error) {
                console.error('Error fetching sections:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load sections. Please try again later.',
                });
            }
        };

        loadSections();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createSubject({ subjectName, sectionId });
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Subject added successfully!',
            });
            reloadData(); // Reload data after adding
            onClose(); // Close modal after adding
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                        <select
                            value={sectionId}
                            onChange={(e) => setSectionId(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        >
                            <option value="" disabled>Select a section</option>
                            {sections.map(section => (
                                <option key={section._id} value={section._id}>
                                    {`${section.sectionName} - Of Class - ${section.classId.className}`}
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
