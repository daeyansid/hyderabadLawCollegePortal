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

      {/* Section 1: Personal Information */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <p>
            <strong>Full Name:</strong> {studentData.fullName}
          </p>
          <p>
            <strong>Admission Class:</strong> {studentData.admissionClass}
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

      {/* Section 2: Guardian Information */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Guardian Information
        </h3>
        {studentData.guardianId ? (
          <div className="grid grid-cols-2 gap-4">
            <p>
              <strong>Full Name:</strong> {studentData.guardianId.fullName}
            </p>
            <p>
              <strong>Relationship:</strong>{" "}
              {studentData.guardianId.relationship}
            </p>
            <p>
              <strong>Work Organization:</strong>{" "}
              {studentData.guardianId.workOrganisation}
            </p>
            <p>
              <strong>Occupation:</strong> {studentData.guardianId.workStatus}
            </p>
            <p>
              <strong>CNIC Number:</strong> {studentData.guardianId.cnicNumber}
            </p>
            <p>
              <strong>Mother's Name:</strong>{" "}
              {studentData.guardianId.studentMotherName}
            </p>
            <p>
              <strong>Mother's CNIC:</strong>{" "}
              {studentData.guardianId.motherCnicNumber}
            </p>
            <p>
              <strong>Mother's Occupation:</strong>{" "}
              {studentData.guardianId.motherOccupation}
            </p>
            <p>
              <strong>Guardian Phone Number:</strong>{" "}
              {studentData.guardianId.guardianPhoneNumber}
            </p>
            <p>
              <strong>Residential Address:</strong>{" "}
              {studentData.guardianId.residentialAddress}
            </p>
            <p>
              <strong>Work Address:</strong>{" "}
              {studentData.guardianId.workAddress}
            </p>
          </div>
        ) : (
          <p className="text-gray-600">No Guardian information available.</p>
        )}
      </div>

      {/* Section 3: Previous Schooling Details */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Previous Schooling Details
        </h3>
        {studentData.studentOldAcademicInfoId &&
        studentData.studentOldAcademicInfoId.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Institute Name</th>
                <th className="py-2 px-4 border-b text-left">Location</th>
                <th className="py-2 px-4 border-b text-left">From</th>
                <th className="py-2 px-4 border-b text-left">To</th>
                <th className="py-2 px-4 border-b text-left">Up to Class</th>
              </tr>
            </thead>
            <tbody>
              {studentData.studentOldAcademicInfoId.map((info, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{info.instituteName}</td>
                  <td className="py-2 px-4 border-b">{info.location}</td>
                  <td className="py-2 px-4 border-b">
                    {info.from
                      ? moment(info.from).format("YYYY-MM-DD")
                      : "Not Set"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {info.to ? moment(info.to).format("YYYY-MM-DD") : "Not Set"}
                  </td>

                  <td className="py-2 px-4 border-b">{info.upToClass}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">
            No previous schooling details available.
          </p>
        )}
      </div>

      {/* Section 4: Submitted Documents */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Submitted Documents
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <p>
            <strong>Photocopies of CNIC Cards:</strong>{" "}
            {studentData.photocopiesCnic ? "Yes" : "No"}
          </p>
          <p>
            <strong>Photocopies of Birth Certificate:</strong>{" "}
            {studentData.birthCertificate ? "Yes" : "No"}
          </p>
          <p>
            <strong>Original Leaving/Transfer Certificate:</strong>{" "}
            {studentData.leavingCertificate ? "Yes" : "No"}
          </p>
          <p>
            <strong>Photocopies of School Report:</strong>{" "}
            {studentData.schoolReport ? "Yes" : "No"}
          </p>
          <p>
            <strong>Two Passport Size Photographs:</strong>{" "}
            {studentData.passportPhotos ? "Yes" : "No"}
          </p>
        </div>
      </div>

      {/* Section 5: Student User Information */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Student User Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <p>
            <strong>Username:</strong> {studentData.userId.username}
          </p>
          <p>
            <strong>Email:</strong> {studentData.userId.email}
          </p>
        </div>
      </div>

      {/* Section 6: Registration and Fees */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Registration and Fees
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <p>
            <strong>Monthly Fees:</strong> {studentData.monthlyFees}
          </p>
          <p>
            <strong>Admission Fees:</strong> {studentData.admissionFees}
          </p>
          <p>
            <strong>Class:</strong> {studentData.classId.className}
          </p>
          <p>
            <strong>Section:</strong> {studentData.sectionId.sectionName}
          </p>
          <p>
            <strong>Batch Year:</strong> {studentData.batchYear}
          </p>
          <p>
            <strong>Roll Number:</strong> {studentData.rollNumber}
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
