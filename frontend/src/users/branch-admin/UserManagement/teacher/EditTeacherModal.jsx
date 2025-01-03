import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { fetchTeacherById, updateTeacher } from '../../../../api/teacherApi';

const EditTeacherModal = ({ showModal, setShowModal, teacherId, reloadData }) => {
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        cnicNumber: '',
        phoneNumber: '',
        address: '',
        gender: '',
        cast: '',
        basicSalary: '',
        branchId: '',
        joinDate: '',
        teacherId: '',
        photo: null,
        password: '',
        natureOfAppointment: '', // Ensure it's initialized
    });

    useEffect(() => {
        const branchId = localStorage.getItem('branchId');
        if (branchId) {
            setFormData((prevState) => ({
                ...prevState,
                branchId,
            }));
        }

        const loadTeacherData = async () => {
            try {
                const teacherData = await fetchTeacherById(teacherId);
                setFormData({
                    email: teacherData.data.userId?.email || '',
                    fullName: teacherData.data.fullName || '',
                    cnicNumber: teacherData.data.cnicNumber || '',
                    phoneNumber: teacherData.data.phoneNumber || '',
                    address: teacherData.data.address || '',
                    gender: teacherData.data.gender || '',
                    cast: teacherData.data.cast || '',
                    basicSalary: teacherData.data.basicSalary || '',
                    branchId: branchId || teacherData.data.branchId || '',
                    joinDate: teacherData.data.joinDate ? new Date(teacherData.data.joinDate).toISOString().split('T')[0] : '',
                    teacherId: teacherData.data.teacherId || '',
                    photo: null,
                    password: '', // Ensure password is blank on load
                    natureOfAppointment: teacherData.data.natureOfAppointment || '', // Add this line
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Unable to fetch teacher data. Please try again later.',
                });
                setShowModal(false);
            }
        };

        if (showModal && teacherId) {
            loadTeacherData();
        }
    }, [teacherId, showModal, setShowModal]);

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

        // CNIC format validation: 12345-6789123-3
        const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;

        if (!cnicRegex.test(formData.cnicNumber)) {
            return Swal.fire({
                icon: 'error',
                title: 'Invalid CNIC Format',
                text: 'Please enter the CNIC in the format 12345-6789123-3',
            });
        }

        // Prepare FormData
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            // Only append password if it's not empty
            if (key === 'password' && formData.password.trim() === '') {
                return; // Skip appending empty password
            }
            data.append(key, formData[key]);
        });

        try {
            await updateTeacher(teacherId, data);
            Swal.fire('Success!', 'Teacher updated successfully!', 'success');
            setShowModal(false);
            reloadData();
        } catch (error) {
            console.error('Error updating teacher:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to update teacher. Please try again later.',
            });
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
            fullName: '',
            cnicNumber: '',
            phoneNumber: '',
            address: '',
            gender: '',
            cast: '',
            basicSalary: '',
            staffId: '',
            joinDate: '',
            staffType: '',
            photo: null,
            branchId: '',
            password: '', // Reset password field
        });
    };

    if (!showModal) return null;

    return (
        <div
            id="modalOverlay"
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
            onClick={(e) => e.target.id === 'modalOverlay' && handleCloseModal()}
        >
            <div
                className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full max-h-full overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-semibold text-indigo-900 mb-6">Edit Teacher Details</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Email - Disabled */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                disabled
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter new password (optional)"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                minLength="6"
                            />
                        </div>

                        {/* Full Name */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        {/* CNIC Number */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">CNIC Number</label>
                            <input
                                type="text"
                                name="cnicNumber"
                                placeholder="XXXXX-XXXXXXX-X"
                                value={formData.cnicNumber}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                pattern="[0-9]{5}-[0-9]{7}-[0-9]{1}"
                                maxLength="15"
                                required
                            />
                        </div>

                        {/* Phone Number */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Phone Number</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                placeholder="03XX-XXXXXXX"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                pattern="[0-9]{4}-[0-9]{7}"
                                maxLength="12"
                                required
                            />
                        </div>

                        {/* Address */}
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

                        {/* Gender */}
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

                        {/* Cast */}
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

                        {/* Basic Salary */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Basic Salary</label>
                            <input
                                type="number"
                                name="basicSalary"
                                placeholder="Enter pay per hour"
                                value={formData.basicSalary}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                min="0"
                                required
                            />
                        </div>

                        {/* Nature of Appointment */}
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

                        {/* Join Date */}
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

                        {/* Photo */}
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
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTeacherModal;
