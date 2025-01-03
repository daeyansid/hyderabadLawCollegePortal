import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { fetchTeacherById } from '../../../../api/teacherApi';
import moment from 'moment';
import { baseURL } from '../../../../index';

const ViewTeacherModal = ({ showModal, setShowModal, teacherId }) => {
    const [teacherData, setTeacherData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTeacherData = async () => {
            setLoading(true);
            try {
                const data = await fetchTeacherById(teacherId);
                // console.log(data.data);
                if (data.data) {
                    setTeacherData(data.data);
                } else {
                    Swal.fire({
                        icon: 'info',
                        title: 'No Data',
                        text: 'No teacher data found.',
                    });
                    setShowModal(false);
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Unable to fetch teacher data. Please try again later.',
                });
                setShowModal(false);
            } finally {
                setLoading(false);
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

    const imageUrl = teacherData?.photo ? `${baseURL}teacher/${teacherData.photo}` : '';

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
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleOverlayClick}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Section */}
                <div className="relative bg-indigo-600 text-white p-4 sm:p-6 rounded-t-xl">
                    <button
                        onClick={handleCloseModal}
                        className="absolute top-4 right-4 text-white hover:text-gray-200 focus:outline-none"
                        aria-label="Close modal"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h2 className="text-xl sm:text-2xl font-bold text-center">Teacher Profile</h2>
                </div>

                {/* Content Section */}
                <div className="p-4 sm:p-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <svg
                                className="animate-spin h-8 w-8 text-indigo-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                ></path>
                            </svg>
                        </div>
                    ) : teacherData ? (
                        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 mb-4 sm:mb-6">
                            {/* Photo Section */}
                            <div className="w-full md:w-1/3 flex flex-col items-center">
                                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden mb-3 sm:mb-4 border-4 border-indigo-100">
                                    {teacherData.photo ? (
                                        <img
                                            src={imageUrl}
                                            alt={teacherData.fullName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-indigo-100 flex items-center justify-center">
                                            <svg
                                                className="w-16 h-16 sm:w-20 sm:h-20 text-indigo-300"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-center">{teacherData.fullName}</h3>
                                <p className="text-sm sm:text-base text-gray-500 text-center break-all">
                                    {teacherData.userId.email}
                                </p>
                            </div>

                            {/* Details Section */}
                            <div className="w-full md:w-2/3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    {/* Personal Information */}
                                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                        <h4 className="font-semibold text-indigo-600 mb-2 sm:mb-3 text-sm sm:text-base">
                                            Personal Information
                                        </h4>
                                        <div className="space-y-2">
                                            <InfoItem label="CNIC Number" value={formatCnicNumber(teacherData.cnicNumber)} />
                                            <InfoItem label="Phone Number" value={formatPhoneNumber(teacherData.phoneNumber)} />
                                            <InfoItem label="Gender" value={teacherData.gender} />
                                            <InfoItem label="Cast" value={teacherData.cast} />
                                        </div>
                                    </div>

                                    {/* Employment Details */}
                                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                        <h4 className="font-semibold text-indigo-600 mb-2 sm:mb-3 text-sm sm:text-base">
                                            Employment Details
                                        </h4>
                                        <div className="space-y-2">
                                            <InfoItem label="Basic Salary" value={`Rs. ${teacherData.basicSalary}/hr`} />
                                            <InfoItem label="Join Date" value={moment(teacherData.joinDate).format('YYYY-MM-DD')} />
                                            <InfoItem
                                                label="Nature of Appointment"
                                                value={teacherData.natureOfAppointment}
                                                className="capitalize"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Address Section */}
                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mt-3 sm:mt-4">
                                    <h4 className="font-semibold text-indigo-600 mb-2 sm:mb-3 text-sm sm:text-base">Address</h4>
                                    <p className="text-gray-700 text-sm sm:text-base">{teacherData.address}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // This case handles when teacherData is null but not loading, which shouldn't normally occur
                        <div className="text-center text-gray-600">No teacher data available.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Add this new component for consistent info items
const InfoItem = ({ label, value, className = '' }) => (
    <div>
        <label className="text-xs sm:text-sm text-gray-500">{label}</label>
        <p className={`font-medium text-sm sm:text-base ${className}`}>{value}</p>
    </div>
);

export default ViewTeacherModal;
