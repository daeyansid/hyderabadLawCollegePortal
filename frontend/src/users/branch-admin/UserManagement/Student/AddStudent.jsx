import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  createStudent,
  fetchClasses,
  fetchStudentsByBatchYear,
} from "../../../../api/studentApi";

const AddStudent = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    password: "",
    email: "",
    fullName: "",
    fatherName: "",
    castSurname: "",
    religion: "",
    nationality: "",
    dateOfBirth: "",
    placeOfBirth: "",
    gender: "",
    permanentAddress: "",
    emergencyContactPerson: "",
    emergencyPhoneNumber: "",
    guardianId: "",
    monthlyFees: "",
    branchId: localStorage.getItem("branchId") || "",
    classId: "",
    batchYear: "",
    rollNumber: "",
    photo: null,
    latMarks: "",
    cnic: "",
  });
  const [errors, setErrors] = useState({});
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  const stepIndicators = [
    { step: 1, label: "Personal Info" },
    { step: 2, label: "User Info" },
    { step: 3, label: "Fees & Registration" },
  ];

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const classData = await fetchClasses(formData.branchId);
        setClasses(classData.data);
      } catch (error) {
        console.error("Error fetching Semester:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Unable to fetch Semester. Please try again later." + error.response.data.message,
        });
      }
    };

    loadClasses();
  }, [formData.branchId]);

  const handleClassChange = async (e) => {
    const selectedClassId = e.target.value;
    setFormData({ ...formData, classId: selectedClassId });
  };

  const handleBatchYearChange = async (e) => {
    const batchYear = e.target.value;
    setFormData({ ...formData, batchYear });

    // if (batchYear) {
    //   try {
    //     const studentsInBatch = await fetchStudentsByBatchYear(batchYear);
    //     const rollNumber = `${batchYear}/${studentsInBatch.length + 1}`;
    //     setFormData((prev) => ({ ...prev, rollNumber }));
    //   } catch (error) {
    //     console.error("Error calculating roll number:", error);
    //     Swal.fire({
    //       icon: "error",
    //       title: "Error",
    //       text: "Unable to calculate roll number. Please try again later.",
    //     });
    //   }
    // } else {
    //   setFormData((prev) => ({ ...prev, rollNumber: "" }));
    // }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      const file = files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) { // 2MB in bytes
          setErrors(prev => ({
            ...prev,
            photo: "Image size must be less than 2MB"
          }));
          return;
        }
        setFormData({
          ...formData,
          [name]: file,
        });
        // Clear error if file is valid
        setErrors(prev => ({
          ...prev,
          photo: null
        }));
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateCnic = (cnic) => {
    // Check if the CNIC matches the pattern 00000-0000000-0
    const cnicPattern = /^\d{5}-\d{7}-\d{1}$/;
    return cnicPattern.test(cnic);
  };

  const formatCnicDisplay = (cnic) => {
    // Format CNIC for display as 00000-0000000-0
    return cnic.replace(/^(\d{5})(\d{7})(\d{1})$/, "$1-$2-$3");
  };

  const handleGuardianCnicChange = (e) => {
    // Allow input with hyphens and restrict to the pattern 00000-0000000-0
    const inputCnic = e.target.value.replace(/[^0-9-]/g, ""); // Allow numbers and hyphens only

    // Add hyphens at the correct positions if not manually added
    let formattedCnic = inputCnic
      .replace(/^(\d{5})(\d)/, "$1-$2") // Insert hyphen after the first 5 digits
      .replace(/-(\d{7})(\d)/, "-$1-$2"); // Insert hyphen after the 7 digits following the first hyphen

    // Restrict to maximum length of 15 characters (13 digits + 2 hyphens)
    if (formattedCnic.length <= 15) {
      setFormData({ ...formData, guardianId: formattedCnic });
    }
  };

  const handleCnicChange = (e) => {
    // Allow input with hyphens and restrict to the pattern 00000-0000000-0
    const inputCnic = e.target.value.replace(/[^0-9-]/g, ""); // Allow numbers and hyphens only

    // Add hyphens at the correct positions if not manually added
    let formattedCnic = inputCnic
      .replace(/^(\d{5})(\d)/, "$1-$2") // Insert hyphen after the first 5 digits
      .replace(/-(\d{7})(\d)/, "-$1-$2"); // Insert hyphen after the 7 digits following the first hyphen

    // Restrict to maximum length of 15 characters (13 digits + 2 hyphens)
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
      if (!formData.photo) newErrors.photo = "Profile photo is required.";
      if (!formData.cnic) newErrors.cnic = "CNIC is required.";
      else if (!validateCnic(formData.cnic)) {
        newErrors.cnic = "Invalid CNIC format (00000-0000000-0)";
      }
    } else if (currentStep === 2) {
      if (!formData.password) newErrors.password = "Password is required.";
      if (!formData.email) newErrors.email = "Email is required.";
      else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
          newErrors.email = "Invalid email format.";
        }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateStep(step)) {
      const data = new FormData();
  
      // Append all formData fields to FormData
      Object.keys(formData).forEach((key) => {
        if (key === "photo" && formData[key]) {
          // Append photo only if it exists
          data.append(key, formData[key]);
        } else {
          // Append other fields
          data.append(key, formData[key]);
        }
      });
  
      // **1. Log the formData state (plain JavaScript object)**
      console.log("Form Data State:", formData);
  
      // **2. Log the FormData entries**
      console.log("FormData Entries:");
      for (let [key, value] of data.entries()) {
        // For file inputs, log the file name instead of the entire File object for clarity
        if (key === "photo" && value instanceof File) {
          console.log(`${key}: ${value.name}`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
  
      try {
        // Make the API call to create the student
        await createStudent(data);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Student created successfully!",
        });
        navigate("/branch-admin/user-management/student");
      } catch (error) {
        // Log the detailed error response
        console.error(
          "Error creating student:",
          error.response ? error.response.data : error
        );
        Swal.fire({
          icon: "error",
          title: "Failed to Create Student",
          text:
            error.response?.data?.message || "An unexpected error occurred.",
        });
      }
    }
  };
  

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      {/* Step Indicators */}
      <div className="flex justify-between items-center mb-6">
        {stepIndicators.map((indicator, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-white ${step >= indicator.step
                  ? "bg-indigo-600"
                  : "bg-gray-300"
                }`}
            >
              {indicator.step}
            </div>
            {index < stepIndicators.length - 1 && (
              <div
                className={`flex-1 h-1 ${step > indicator.step ? "bg-indigo-600" : "bg-gray-300"
                  }`}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Current Step Label */}
      <h2 className="text-2xl font-semibold text-indigo-900 mb-6">
        {stepIndicators.find((si) => si.step === step)?.label}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Personal Info */}
        {step === 1 && (
          <>
            {/* Profile Photo */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Profile Photo (Max 2MB)
              </label>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.photo && (
                <p className="text-red-600">{errors.photo}</p>
              )}
              {formData.photo && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(formData.photo)}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter full name"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.fullName && (
                <p className="text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Father Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Father Name
              </label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleInputChange}
                placeholder="Enter father's name"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.fatherName && (
                <p className="text-red-600">{errors.fatherName}</p>
              )}
            </div>

            {/* Cast / Surname */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Cast / Surname
              </label>
              <input
                type="text"
                name="castSurname"
                value={formData.castSurname}
                onChange={handleInputChange}
                placeholder="Enter cast/surname"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.castSurname && (
                <p className="text-red-600">{errors.castSurname}</p>
              )}
            </div>

            {/* Religion */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Religion
              </label>
              <input
                type="text"
                name="religion"
                value={formData.religion}
                onChange={handleInputChange}
                placeholder="Enter religion"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.religion && (
                <p className="text-red-600">{errors.religion}</p>
              )}
            </div>

            {/* Nationality */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Nationality
              </label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                placeholder="Enter nationality"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.nationality && (
                <p className="text-red-600">{errors.nationality}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.dateOfBirth && (
                <p className="text-red-600">{errors.dateOfBirth}</p>
              )}
            </div>

            {/* Place of Birth */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Place of Birth
              </label>
              <input
                type="text"
                name="placeOfBirth"
                value={formData.placeOfBirth}
                onChange={handleInputChange}
                placeholder="Enter place of birth"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.placeOfBirth && (
                <p className="text-red-600">{errors.placeOfBirth}</p>
              )}
            </div>

            {/* Gender */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-600">{errors.gender}</p>
              )}
            </div>

            {/* Permanent Address */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Permanent Address
              </label>
              <input
                type="text"
                name="permanentAddress"
                value={formData.permanentAddress}
                onChange={handleInputChange}
                placeholder="Enter permanent address"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.permanentAddress && (
                <p className="text-red-600">{errors.permanentAddress}</p>
              )}
            </div>

            {/* Emergency Contact Person */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Emergency Contact Person
              </label>
              <input
                type="text"
                name="emergencyContactPerson"
                value={formData.emergencyContactPerson}
                onChange={handleInputChange}
                placeholder="Enter emergency contact person name"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.emergencyContactPerson && (
                <p className="text-red-600">
                  {errors.emergencyContactPerson}
                </p>
              )}
            </div>

            {/* Emergency Phone Number */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Emergency Phone No
              </label>
              <input
                type="text"
                name="emergencyPhoneNumber"
                value={formData.emergencyPhoneNumber}
                onChange={handleInputChange}
                placeholder="Enter emergency contact number"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.emergencyPhoneNumber && (
                <p className="text-red-600">{errors.emergencyPhoneNumber}</p>
              )}
            </div>

            {/* CNIC */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                CNIC
              </label>
              <input
                type="text"
                name="cnic"
                value={formData.cnic}
                onChange={handleCnicChange}
                placeholder="00000-0000000-0"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.cnic && (
                <p className="text-red-600">{errors.cnic}</p>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() =>
                  navigate("/branch-admin/user-management/student")
                }
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

        {/* Step 2: User Info */}
        {step === 2 && (
          <>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.email && (
                <p className="text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.password && (
                <p className="text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Navigation Buttons */}
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

        {/* Step 3: Fees & Registration */}
        {step === 3 && (
          <>
            {/* Batch Year */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Batch Year
              </label>
              <select
                name="batchYear"
                value={formData.batchYear}
                onChange={handleBatchYearChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Batch Year</option>
                {Array.from(
                  { length: new Date().getFullYear() - 2009 },
                  (_, i) => 2010 + i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {errors.batchYear && (
                <p className="text-red-600">{errors.batchYear}</p>
              )}
            </div>

            {/* Roll Number is required */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Roll Number
              </label>
              <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter roll number"
              />
              {errors.rollNumber && (
                <p className="text-red-600">{errors.rollNumber}</p>
              )}
            </div>

            {/* Semester */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">Semester</label>
              <select
                name="classId"
                value={formData.classId}
                onChange={handleClassChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Semester</option>
                {classes.map((classItem) => (
                  <option key={classItem._id} value={classItem._id}>
                    {classItem.className}
                  </option>
                ))}
              </select>
              {errors.classId && (
                <p className="text-red-600">{errors.classId}</p>
              )}
            </div>

            {/* LAT Marks */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                LAT Marks
              </label>
              <input
                type="number"
                name="latMarks"
                min="0"
                max="100"
                value={formData.latMarks}
                onChange={handleInputChange}
                placeholder="Enter LAT Marks (0-100)"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.latMarks && (
                <p className="text-red-600">{errors.latMarks}</p>
              )}
            </div>

            {/* Navigation Buttons */}
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

export default AddStudent;