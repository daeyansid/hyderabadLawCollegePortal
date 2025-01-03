import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { fetchStudentById, updateStudent, fetchGuardianByCnic, fetchClasses, fetchSubjectByClassAndBranch } from '../../../../api/studentApi';

const EditStudent = () => {
    const { id } = useParams();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        fatherName: '',
        castSurname: '',
        religion: '',
        nationality: '',
        dateOfBirth: '',
        placeOfBirth: '',
        gender: '',
        permanentAddress: '',
        emergencyContactPerson: '',
        emergencyPhoneNumber: '',
        guardianId: '',
        latMarks: '',
        cnic: '',
        branchId: '',
        classId: '',
        batchYear: '',
        rollNumber: '',
        photo: null,
    });

    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [guardianCnic, setGuardianCnic] = useState('');
    const [classes, setClasses] = useState([]);
    const navigate = useNavigate();

    const stepIndicators = [
        { step: 1, label: "Personal Info" },
        { step: 2, label: "User Info" },
        { step: 3, label: "Registration" }
    ];

    useEffect(() => {
        const loadStudentData = async () => {
            try {
                const response = await fetchStudentById(id);
                const studentData = response;
                // console.log("studentData", studentData);

                setFormData({
                    email: studentData.userId.email,
                    fullName: studentData.fullName,
                    fatherName: studentData.fatherName,
                    castSurname: studentData.castSurname,
                    religion: studentData.religion,
                    nationality: studentData.nationality,
                    dateOfBirth: new Date(studentData.dateOfBirth).toISOString().split('T')[0],
                    placeOfBirth: studentData.placeOfBirth,
                    gender: studentData.gender,
                    permanentAddress: studentData.permanentAddress,
                    emergencyContactPerson: studentData.emergencyContactPerson,
                    emergencyPhoneNumber: studentData.emergencyPhoneNumber,
                    branchId: studentData.branchId._id || '',
                    classId: studentData.classId._id || '',
                    batchYear: studentData.batchYear || '',
                    rollNumber: studentData.rollNumber || '',
                    photo: null,
                    latMarks: studentData.latMarks || '',
                    cnic: studentData.cnic || '',
                });

                const classData = await fetchClasses(studentData.branchId._id);
                // console.log("classData",classData.data);
                setClasses(classData.data);

            } catch (error) {
                console.error('Error fetching student data:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Unable to fetch student data. Please try again later.',
                });
            }
        };

        loadStudentData();
    }, [id]);

    const handleClassChange = async (e) => {
        const selectedClassId = e.target.value;
        setFormData({ ...formData, classId: selectedClassId });
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

    const validateCnic = (cnic) => {
        const cnicPattern = /^\d{5}-\d{7}-\d{1}$/;
        return cnicPattern.test(cnic);
    };

    const handleCnicChange = (e) => {
        const inputCnic = e.target.value.replace(/[^0-9-]/g, "");
        let formattedCnic = inputCnic
            .replace(/^(\d{5})(\d)/, "$1-$2")
            .replace(/-(\d{7})(\d)/, "-$1-$2");

        if (formattedCnic.length <= 15) {
            setFormData({ ...formData, cnic: formattedCnic });
        }
    };

    const validateStep = (currentStep) => {
        const newErrors = {};

        if (currentStep === 1) {
            if (!formData.fullName) newErrors.fullName = "Full Name is required.";
            if (!formData.fatherName) newErrors.fatherName = "Father Name is required.";
            if (!formData.castSurname) newErrors.castSurname = "Cast/Surname is required.";
            if (!formData.religion) newErrors.religion = "Religion is required.";
            if (!formData.nationality) newErrors.nationality = "Nationality is required.";
            if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required.";
            if (!formData.placeOfBirth) newErrors.placeOfBirth = "Place of Birth is required.";
            if (!formData.gender) newErrors.gender = "Gender is required.";
            if (!formData.permanentAddress) newErrors.permanentAddress = "Permanent Address is required.";
            if (!formData.emergencyContactPerson) newErrors.emergencyContactPerson = "Emergency Contact Person is required.";
            if (!formData.emergencyPhoneNumber) newErrors.emergencyPhoneNumber = "Emergency Phone Number is required.";
            if (!formData.cnic) newErrors.cnic = "CNIC is required.";
            else if (!validateCnic(formData.cnic)) {
                newErrors.cnic = "Invalid CNIC format (00000-0000000-0)";
            }
        } else if (currentStep === 2) {
            if (!formData.email) newErrors.email = "Email is required.";
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(formData.email)) {
                newErrors.email = "Invalid email format.";
            }
        } else if (currentStep === 3) {
            if (!formData.classId) newErrors.classId = "Semester is required.";
            if (!formData.batchYear) newErrors.batchYear = "Batch Year is required.";
            if (!formData.rollNumber) newErrors.rollNumber = "Roll Number is required.";
            if (!formData.latMarks) newErrors.latMarks = "LAT Marks is required.";
            if (formData.latMarks && (formData.latMarks < 0 || formData.latMarks > 100)) {
                newErrors.latMarks = "LAT Marks must be between 0 and 100.";
            }
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
    
        // Validate the current step before proceeding
        if (validateStep(step)) {
            const data = new FormData();
    
            // Append all formData fields to FormData
            Object.keys(formData).forEach((key) => {
                if (key === 'photo' && formData[key]) {
                    // Append photo only if it exists
                    data.append(key, formData[key]);
                } else {
                    // Append other fields
                    data.append(key, formData[key]);
                }
            });
    
            // **1. Log the formData state (plain JavaScript object)**
            // console.log("Form Data State:", formData);
    
            // **2. Log the FormData entries**
            // console.log("FormData Entries:");
            for (let [key, value] of data.entries()) {
                // For file inputs, log the file name instead of the entire File object for clarity
                if (key === 'photo' && value instanceof File) {
                    // console.log(`${key}: ${value.name}`);
                } else {
                    // console.log(`${key}: ${value}`);
                }
            }
    
            try {
                // Make the API call to update the student
                await updateStudent(id, data);
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Student updated successfully!",
                });
                navigate("/branch-admin/user-management/student");
            } catch (error) {
                // Log the detailed error response
                console.error("Error updating student:", error.response ? error.response.data : error);
    
                Swal.fire({
                    icon: "error",
                    title: "Failed to Update Student",
                    text:
                        error.response?.data?.message || "An unexpected error occurred.",
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
                                placeholder="Enter full name"
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.fullName && <p className="text-red-600">{errors.fullName}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Father Name</label>
                            <input
                                type="text"
                                name="fatherName"
                                value={formData.fatherName}
                                onChange={handleInputChange}
                                placeholder="Enter father's name"
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.fatherName && <p className="text-red-600">{errors.fatherName}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Cast / Surname</label>
                            <input
                                type="text"
                                name="castSurname"
                                value={formData.castSurname}
                                onChange={handleInputChange}
                                placeholder="Enter cast/surname"
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
                                placeholder="Enter religion"
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
                                placeholder="Enter nationality"
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
                                placeholder="Enter place of birth"
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
                                placeholder="Enter permanent address"
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
                                placeholder="Enter emergency contact person name"
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
                                placeholder="Enter emergency contact number"
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
                                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                                placeholder="Roll number"
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
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">CNIC</label>
                            <input
                                type="text"
                                name="cnic"
                                value={formData.cnic}
                                onChange={handleCnicChange}
                                placeholder="00000-0000000-0"
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.cnic && <p className="text-red-600">{errors.cnic}</p>}
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
                            <label className="block text-gray-700 font-semibold">Password (Optional)</label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password (optional)"
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.password && <p className="text-red-600">{errors.password}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Email</label>
                            <input
                                type="email"
                                name="email"
                                disabled
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter email address"
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.email && <p className="text-red-600">{errors.email}</p>}
                        </div>
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
                            <label className="block text-gray-700 font-semibold">Batch Year</label>
                            <input
                                type="text"
                                name="batchYear"
                                value={formData.batchYear}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.batchYear && <p className="text-red-600">{errors.batchYear}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">Roll Number</label>
                            <input
                                type="text"
                                name="rollNumber"
                                value={formData.rollNumber}
                                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                                placeholder="Roll number"
                                disabled
                            />
                            {errors.rollNumber && <p className="text-red-600">{errors.rollNumber}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold">LAT Marks</label>
                            <input
                                type="number"
                                name="latMarks"
                                value={formData.latMarks}
                                onChange={handleInputChange}
                                placeholder="Enter LAT Marks (0-100)"
                                min="0"
                                max="100"
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {errors.latMarks && <p className="text-red-600">{errors.latMarks}</p>}
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
