import React, { useEffect, useState } from 'react';
import { fetchClassById, updateClass } from '../../../../api/classApi';
import Swal from 'sweetalert2';

const UpdateClassModal = ({ id, onClose, reloadData }) => {
    const [classData, setClassData] = useState({
        className: '',
        description: '',
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchClassById(id);
                setClassData({
                    className: data.data.className,
                    description: data.data.description,
                });
            } catch (err) {
                setError('Unable to fetch class data. Please try again later.');
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClassData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateClass(id, classData);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Class updated successfully!',
            });
            reloadData(); // Re-fetch data after updating
            onClose(); // Close modal after updating
        } catch (err) {
            setError('Unable to update class. Please try again later.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-indigo-900">Update Class</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
                </div>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Class Name</label>
                            <input
                                type="text"
                                name="className"
                                value={classData.className}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Description</label>
                            <textarea
                                name="description"
                                value={classData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows="5"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-4"
                    >
                        Update Class
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateClassModal;
