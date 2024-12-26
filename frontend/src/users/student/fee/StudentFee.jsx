import React, { useState, useEffect } from 'react';
import { getFeeDetailsByStudentId } from '../../../api/feeDetails';

function StudentFee() {
  const [feeDetails, setFeeDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const studentId = localStorage.getItem('adminSelfId');

  useEffect(() => {
    const fetchFeeDetails = async () => {
      try {
        const response = await getFeeDetailsByStudentId(studentId);
        console.log(response.data);
        if (response && response.data) {
          // Ensure feeDetails is always an array
          setFeeDetails(Array.isArray(response.data.data) ? response.data.data : [response.data.data]);
        } else {
          setFeeDetails([]);
        }
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setFeeDetails([]);
        } else {
          setError('An error occurred while fetching fee details');
        }
        setLoading(false);
      }
    };

    if (studentId) {
      fetchFeeDetails();
    } else {
      setError('Student ID not found');
      setLoading(false);
    }
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  if (!feeDetails || feeDetails.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-xl font-medium text-gray-900">No Fee Details Found</h3>
            <p className="mt-1 text-gray-500">There are no fee details available for your account at this time.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-700 mb-8">Fee Details</h1>

        {Array.isArray(feeDetails) && feeDetails.map((detail, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="border-b pb-4 mb-4">
              <h2 className="text-xl font-semibold text-indigo-600">
                {detail.classId?.className || 'Current'} Semester
              </h2>
            </div>

            {/* Fee Meta Information */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">Admission Fee Details</h3>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-gray-600">Total Admission Fee:
                    <span className="font-semibold text-indigo-700 ml-2">
                      PKR {detail.totalAdmissionFee?.admissionFee || "N/A"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {detail.admissionConfirmationFee ? 'Paid' : 'Pending'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">Semester Fee Details</h3>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-gray-600">Total Semester Fee:
                    <span className="font-semibold text-indigo-700 ml-2">
                      PKR {detail.semesterFeesTotal?.semesterFee || 0}
                    </span>
                  </p>
                  <p className="text-gray-600">Paid Amount:
                    <span className="font-semibold text-green-600 ml-2">
                      PKR {detail.semesterFeesPaid || 0}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Charges */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Additional Charges</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Late Fee:
                    <span className="font-semibold text-orange-400 ml-2">
                      PKR {detail.lateFeeSurcharged || 0}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Other Penalties:
                    <span className="font-semibold text-orange-400 ml-2">
                      PKR {detail.otherPenalties || 0}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Discount and Total */}
            <div className="bg-indigo-100 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600">Discount Applied:
                    <span className="font-semibold text-green-600 ml-2">
                      PKR {detail.discount || 0}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-lg font-bold text-red-600">
                    Remaining Fee: PKR
                    {(detail.semesterFeesTotal?.semesterFee || 0) -
                      (detail.semesterFeesPaid || 0) -
                      (detail.discount || 0) +
                      (detail.lateFeeSurcharged || 0) +
                      (detail.otherPenalties || 0)}
                  </p>
                </div>
              </div>
            </div>

            {/* Challan Image */}
            {detail.challanPicture && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-700 mb-2">Payment Challan</h3>
                <img
                  src={detail.challanPicture}
                  alt="Payment Challan"
                  className="max-w-full h-auto rounded-lg shadow"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentFee;