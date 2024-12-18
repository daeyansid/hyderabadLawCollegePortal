import React, { useState } from 'react';
import { updateBranchAdmin } from '../../../api/super-admin/superAdminUser';
import Swal from 'sweetalert2';
import { ClipLoader } from 'react-spinners';

const UpdateBranchAdminModal = ({ showModal, setShowModal, admin, reloadData }) => {
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

    const [formData, setFormData] = useState({
        fullName: admin.fullName || '',
        email: admin.userId.email || '',
        phoneNumber: formatPhoneNumber(admin.phoneNumber || ''),
        cnicNumber: formatCnicNumber(admin.cnicNumber || ''),
        gender: admin.gender || '',
        address: admin.address || '',
        salary: admin.salary || '',
        joinDate: admin.joinDate ? new Date(admin.joinDate).toISOString().split('T')[0] : '',
        adminId: admin.adminId || '',
        photo: null,
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateCnic = (cnic) => /^\d{5}-\d{7}-\d{1}$/.test(cnic) && cnic.replace(/-/g, '').length === 13; // CNIC pattern 00000-0000000-0 with exactly 13 digits
    const validatePhoneNumber = (phoneNumber) => /^\d{4}-\d{7}$/.test(phoneNumber) && phoneNumber.replace(/-/g, '').length === 11; // Phone number pattern 0000-0000000 with exactly 11 digits

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Format CNIC Number
        if (name === 'cnicNumber') {
            formattedValue = value.replace(/\D/g, ''); // Remove non-numeric characters
            if (formattedValue.length > 13) {
                formattedValue = formattedValue.slice(0, 13); // Limit to 13 digits
            }
            formattedValue = formattedValue.replace(/^(\d{5})(\d{7})(\d{1})$/, '$1-$2-$3'); // Format to 00000-0000000-0
        }

        // Format Phone Number
        if (name === 'phoneNumber') {
            formattedValue = value.replace(/\D/g, ''); // Remove non-numeric characters
            if (formattedValue.length > 11) {
                formattedValue = formattedValue.slice(0, 11); // Limit to 11 digits
            }
            formattedValue = formattedValue.replace(/^(\d{4})(\d{7})$/, '$1-$2'); // Format to 0000-0000000
        }

        setFormData({ ...formData, [name]: formattedValue });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, photo: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate CNIC and Phone Number before submitting
        if (!validateCnic(formData.cnicNumber)) {
            setErrors({ cnicNumber: 'CNIC must be in the format 00000-0000000-0 and exactly 13 digits without hyphens.' });
            return;
        }
        if (!validatePhoneNumber(formData.phoneNumber)) {
            setErrors({ phoneNumber: 'Phone number must be in the format 0000-0000000 and exactly 11 digits without hyphens.' });
            return;
        }

        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key === 'cnicNumber' || key === 'phoneNumber') {
                // Save CNIC and Phone number without hyphens
                data.append(key, formData[key].replace(/-/g, ''));
            } else {
                data.append(key, formData[key]);
            }
        });

        try {
            await updateBranchAdmin(admin._id, data);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Branch admin updated successfully!',
            });
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

    const handleOverlayClick = (e) => {
        if (e.target.id === 'modalOverlay') {
            handleCloseModal();
        }
    };

    if (!showModal) return null;

    return (
        <div
            id="modalOverlay"
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleOverlayClick}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-full overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-semibold text-indigo-900 mb-4">Update Branch Admin</h2>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <ClipLoader color="#4A90E2" loading={loading} size={50} />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
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
                                <label className="block text-gray-700 font-semibold cursor-no-drop">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md cursor-no-drop"
                                    required
                                    disabled
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
                                />
                                {errors.phoneNumber && <p className="text-red-600">{errors.phoneNumber}</p>}
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
                                />
                                {errors.cnicNumber && <p className="text-red-600">{errors.cnicNumber}</p>}
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
                                />
                            </div>
                            <div className="mb-4 col-span-2">
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
                            <div className="mb-4 col-span-2">
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
                            <div className="mb-4 col-span-2">
                                <label className="block text-gray-700 font-semibold cursor-no-drop">Admin ID</label>
                                <input
                                    type="text"
                                    name="adminId"
                                    value={formData.adminId}
                                    onChange={handleInputChange}
                                    className="cursor-no-drop w-full p-2 border border-gray-300 rounded-md"
                                    required
                                    disabled
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
                            <div className="mb-4 col-span-2">
                                <label className="block text-gray-700 font-semibold">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
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
                                Update Admin
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UpdateBranchAdminModal;
