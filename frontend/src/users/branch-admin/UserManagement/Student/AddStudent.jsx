import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  createStudent,
  fetchGuardianByCnic,
  fetchClasses,
  fetchSectionsByClassAndBranch,
  fetchStudentsByBatchYear,
} from "../../../../api/studentApi";

import { getBranchById } from "../../../../api/branchApi";

const AddStudent = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    password: "",
    email: "",
    fullName: "",
    admissionClass: "",
    castSurname: "",
    religion: "",
    nationality: "",
    dateOfBirth: "",
    placeOfBirth: "",
    gender: "Male", // Default value
    permanentAddress: "",
    emergencyContactPerson: "",
    emergencyPhoneNumber: "",
    guardianId: "",
    monthlyFees: "",
    admissionFees: "",
    branchId: localStorage.getItem("branchId") || "",
    classId: "",
    sectionId: "",
    batchYear: "",
    rollNumber: "",
    photo: null,
  });
  const [errors, setErrors] = useState({});
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
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
        console.error("Error fetching classes:", error);
      }
    };

    loadClasses();
  }, [formData.branchId]);

  const handleClassChange = async (e) => {
    const selectedClassId = e.target.value;
    setFormData({ ...formData, classId: selectedClassId });

    try {
      const sectionData = await fetchSectionsByClassAndBranch(
        selectedClassId,
        formData.branchId
      );
      setSections(sectionData.data);
      console.log(sectionData.data);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  const handleBatchYearChange = async (e) => {
    const batchYear = e.target.value;
    setFormData({ ...formData, batchYear });

    if (batchYear) {
      try {
        const studentsInBatch = await fetchStudentsByBatchYear(batchYear);
        const rollNumber = `${batchYear}/${studentsInBatch.length + 1}`;
        setFormData((prev) => ({ ...prev, rollNumber }));
      } catch (error) {
        console.error("Error calculating roll number:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      setGuardianCnic(formattedCnic);
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.fullName) newErrors.fullName = "Full Name is required.";
      if (!formData.admissionClass)
        newErrors.admissionClass = "Admission class is required.";
      if (!formData.castSurname)
        newErrors.castSurname = "Cast/Surname is required.";
      if (!formData.religion) newErrors.religion = "Religion is required.";
      if (!formData.nationality)
        newErrors.nationality = "Nationality is required.";
      if (!formData.dateOfBirth)
        newErrors.dateOfBirth = "Date of Birth is required.";
      if (!formData.placeOfBirth)
        newErrors.placeOfBirth = "Place of Birth is required.";
      if (!formData.gender) newErrors.gender = "Gender is required.";
      if (!formData.permanentAddress)
        newErrors.permanentAddress = "Permanent Address is required.";
      if (!formData.emergencyContactPerson)
        newErrors.emergencyContactPerson =
          "Emergency Contact Person is required.";
      if (!formData.emergencyPhoneNumber)
        newErrors.emergencyPhoneNumber = "Emergency Phone Number is required.";
      if (!formData.batchYear) newErrors.batchYear = "Batch Year is required.";
      //   if (!formData.rollNumber)
      //     newErrors.rollNumber = "Roll Number is required.";
    } else if (currentStep === 2) {
      if (!formData.password) newErrors.password = "Password is required.";
      if (!formData.email) newErrors.email = "Email is required.";
    } else if (currentStep === 3) {
      if (!formData.monthlyFees)
        newErrors.monthlyFees = "Monthly Fees is required.";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateStep(step)) {
      const data = new FormData();

      // Stringify the array fields
      Object.keys(formData).forEach((key) => {
        if (key === "studentOldAcademicInfo") {
          data.append(key, JSON.stringify(formData[key]));
        } else if (key === "photo" && formData[key]) {
          // Append photo only if it exists
          data.append(key, formData[key]);
        } else {
          // Append other fields
          data.append(key, formData[key]);
        }
      });

      try {
        // Make the API call to create the student
        await createStudent(data);
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
      <div className="flex justify-between items-center mb-6">
        {stepIndicators.map((indicator, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-white ${step >= indicator.step ? "bg-indigo-600" : "bg-gray-300"
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

      <h2 className="text-2xl font-semibold text-indigo-900 mb-6">
        {stepIndicators.find((si) => si.step === step)?.label}
      </h2>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.fullName && (
                <p className="text-red-600">{errors.fullName}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Admission sought to class
              </label>
              <input
                type="text"
                name="admissionClass"
                value={formData.admissionClass}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.admissionClass && (
                <p className="text-red-600">{errors.admissionClass}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Cast / Surname
              </label>
              <input
                type="text"
                name="castSurname"
                value={formData.castSurname}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.castSurname && (
                <p className="text-red-600">{errors.castSurname}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Religion
              </label>
              <input
                type="text"
                name="religion"
                value={formData.religion}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.religion && (
                <p className="text-red-600">{errors.religion}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Nationality
              </label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.nationality && (
                <p className="text-red-600">{errors.nationality}</p>
              )}
            </div>
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
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Place of Birth
              </label>
              <input
                type="text"
                name="placeOfBirth"
                value={formData.placeOfBirth}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.placeOfBirth && (
                <p className="text-red-600">{errors.placeOfBirth}</p>
              )}
            </div>
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
              </select>
              {errors.gender && <p className="text-red-600">{errors.gender}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Permanent Address
              </label>
              <input
                type="text"
                name="permanentAddress"
                value={formData.permanentAddress}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.permanentAddress && (
                <p className="text-red-600">{errors.permanentAddress}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Emergency Contact Person
              </label>
              <input
                type="text"
                name="emergencyContactPerson"
                value={formData.emergencyContactPerson}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.emergencyContactPerson && (
                <p className="text-red-600">{errors.emergencyContactPerson}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Emergency Phone No
              </label>
              <input
                type="text"
                name="emergencyPhoneNumber"
                value={formData.emergencyPhoneNumber}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.emergencyPhoneNumber && (
                <p className="text-red-600">{errors.emergencyPhoneNumber}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Batch Year
              </label>
              <select
                name="batchYear"
                value={formData.batchYear}
                onChange={(event) => {
                  setFormData((prev) => ({
                    ...prev,
                    [event.target.name]: event.target.value,
                  }));
                }}
                // onChange={handleBatchYearChange}
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
            {/* <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Roll Number
              </label>
              <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                readOnly
              />
              {errors.rollNumber && (
                <p className="text-red-600">{errors.rollNumber}</p>
              )}
            </div> */}
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

        {step === 2 && (
          <>
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
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.password && (
                <p className="text-red-600">{errors.password}</p>
              )}
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

        {step === 3 && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Monthly Fees
              </label>
              <input
                type="number"
                name="monthlyFees"
                value={formData.monthlyFees}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {errors.monthlyFees && (
                <p className="text-red-600">{errors.monthlyFees}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Admission Fees (Optional)
              </label>
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
              {errors.classId && (
                <p className="text-red-600">{errors.classId}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold">
                Section
              </label>
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
              {errors.sectionId && (
                <p className="text-red-600">{errors.sectionId}</p>
              )}
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

export default AddStudent;
