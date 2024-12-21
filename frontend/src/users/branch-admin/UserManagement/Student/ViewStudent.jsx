import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { fetchStudentById } from "../../../../api/studentApi";
import { baseURL } from "../../../../index";

const ViewStudent = () => {
  const { id } = useParams();
  const [studentData, setStudentData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const response = await fetchStudentById(id);
        console.log(response);
        setStudentData(response);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    loadStudentData();
  }, [id]);

  if (!studentData) {
    return <p>Loading...</p>;
  }

  const imageUrl = studentData.photo
    ? `${baseURL}student/${studentData.photo}`
    : "";

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-indigo-900 mb-8 text-center">
        Student Details
      </h2>

      {/* Student Photo Section */}
      <div className="flex justify-center mb-6">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Student"
            className="w-40 h-40 object-cover rounded-full border-4 border-indigo-600"
          />
        ) : (
          <div className="w-40 h-40 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full">
            No Photo Available
          </div>
        )}
      </div>

      {/* Personal Information */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <p>
            <strong>Full Name:</strong> {studentData.fullName}
          </p>
          <p>
            <strong>Father Name:</strong> {studentData.fatherName}
          </p>
          <p>
            <strong>Cast/Surname:</strong> {studentData.castSurname}
          </p>
          <p>
            <strong>Religion:</strong> {studentData.religion}
          </p>
          <p>
            <strong>Nationality:</strong> {studentData.nationality}
          </p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {moment(studentData.dateOfBirth).format("YYYY-MM-DD")}
          </p>
          <p>
            <strong>Place of Birth:</strong> {studentData.placeOfBirth}
          </p>
          <p>
            <strong>Gender:</strong> {studentData.gender}
          </p>
          <p>
            <strong>CNIC:</strong> {studentData.cnic}
          </p>
          <p>
            <strong>Permanent Address:</strong> {studentData.permanentAddress}
          </p>
          <p>
            <strong>Emergency Contact Person:</strong>{" "}
            {studentData.emergencyContactPerson}
          </p>
          <p>
            <strong>Emergency Phone Number:</strong>{" "}
            {studentData.emergencyPhoneNumber}
          </p>
        </div>
      </div>

      {/* User Information */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          User Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <p>
            <strong>Email:</strong> {studentData.userId.email}
          </p>
        </div>
      </div>

      {/* Registration Information */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Registration Details
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <p>
            <strong>Semester:</strong> {studentData.classId.className}
          </p>
          <p>
            <strong>Batch Year:</strong> {studentData.batchYear}
          </p>
          <p>
            <strong>Roll Number:</strong> {studentData.rollNumber}
          </p>
          <p>
            <strong>LAT Marks:</strong> {studentData.latMarks}
          </p>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={() => navigate("/branch-admin/user-management/student")}
          className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Back to List
        </button>
      </div>
    </div>
  );
};

export default ViewStudent;
