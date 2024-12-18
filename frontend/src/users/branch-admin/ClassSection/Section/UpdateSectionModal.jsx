import React, { useState, useEffect } from 'react';
import { fetchSectionById, updateSection } from '../../../../api/sectionApi';
import { fetchClasses } from '../../../../api/classApi';
import Swal from 'sweetalert2';
import moment from 'moment';

const UpdateSectionModal = ({ id, onClose, reloadData }) => {
    const [sectionData, setSectionData] = useState({
        sectionName: '',
        maxNoOfStudents: '',
        roomNumber: '',
        startDate: '',
        endDate: '',
        branchId: '',
        classId: '',
    });
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        const loadSectionData = async () => {
            try {
                const data = await fetchSectionById(id);
                setSectionData({
                    sectionName: data.data.sectionName,
                    maxNoOfStudents: data.data.maxNoOfStudents,
                    roomNumber: data.data.roomNumber,
                    startDate: moment(data.data.startDate).format('YYYY-MM-DD'),
                    endDate: moment(data.data.endDate).format('YYYY-MM-DD'),
                    branchId: data.data.branchId._id,
                    classId: data.data.classId._id,
                });
                const classesData = await fetchClasses();
                setClasses(classesData.data);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Unable to fetch section details. Please try again later.',
                });
            }
        };

        loadSectionData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSectionData({ ...sectionData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedSectionData = {
                ...sectionData,
                startDate: moment(sectionData.startDate).toISOString(),
                endDate: moment(sectionData.endDate).toISOString(),
            };
            await updateSection(id, updatedSectionData);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Section updated successfully!',
            });
            reloadData(); // Reload data after successful update
            onClose(); // Close modal after updating
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to update section. Please try again later.',
            });
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-indigo-900">Update Section</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-gray-700 font-semibold">Section Name</label>
                        <input
                            type="text"
                            name="sectionName"
                            value={sectionData.sectionName}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Max Number of Students</label>
                        <input
                            type="number"
                            name="maxNoOfStudents"
                            value={sectionData.maxNoOfStudents}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Room Number</label>
                        <input
                            type="text"
                            name="roomNumber"
                            value={sectionData.roomNumber}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md w-full"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-semibold">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={sectionData.startDate}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-md w-full"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={sectionData.endDate}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-md w-full"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold">Class</label>
                        <select
                            name="classId"
                            value={sectionData.classId}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md w-full"
                            required
                        >
                            <option value="">Select Class</option>
                            {classes.map((cls) => (
                                <option key={cls._id} value={cls._id}>
                                    {cls.className}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-4"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateSectionModal;
