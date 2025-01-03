import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { createTeacher } from '../../../../api/teacherApi';

const AddTeacherModal = ({ showModal, setShowModal, reloadData }) => {
    const [formData, setFormData] = useState({
        password: '',
        email: '',
        userRole: 'teacher',
        fullName: '',
        cnicNumber: '',
        phoneNumber: '',
        address: '',
        gender: '',
        cast: '',
        basicSalary: '',
        branchId: '',
        joinDate: '',
        photo: null,
        natureOfAppointment: '',
    });

    useEffect(() => {
        const branchId = localStorage.getItem('branchId');
        if (branchId) {
            setFormData((prevState) => ({
                ...prevState,
                branchId,
            }));
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Branch ID is missing. Please try again later.',
            });
            setShowModal(false);
        }
    }, [setShowModal]);

    const formatCnicNumber = (value) => {
        const cnic = value.replace(/\D/g, ''); // Remove non-numeric characters
        if (cnic.length <= 5) {
            return cnic;
        } else if (cnic.length <= 12) {
            return `${cnic.slice(0, 5)}-${cnic.slice(5)}`;
        } else {
            return `${cnic.slice(0, 5)}-${cnic.slice(5, 12)}-${cnic.slice(12, 13)}`;
        }
    };

    const formatPhoneNumber = (value) => {
        const phone = value.replace(/\D/g, ''); // Remove non-numeric characters
        if (phone.length <= 4) {
            return phone;
        } else {
            return `${phone.slice(0, 4)}-${phone.slice(4, 11)}`;
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'cnicNumber') {
            setFormData({
                ...formData,
                [name]: formatCnicNumber(value),
            });
        } else if (name === 'phoneNumber') {
            setFormData({
                ...formData,
                [name]: formatPhoneNumber(value),
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, photo: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // CNIC format: 12345-6789123-3
        const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;

        if (!cnicRegex.test(formData.cnicNumber)) {
            return Swal.fire({
                icon: 'error',
                title: 'Invalid CNIC Format',
                text: 'Please enter CNIC in the format 12345-6789123-3',
            });
        }

        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });
        try {
            await createTeacher(data);
            Swal.fire('Success!', 'Teacher added successfully!', 'success');
            setShowModal(false);
            reloadData();
        } catch (error) {
            console.error('Error creating teacher:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message,
            });
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
            password: '',
            email: '',
            userRole: 'teacher',
            fullName: '',
            cnicNumber: '',
            phoneNumber: '',
            address: '',
            gender: '',
            cast: '',
            basicSalary: '',
            branchId: '',
            joinDate: '',
            photo: null,
            natureOfAppointment: 'permanent', // Added new field
        });
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full max-h-full overflow-y-auto">
                <h2 className="text-2xl font-semibold text-indigo-900 mb-6">Add New Teacher</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter email address"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Enter full name"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">CNIC Number</label>
                            <input
                                type="text"
                                name="cnicNumber"
                                placeholder="00000-0000000-0"
                                value={formData.cnicNumber}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                maxLength="15"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Phone Number</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                placeholder="0000-0000000"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                maxLength="12"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Address</label>
                            <input
                                type="text"
                                name="address"
                                placeholder="Enter complete address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Cast</label>
                            <input
                                type="text"
                                name="cast"
                                placeholder="Enter cast"
                                value={formData.cast}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Pay per Hr</label>
                            <input
                                type="number"
                                name="basicSalary"
                                placeholder="Enter pay per hour"
                                value={formData.basicSalary}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Nature of Appointment</label>
                            <select
                                name="natureOfAppointment"
                                value={formData.natureOfAppointment}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select Nature of Appointment</option>
                                <option value="permanent">Permanent</option>
                                <option value="visiting">Visiting</option>
                            </select>
                        </div>
                        <div className="mb-4 col-span-2">
                            <label className="block text-gray-700 font-semibold">Join Date</label>
                            <input
                                type="date"
                                name="joinDate"
                                value={formData.joinDate}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4 col-span-2">
                            <label className="block text-gray-700 font-semibold">Photo</label>
                            <input
                                type="file"
                                name="photo"
                                onChange={handleFileChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                accept="image/*"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTeacherModal;