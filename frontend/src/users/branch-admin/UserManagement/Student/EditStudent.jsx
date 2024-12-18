import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { fetchStudentById, updateStudent, fetchGuardianByCnic, fetchClasses, fetchSectionsByClassAndBranch } from '../../../../api/studentApi';

const EditStudent = () => {
    const { id } = useParams();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullName: '',
        admissionClass: '',
        castSurname: '',
        religion: '',
        nationality: '',
        dateOfBirth: '',
        placeOfBirth: '',
        gender: 'Male', // Default value
        permanentAddress: '',
        emergencyContactPerson: '',
        emergencyPhoneNumber: '',
        guardianId: '',
        studentOldAcademicInfo: [],
        photocopiesCnic: false,
        birthCertificate: false,
        leavingCertificate: false,
        schoolReport: false,
        passportPhotos: false,
        monthlyFees: '',
        admissionFees: '',
        branchId: localStorage.getItem('branchId') || '',
        classId: '',
        sectionId: '',
        batchYear: '',
        rollNumber: '',
        photo: null,
    });

    const [password, setPassword] = useState('');
    const [guardianDetails, setGuardianDetails] = useState(null);
    const [errors, setErrors] = useState({});
    const [guardianCnic, setGuardianCnic] = useState('');
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const navigate = useNavigate();

    const stepIndicators = [
        { step: 1, label: "Personal Info" },
        { step: 2, label: "Guardian Info" },
        { step: 3, label: "Schooling Details" },
        { step: 4, label: "Documents" },
        { step: 5, label: "User Info" },
        { step: 6, label: "Fees & Registration" }
    ];

    useEffect(() => {
        const loadStudentData = async () => {
            try {
                const response = await fetchStudentById(id);
                const studentData = response;

                setFormData({
                    username: studentData.userId.username,
                    email: studentData.userId.email,
                    fullName: studentData.fullName,
                    admissionClass: studentData.admissionClass,
                    castSurname: studentData.castSurname,
                    religion: studentData.religion,
                    nationality: studentData.nationality,
                    dateOfBirth: new Date(studentData.dateOfBirth).toISOString().split('T')[0],
                    placeOfBirth: studentData.placeOfBirth,
                    gender: studentData.gender,
                    permanentAddress: studentData.permanentAddress,
                    emergencyContactPerson: studentData.emergencyContactPerson,
                    emergencyPhoneNumber: studentData.emergencyPhoneNumber,
                    guardianId: studentData.guardianId?._id || '',
                    studentOldAcademicInfo: studentData.studentOldAcademicInfoId || [],
                    photocopiesCnic: studentData.photocopiesCnic,
                    birthCertificate: studentData.birthCertificate,
                    leavingCertificate: studentData.leavingCertificate,
                    schoolReport: studentData.schoolReport,
                    passportPhotos: studentData.passportPhotos,
                    monthlyFees: studentData.monthlyFees,
                    admissionFees: studentData.admissionFees,
                    branchId: studentData.branchId?._id || '',
                    classId: studentData.classId?._id || '',
                    sectionId: studentData.sectionId?._id || '',
                    batchYear: studentData.batchYear || '',
                    rollNumber: studentData.rollNumber || '',
                    photo: null,
                });

                setGuardianDetails(studentData.guardianId || null);
                setGuardianCnic(studentData.guardianId?.cnicNumber || '');

                const classData = await fetchClasses(studentData.branchId?._id || '');
                setClasses(classData.data);

                if (studentData.classId?._id) {
                    const sectionData = await fetchSectionsByClassAndBranch(studentData.classId._id, studentData.branchId?._id);
                    setSections(sectionData.data);
                }
            } catch (error) {
                console.error('Error fetching student data:', error);
            }
        };

        loadStudentData();
    }, [id]);

    const handleClassChange = async (e) => {
        const selectedClassId = e.target.value;
        setFormData({ ...formData, classId: selectedClassId });

        try {
            const sectionData = await fetchSectionsByClassAndBranch(selectedClassId, formData.branchId);
            setSections(sectionData.data);
        } catch (error) {
            console.error('Error fetching sections:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCheckBoxChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.checked,
        });
    };

    const handleGuardianCnicChange = (e) => {
        setGuardianCnic(e.target.value);
    };

    const validateStep = (currentStep) => {
        const newErrors = {};

        if (currentStep === 1) {
            if (!formData.fullName) newErrors.fullName = "Full Name is required.";
            if (!formData.admissionClass) newErrors.admissionClass = "Admission class is required.";
            if (!formData.castSurname) newErrors.castSurname = "Cast/Surname is required.";
            if (!formData.religion) newErrors.religion = "Religion is required.";
            if (!formData.nationality) newErrors.nationality = "Nationality is required.";
            if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required.";
            if (!formData.placeOfBirth) newErrors.placeOfBirth = "Place of Birth is required.";
            if (!formData.gender) newErrors.gender = "Gender is required.";
            if (!formData.permanentAddress) newErrors.permanentAddress = "Permanent Address is required.";
            if (!formData.emergencyContactPerson) newErrors.emergencyContactPerson = "Emergency Contact Person is required.";
            if (!formData.emergencyPhoneNumber) newErrors.emergencyPhoneNumber = "Emergency Phone Number is required.";
            if (!formData.batchYear) newErrors.batchYear = "Batch Year is required.";
        } else if (currentStep === 2) {
            if (!guardianCnic) newErrors.guardianCnic = "Guardian CNIC is required.";
        } else if (currentStep === 5) {
            if (!formData.username) newErrors.username = "Username is required.";
            if (!formData.email) newErrors.email = "Email is required.";
        } else if (currentStep === 6) {
            if (!formData.monthlyFees) newErrors.monthlyFees = "Monthly Fees is required.";
            if (!formData.classId) newErrors.classId = "Class is required.";
            if (!formData.sectionId) newErrors.sectionId = "Section is required.";
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleStepChange = (newStep) => {
        if (validateStep(step)) {
            setStep(newStep);
        }
    };

    const findGuardian = async () => {
        try {
            const guardianData = await fetchGuardianByCnic(guardianCnic);
            if (guardianData) {
                const guardian = guardianData.data;
                setGuardianDetails(guardian);
                setFormData((prevState) => ({
                    ...prevState,
                    guardianId: guardian._id,
                }));
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Not Found',
                    text: 'No guardian found with this CNIC.',
                });
            }
        } catch (error) {
            console.error('Error fetching guardian by CNIC:', error);
        }
    };

    const handleAcademicInfoChange = (index, e) => {
        const updatedAcademicInfo = formData.studentOldAcademicInfo.map((info, i) =>
            i === index ? { ...info, [e.target.name]: e.target.value } : info
        );
        setFormData({
            ...formData,
            studentOldAcademicInfo: updatedAcademicInfo,
        });
    };

    const addAcademicInfoRow = () => {
        setFormData({
            ...formData,
            studentOldAcademicInfo: [...formData.studentOldAcademicInfo, {}],
        });
    };

    const removeAcademicInfoRow = (index) => {
        const updatedAcademicInfo = formData.studentOldAcademicInfo.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            studentOldAcademicInfo: updatedAcademicInfo,
        });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, photo: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateStep(step)) {
            const data = new FormData();

            Object.keys(formData).forEach((key) => {
                if (key === 'studentOldAcademicInfo') {
                    data.append(key, JSON.stringify(formData[key]));
                } else if (key === 'photo' && formData[key]) {
                    data.append(key, formData[key]);
                } else {
                    data.append(key, formData[key]);
                }
            });

            try {
                await updateStudent(id, data);
                navigate('/branch-admin/user-management/student');
            } catch (error) {
                console.error('Error updating student:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Update Student',
                    text: error.response?.data?.message || 'An unexpected error occurred.',
                });
            }
        }
    };

    return (
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                {stepIndicators.map((indicator, index) => (
                    <div key={index} className="flex items-center">
                        <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center text-white ${
                                step >= indicator.step ? 'bg-indigo-600' : 'bg-gray-300'
                            }`}
                        >
                            {indicator.step}
                        </div>
                        {index < stepIndicators.length - 1 && (
                            <div className={`flex-1 h-1 ${step > indicator.step ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                        )}
                    </div>
                ))}
            </div>

            <h2 className="text-2xl font-semibold text-indigo-900 mb-6">
                {stepIndicators.find((si) => si.step === step)?.label}
            </h2>

            <form onSubmit={handleSubmit}>
                {step === 1 && (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.fullName && <p className="text-red-600">{errors.fullName}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Admission sought to class</label>
                            <input
                                type="text"
                                name="admissionClass"
                                value={formData.admissionClass}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.admissionClass && <p className="text-red-600">{errors.admissionClass}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Cast / Surname</label>
                            <input
                                type="text"
                                name="castSurname"
                                value={formData.castSurname}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.castSurname && <p className="text-red-600">{errors.castSurname}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Religion</label>
                            <input
                                type="text"
                                name="religion"
                                value={formData.religion}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.religion && <p className="text-red-600">{errors.religion}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Nationality</label>
                            <input
                                type="text"
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.nationality && <p className="text-red-600">{errors.nationality}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Date of Birth</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.dateOfBirth && <p className="text-red-600">{errors.dateOfBirth}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Place of Birth</label>
                            <input
                                type="text"
                                name="placeOfBirth"
                                value={formData.placeOfBirth}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.placeOfBirth && <p className="text-red-600">{errors.placeOfBirth}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            {errors.gender && <p className="text-red-600">{errors.gender}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Permanent Address</label>
                            <input
                                type="text"
                                name="permanentAddress"
                                value={formData.permanentAddress}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.permanentAddress && <p className="text-red-600">{errors.permanentAddress}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Emergency Contact Person</label>
                            <input
                                type="text"
                                name="emergencyContactPerson"
                                value={formData.emergencyContactPerson}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.emergencyContactPerson && <p className="text-red-600">{errors.emergencyContactPerson}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Emergency Phone No</label>
                            <input
                                type="text"
                                name="emergencyPhoneNumber"
                                value={formData.emergencyPhoneNumber}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.emergencyPhoneNumber && <p className="text-red-600">{errors.emergencyPhoneNumber}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Roll Number</label>
                            <input
                                type="text"
                                name="rollNumber"
                                value={formData.rollNumber}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                readOnly
                                disabled
                            />
                            {errors.rollNumber && <p className="text-red-600">{errors.rollNumber}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Batch Year</label>
                            <input
                                type="text"
                                name="batchYear"
                                value={formData.batchYear}
                                onChange={handleInputChange}
                                disabled
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.batchYear && <p className="text-red-600">{errors.batchYear}</p>}
                        </div>
                        <div className="flex justify-between mt-6">
                            <button
                                type="button"
                                onClick={() => navigate('/branch-admin/user-management/student')}
                                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStepChange(2)}
                                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Guardian CNIC</label>
                            <input
                                type="text"
                                name="guardianCnic"
                                value={guardianCnic}
                                onChange={handleGuardianCnicChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                disabled
                            />
                            {errors.guardianCnic && <p className="text-red-600">{errors.guardianCnic}</p>}
                        </div>
                        <button
                            type="button"
                            onClick={findGuardian}
                            disabled
                            className="cursor-no-drop bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Find Guardian
                        </button>
                        {guardianDetails && (
                            <div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold">Full Name</label>
                                    <p className="text-gray-900">{guardianDetails.fullName}</p>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold">Relationship</label>
                                    <p className="text-gray-900">{guardianDetails.relationship}</p>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold">Mother's Name</label>
                                    <p className="text-gray-900">{guardianDetails.studentMotherName}</p>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold">Mother's CNIC</label>
                                    <p className="text-gray-900">{guardianDetails.motherCnicNumber}</p>
                                </div>
                            </div>
                        )}
                        <div className="flex justify-between mt-6">
                            <button
                                type="button"
                                onClick={() => handleStepChange(1)}
                                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStepChange(3)}
                                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}

                {step === 3 && (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">
                                Previous Schooling Details
                            </label>
                            {formData.studentOldAcademicInfo.map((info, index) => (
                                <div key={index} className="mb-4 grid grid-cols-6 gap-4">
                                    <input
                                        type="text"
                                        name="instituteName"
                                        placeholder="Institute Name"
                                        value={info.instituteName || ''}
                                        onChange={(e) => handleAcademicInfoChange(index, e)}
                                        className="p-2 border border-gray-300 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        name="location"
                                        placeholder="Location"
                                        value={info.location || ''}
                                        onChange={(e) => handleAcademicInfoChange(index, e)}
                                        className="p-2 border border-gray-300 rounded-md"
                                    />
                                    <input
                                        type="date"
                                        name="from"
                                        placeholder="From"
                                        value={info.from ? new Date(info.from).toISOString().split('T')[0] : ''}
                                        onChange={(e) => handleAcademicInfoChange(index, e)}
                                        className="p-2 border border-gray-300 rounded-md"
                                    />
                                    <input
                                        type="date"
                                        name="to"
                                        placeholder="To"
                                        value={info.to ? new Date(info.to).toISOString().split('T')[0] : ''}
                                        onChange={(e) => handleAcademicInfoChange(index, e)}
                                        className="p-2 border border-gray-300 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        name="upToClass"
                                        placeholder="Up to Class"
                                        value={info.upToClass || ''}
                                        onChange={(e) => handleAcademicInfoChange(index, e)}
                                        className="p-2 border border-gray-300 rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeAcademicInfoRow(index)}
                                        className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addAcademicInfoRow}
                                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Add Row
                            </button>
                        </div>
                        <div className="flex justify-between mt-6">
                            <button
                                type="button"
                                onClick={() => handleStepChange(2)}
                                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStepChange(4)}
                                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}

               {step === 4 && (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Submitted Documents</label>
                            <div className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    name="photocopiesCnic"
                                    checked={formData.photocopiesCnic}
                                    onChange={handleCheckBoxChange}
                                    className="mr-2"
                                />
                                <label className="text-gray-700">Photocopies of CNIC Cards of both the parents</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    name="birthCertificate"
                                    checked={formData.birthCertificate}
                                    onChange={handleCheckBoxChange}
                                    className="mr-2"
                                />
                                <label className="text-gray-700">Photocopies of the child's birth certificate</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    name="leavingCertificate"
                                    checked={formData.leavingCertificate}
                                    onChange={handleCheckBoxChange}
                                    className="mr-2"
                                />
                                <label className="text-gray-700">Original Leaving / Transfer certificate from the last school attended</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    name="schoolReport"
                                    checked={formData.schoolReport}
                                    onChange={handleCheckBoxChange}
                                    className="mr-2"
                                />
                                <label className="text-gray-700">Photocopies of the child's last school report</label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    name="passportPhotos"
                                    checked={formData.passportPhotos}
                                    onChange={handleCheckBoxChange}
                                    className="mr-2"
                                />
                                <label className="text-gray-700">Two passport size photographs of the child</label>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold">Update Photo</label>
                                <input
                                    type="file"
                                    name="photo"
                                    onChange={handleFileChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    accept="image/*"
                                />
                                {formData.photo && <p className="text-gray-600 mt-2">Current file: {formData.photo.name}</p>}
                            </div>
                        </div>
                        <div className="flex justify-between mt-6">
                            <button
                                type="button"
                                onClick={() => handleStepChange(3)}
                                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStepChange(5)}
                                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}

                {step === 5 && (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.username && <p className="text-red-600">{errors.username}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Password (Optional)</label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.password && <p className="text-red-600">{errors.password}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.email && <p className="text-red-600">{errors.email}</p>}
                        </div>
                        <div className="flex justify-between mt-6">
                            <button
                                type="button"
                                onClick={() => handleStepChange(4)}
                                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStepChange(6)}
                                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}

                {step === 6 && (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Monthly Fees</label>
                            <input
                                type="number"
                                name="monthlyFees"
                                value={formData.monthlyFees}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.monthlyFees && <p className="text-red-600">{errors.monthlyFees}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Admission Fees (Optional)</label>
                            <input
                                type="number"
                                name="admissionFees"
                                value={formData.admissionFees}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Class</label>
                            <select
                                name="classId"
                                value={formData.classId}
                                onChange={handleClassChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Select Class</option>
                                {classes.map((classItem) => (
                                    <option key={classItem._id} value={classItem._id}>
                                        {classItem.className}
                                    </option>
                                ))}
                            </select>
                            {errors.classId && <p className="text-red-600">{errors.classId}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Section</label>
                            <select
                                name="sectionId"
                                value={formData.sectionId}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Select Section</option>
                                {sections.map((sectionItem) => (
                                    <option key={sectionItem._id} value={sectionItem._id}>
                                        {sectionItem.sectionName}
                                    </option>
                                ))}
                            </select>
                            {errors.sectionId && <p className="text-red-600">{errors.sectionId}</p>}
                        </div>
                        <div className="flex justify-between mt-6">
                            <button
                                type="button"
                                onClick={() => handleStepChange(5)}
                                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Submit
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default EditStudent;
