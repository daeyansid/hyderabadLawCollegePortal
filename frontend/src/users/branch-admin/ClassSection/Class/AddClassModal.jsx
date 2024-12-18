import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { createClass } from '../../../../api/classApi';
import { useNavigate } from 'react-router-dom';

const AddClassModal = ({ onClose, reloadData }) => {
    const [className, setClassName] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const classData = {
                className,
                description,
                createdAt: new Date(),
            };
            await createClass(classData);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Class added successfully!',
                timer: 2000,
                timerProgressBar: true,
            });
            onClose();
            reloadData();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error,
            });
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-full max-w-2xl mx-4 p-8 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-indigo-900">Add New Class</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 mb-6">
                        <div>
                            <label className="block text-lg font-semibold text-gray-700">Class Name</label>
                            <input
                                type="text"
                                value={className}
                                onChange={(e) => setClassName(e.target.value)}
                                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter class name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-semibold text-gray-700">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter class description"
                                rows="4"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Add Class
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddClassModal;
