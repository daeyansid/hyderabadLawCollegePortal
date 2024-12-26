import React, { useState, useEffect } from 'react';
import { getTestsByClassAndStudent } from '../../../api/testManagment';
import { Table } from 'antd';

function StudentTest() {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const studentId = localStorage.getItem('adminSelfId');
    const classId = localStorage.getItem('classId');

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const response = await getTestsByClassAndStudent(classId, studentId);
                if (response && response.data) {
                    console.log(response.data);
                    setTests(response.data);
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch test records');
                setLoading(false);
            }
        };

        if (studentId && classId) {
            fetchTests();
        } else {
            setError('Student ID or Class ID not found');
            setLoading(false);
        }
    }, [studentId, classId]);

    const columns = [
        {
            title: 'Semester',
            dataIndex: ['classId', 'className'],
            key: 'subject',
            render: (text) => (
                <span className="font-semibold text-gray-800">{text}</span>
            ),
        },
        {
            title: 'Subject',
            dataIndex: ['subjectId', 'subjectName'],
            key: 'subject',
            render: (text) => (
                <span className="font-semibold text-gray-800">{text}</span>
            ),
        },
        {
            title: 'Mid Term Paper',
            dataIndex: 'midTermPaperMarks',
            key: 'midTermPaper',
            render: (marks) => (
                <span className="text-indigo-600 font-medium">
                    {marks}/20
                </span>
            ),
        },
        {
            title: 'Assignment & Presentation',
            dataIndex: 'assignmentPresentationMarks',
            key: 'assignment',
            render: (marks) => (
                <span className="text-purple-600 font-medium">
                    {marks}/10
                </span>
            ),
        },
        {
            title: 'Attendance',
            dataIndex: 'attendanceMarks',
            key: 'attendance',
            render: (marks) => (
                <span className="text-green-600 font-medium">
                    {marks}/10
                </span>
            ),
        },
        {
            title: 'Total Marks',
            key: 'total',
            render: (_, record) => (
                <span className={`font-bold ${((record.midTermPaperMarks + record.assignmentPresentationMarks + record.attendanceMarks) >= 20)
                    ? 'text-green-600'
                    : 'text-red-600'
                    }`}>
                    {record.midTermPaperMarks + record.assignmentPresentationMarks + record.attendanceMarks}/40
                </span>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-red-600">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!tests || tests.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <h3 className="mt-2 text-xl font-medium text-gray-900">No Test Records Found</h3>
                        <p className="mt-1 text-gray-500">There are no test records available for your account at this time.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8 background-gradient">
                        Test Performance
                    </h1>

                    <div className="bg-gray-50 rounded-xl shadow-sm overflow-hidden mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold text-indigo-600 mb-2">Mid Term</h3>
                                <p className="text-gray-600">Maximum Marks: <span className="font-bold">20</span></p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold text-purple-600 mb-2">Assignment</h3>
                                <p className="text-gray-600">Maximum Marks: <span className="font-bold">10</span></p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold text-green-600 mb-2">Attendance</h3>
                                <p className="text-gray-600">Maximum Marks: <span className="font-bold">10</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <Table
                            columns={columns}
                            dataSource={tests}
                            rowKey="_id"
                            pagination={false}
                            className="custom-table"
                        />
                    </div>
                </div>

                <style jsx>{`
                    .background-gradient {
                        background: linear-gradient(to right, #4F46E5, #7C3AED);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                    
                    .custom-table .ant-table-thead > tr > th {
                        background: #f0f0f0;
                        color: #000000;
                        font-weight: 600;
                        text-align: center;
                    }

                    .custom-table .ant-table-tbody > tr > td {
                        text-align: center;
                    }

                    .custom-table .ant-table-tbody > tr:hover > td {
                        background: #EEF2FF !important;
                    }
                `}</style>
            </div>
        </div>
    );
}

export default StudentTest;