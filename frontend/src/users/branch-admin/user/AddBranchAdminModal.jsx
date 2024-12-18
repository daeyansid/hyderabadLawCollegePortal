import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { createBranchAdmin } from '../../../api/super-admin/superAdminUser';
import { ClipLoader } from 'react-spinners';

const AddBranchAdminModal = ({ showModal, setShowModal, reloadData }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        userRole: 'branchAdmin',
        fullName: '',
        cnicNumber: '',
        phoneNumber: '',
        address: '',
        salary: '',
        gender: 'Male',
        joinDate: '',
        adminId: '',
        photo: null,
    });

    const [loading, setLoading] = useState(false);

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

        // Validate CNIC and Phone Number Length
        const plainCnic = formData.cnicNumber.replace(/-/g, '');
        const plainPhone = formData.phoneNumber.replace(/-/g, '');

        if (plainCnic.length !== 13) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid CNIC Number',
                text: 'CNIC Number must be exactly 13 digits (format: 00000-0000000-0).',
            });
            return;
        }

        if (plainPhone.length !== 11) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Phone Number',
                text: 'Phone Number must be exactly 11 digits (format: 0000-0000000).',
            });
            return;
        }

        setLoading(true);

        // Prepare form data for submission
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key === 'cnicNumber') {
                data.append(key, plainCnic); // Save CNIC without hyphens
            } else if (key === 'phoneNumber') {
                data.append(key, plainPhone); // Save phone number without hyphens
            } else {
                data.append(key, formData[key]);
            }
        });

        try {
            await createBranchAdmin(data);
            setShowModal(false);
            reloadData();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    if (!showModal) return null;

    return (
        <div
            id="modalOverlay"
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
            onClick={(e) => e.target.id === 'modalOverlay' && handleCloseModal()}
        >
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Add Branch Admin</h2>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <ClipLoader color="#4A90E2" loading={loading} size={50} />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
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
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
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
                                    value={formData.cnicNumber}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                    maxLength="15"
                                    placeholder="00000-0000000-0"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold">Phone Number</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                    maxLength="12"
                                    placeholder="0000-0000000"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold">Salary</label>
                                <input
                                    type="number"
                                    name="salary"
                                    value={formData.salary}
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
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div className="mb-4">
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
                                <label className="block text-gray-700 font-semibold">Admin ID</label>
                                <input
                                    type="text"
                                    name="adminId"
                                    value={formData.adminId}
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
                                Add Admin
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AddBranchAdminModal;
