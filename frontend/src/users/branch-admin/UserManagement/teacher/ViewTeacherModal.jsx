import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { fetchTeacherById } from '../../../../api/teacherApi';
import moment from 'moment';
import { baseURL } from '../../../../index';

const ViewTeacherModal = ({ showModal, setShowModal, teacherId }) => {
    const [teacherData, setTeacherData] = useState(null);

    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                const data = await fetchTeacherById(teacherId);
                console.log(data.data);
                setTeacherData(data.data);
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
            fetchTeacherData();
        }
    }, [teacherId, showModal, setShowModal]);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOverlayClick = (e) => {
        if (e.target.id === 'modalOverlay') {
            handleCloseModal();
        }
    };

    if (!showModal) return null;

    if (!teacherData) {
        return <div className="text-center text-gray-600">No teacher data available.</div>;
    }

    const imageUrl = teacherData.photo ? `${baseURL}teacher/${teacherData.photo}` : '';

    // Formatting functions for CNIC and Phone Number
    const formatCnicNumber = (cnic) => {
        if (!cnic) return '';
        const cleanedCnic = cnic.replace(/\D/g, '');
        if (cleanedCnic.length === 13) {
            return `${cleanedCnic.slice(0, 5)}-${cleanedCnic.slice(5, 12)}-${cleanedCnic.slice(12)}`;
        }
        return cnic; // Return unformatted if length is not 13
    };

    const formatPhoneNumber = (phone) => {
        if (!phone) return '';
        const cleanedPhone = phone.replace(/\D/g, '');
        if (cleanedPhone.length === 11) {
            return `${cleanedPhone.slice(0, 4)}-${cleanedPhone.slice(4)}`;
        }
        return phone; // Return unformatted if length is not 11
    };

    return (
        <div
            id="modalOverlay"
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleOverlayClick}
        >
            <div
                className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Section */}
                <div className="relative bg-indigo-600 text-white p-6 rounded-t-xl">
                    <button
                        onClick={handleCloseModal}
                        className="absolute top-4 right-4 text-white hover:text-gray-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h2 className="text-2xl font-bold">Teacher Profile</h2>
                </div>

                {/* Profile Section */}
                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 mb-6">
                        {/* Photo Section */}
                        <div className="w-full md:w-1/3 flex flex-col items-center">
                            <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-indigo-100">
                                {teacherData.photo ? (
                                    <img 
                                        src={imageUrl} 
                                        alt={teacherData.fullName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-indigo-100 flex items-center justify-center">
                                        <svg className="w-20 h-20 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <h3 className="text-xl font-semibold text-center">{teacherData.fullName}</h3>
                            <p className="text-gray-500 text-center">{teacherData.userId.email}</p>
                        </div>

                        {/* Details Section */}
                        <div className="w-full md:w-2/3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Personal Information */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-indigo-600 mb-3">Personal Information</h4>
                                    <div className="space-y-2">
                                        <div>
                                            <label className="text-sm text-gray-500">CNIC Number</label>
                                            <p className="font-medium">{formatCnicNumber(teacherData.cnicNumber)}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500">Phone Number</label>
                                            <p className="font-medium">{teacherData.phoneNumber}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500">Gender</label>
                                            <p className="font-medium">{teacherData.gender}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500">Cast</label>
                                            <p className="font-medium">{teacherData.cast}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Employment Details */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-indigo-600 mb-3">Employment Details</h4>
                                    <div className="space-y-2">
                                        <div>
                                            <label className="text-sm text-gray-500">Basic Salary</label>
                                            <p className="font-medium">Rs. {teacherData.basicSalary}/hr</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500">Join Date</label>
                                            <p className="font-medium">{moment(teacherData.joinDate).format('YYYY-MM-DD')}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500">Nature of Appointment</label>
                                            <p className="font-medium capitalize">{teacherData.natureOfAppointment}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Address Section */}
                            <div className="bg-gray-50 p-4 rounded-lg mt-4">
                                <h4 className="font-semibold text-indigo-600 mb-3">Address</h4>
                                <p className="text-gray-700">{teacherData.address}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewTeacherModal;
