import React, { useEffect, useState } from 'react';
import { fetchSubjectById, updateSubject } from '../../../../api/subjectApi';
import { fetchSections } from '../../../../api/sectionApi';
import Swal from 'sweetalert2';
import Select from 'react-select';

const UpdateSubjectModal = ({ id, onClose, reloadData }) => {
    const [subjectName, setSubjectName] = useState('');
    const [sectionId, setSectionId] = useState(null); // Changed to hold the entire option object
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Start loading
                // Fetch subject details
                const subjectResponse = await fetchSubjectById(id);
                setSubjectName(subjectResponse.data.subjectName);
                setSectionId({
                    value: subjectResponse.data.sectionId._id,
                    label: `${subjectResponse.data.sectionId.sectionName}`,
                });

                // Fetch sections and transform for React Select
                const sectionsResponse = await fetchSections();
                const transformedSections = sectionsResponse.data.map(section => ({
                    value: section._id,
                    label: `${section.sectionName} - Of Class - ${section.classId.className}`,
                }));
                setSections(transformedSections);
            } catch (error) {
                console.error('Error fetching data:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Unable to fetch subject details. Please try again later.',
                });
                onClose(); // Close modal on error
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchData();
    }, [id, onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!sectionId) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please select a section.',
            });
            return;
        }

        try {
            await updateSubject(id, { subjectName, sectionId: sectionId.value });
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Subject updated successfully!',
            });
            reloadData(); // Re-fetch the data after updating
            onClose(); // Close modal after updating
        } catch (error) {
            console.error('Error updating subject:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Unable to update subject. Please try again later.',
            });
        }
    };

    // Custom styles for React Select (Optional)
    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px',
        }),
        singleValue: (provided) => ({
            ...provided,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        }),
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-indigo-900">Update Subject</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-lg font-semibold">✖</button>
                </div>
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
                            <input
                                type="text"
                                value={subjectName}
                                onChange={(e) => setSubjectName(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                            <Select
                                options={sections}
                                value={sectionId}
                                onChange={setSectionId}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                placeholder="Select a section"
                                isClearable
                                styles={customStyles}
                                required
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Update Subject
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UpdateSubjectModal;
