import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DataTable from 'react-data-table-component';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import Select from 'react-select';
import {
    checkHoliday,
    checkTeacherAttendance,
    checkAttendanceExists,
    getAttendanceRecords,
    getStudentsList,
    saveAttendanceRecords,
} from '../../../api/classAttendanceSingleApi';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Initialize SweetAlert2 with React Content
const MySwal = withReactContent(Swal);

// Define options for attendance status with custom colors
const attendanceOptions = [
    { value: 'Present', label: 'Present', color: '#16a34a' }, // Green
    { value: 'Absent', label: 'Absent', color: '#dc2626' },   // Red
    { value: 'Leave', label: 'Leave', color: '#f59e0b' },     // Yellow
];

// Custom styles for React Select
const customSelectStyles = {
    option: (provided, state) => ({
        ...provided,
        color: state.isSelected || state.isFocused ? 'white' : 'black',
        backgroundColor: state.isSelected
            ? state.data.color
            : state.isFocused
                ? state.data.color
                : 'white',
        cursor: 'pointer',
    }),
    singleValue: (provided, state) => ({
        ...provided,
        color: 'white',
        backgroundColor: state.selectProps.value
            ? attendanceOptions.find(option => option.value === state.selectProps.value.value)?.color
            : 'transparent',
        padding: '2px 6px',
        borderRadius: '4px',
    }),
    control: (provided, state) => ({
        ...provided,
        borderColor: '#cbd5e0',
        boxShadow: 'none',
        '&:hover': {
            borderColor: '#a0aec0',
        },
        backgroundColor: state.selectProps.value
            ? attendanceOptions.find(option => option.value === state.selectProps.value.value)?.color
            : 'white',
    }),
    placeholder: (provided) => ({
        ...provided,
        color: '#a0aec0',
    }),
    indicatorsContainer: (provided) => ({
        ...provided,
        color: 'white',
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: 'white',
        '&:hover': {
            color: 'white',
        },
    }),
    clearIndicator: (provided) => ({
        ...provided,
        color: 'white',
        '&:hover': {
            color: 'white',
        },
    }),
};

const TakeViewAttendance = () => {
    const { branchDayId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const teacherId = localStorage.getItem('adminSelfId');
    const { classId, sectionId } = location.state || {};

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isHoliday, setIsHoliday] = useState(false);
    const [holidayInfo, setHolidayInfo] = useState(null);
    const [teacherPresent, setTeacherPresent] = useState(true);
    const [attendanceExists, setAttendanceExists] = useState(false);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [studentsList, setStudentsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [attendanceData, setAttendanceData] = useState([]);
    const [actionType, setActionType] = useState(''); // 'enter' or 'update'

    // Variable to check if attendance status is available
    const hasAttendanceStatus =
        attendanceData.length > 0 &&
        attendanceData.some((item) => item.attendanceStatus !== '');

    // Validate required IDs and show an error if missing
    useEffect(() => {
        if (!classId || !sectionId || !teacherId) {
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Required class, section, subject, or teacher information is missing.',
                customClass: {
                    confirmButton: 'bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-md',
                },
                buttonsStyling: false,
            });
        }
    }, [classId, sectionId,  teacherId]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const formattedDate = selectedDate.toISOString().split('T')[0];

            // Check for holiday
            const holidayResponse = await checkHoliday(formattedDate);
            if (holidayResponse.data.isHoliday) {
                setIsHoliday(true);
                setHolidayInfo(holidayResponse.data.holiday);
                MySwal.fire({
                    icon: 'info',
                    title: 'Holiday',
                    text: `The selected date is a holiday: ${holidayResponse.data.holiday.leaveTitle}. Attendance will not be counted for this day.`,
                    customClass: {
                        confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md',
                    },
                    buttonsStyling: false,
                });
                setLoading(false);
                return;
            } else {
                setIsHoliday(false);
                setHolidayInfo(null);
            }

            // Check teacher attendance
            const teacherAttendanceResponse = await checkTeacherAttendance();
            if (!teacherAttendanceResponse.data.teacherPresent) {
                setTeacherPresent(false);
                MySwal.fire({
                    icon: 'warning',
                    title: 'Teacher Absent',
                    text: 'The teacher is not present on the selected date.',
                    customClass: {
                        confirmButton: 'bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md',
                    },
                    buttonsStyling: false,
                });
                setLoading(false);
                return;
            } else {
                setTeacherPresent(true);
            }

            // Check if attendance exists
            const attendanceExistsResponse = await checkAttendanceExists(
                formattedDate,
                classId,
                sectionId,
                teacherId
            );
            setAttendanceExists(attendanceExistsResponse.data.attendanceExists);

            if (attendanceExistsResponse.data.attendanceExists) {
                // Fetch attendance records
                const attendanceRecordsResponse = await getAttendanceRecords(
                    formattedDate,
                    classId,
                    sectionId,
                    teacherId
                );
                setAttendanceRecords(attendanceRecordsResponse.data.attendanceRecords);

                // Initialize attendanceData from attendanceRecords
                const initialAttendanceData = attendanceRecordsResponse.data.attendanceRecords.map(
                    (record, index) => ({
                        sNo: index + 1,
                        studentId: record.studentId._id,
                        fullName: record.studentId.fullName,
                        studentRollNumber: record.studentId.rollNumber,
                        attendanceStatus: record.attendanceStatus,
                    })
                );

                setAttendanceData(initialAttendanceData);
                setActionType('update');
                MySwal.fire({
                    icon: 'info',
                    title: 'Attendance Exists',
                    text: 'Attendance has already been taken for this date. You can update it below.',
                    customClass: {
                        confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md',
                    },
                    buttonsStyling: false,
                });
            } else {
                // Fetch students list
                const studentsListResponse = await getStudentsList(classId, sectionId);
                setStudentsList(studentsListResponse.data.students);
                // Initialize attendanceData
                const initialAttendanceData = studentsListResponse.data.students.map(
                    (student, index) => ({
                        sNo: index + 1,
                        studentId: student._id,
                        fullName: student.fullName,
                        studentRollNumber: student.rollNumber,
                        attendanceStatus: '', // Default to empty string
                    })
                );

                setAttendanceData(initialAttendanceData);
                setActionType('enter');
            }
        } catch (err) {
            console.error(err);
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while processing your request.',
                customClass: {
                    confirmButton: 'bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md',
                },
                buttonsStyling: false,
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle attendance status change using React Select
    const handleAttendanceStatusChange = (studentId, selectedOption) => {
        setAttendanceData((prevData) =>
            prevData.map((item) =>
                item.studentId === studentId
                    ? { ...item, attendanceStatus: selectedOption ? selectedOption.value : '' }
                    : item
            )
        );
    };

    // Save attendance records with confirmation
    const handleSaveAttendance = async () => {
        // Validate that all attendance statuses are filled
        const allFilled = attendanceData.every(
            (item) => item.attendanceStatus !== ''
        );
        if (!allFilled) {
            MySwal.fire({
                icon: 'warning',
                title: 'Incomplete Data',
                text: 'Please select attendance status for all students before saving.',
                customClass: {
                    confirmButton: 'bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-md',
                },
                buttonsStyling: false,
            });
            return;
        }

        // Show confirmation prompt
        const result = await MySwal.fire({
            title: actionType === 'update' ? 'Update Attendance' : 'Save Attendance',
            text:
                actionType === 'update'
                    ? 'Are you sure you want to update the attendance records?'
                    : 'Are you sure you want to save the attendance records?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            customClass: {
                confirmButton: actionType === 'update'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md'
                    : 'bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md',
                cancelButton: 'bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-md',
            },
            buttonsStyling: false,
        });

        if (result.isConfirmed) {
            setLoading(true);
            try {
                const formattedDate = selectedDate.toISOString().split('T')[0];

                await saveAttendanceRecords(
                    formattedDate,
                    classId,
                    sectionId,
                    teacherId,
                    attendanceData
                );

                MySwal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Attendance records saved successfully.',
                    customClass: {
                        confirmButton: 'bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md',
                    },
                    buttonsStyling: false,
                });

                navigate(`/teacher/assigned-classes-attendance-single/slots/${branchDayId}`);

            } catch (err) {
                console.error(err);
                MySwal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred while saving attendance.',
                    customClass: {
                        confirmButton: 'bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md',
                    },
                    buttonsStyling: false,
                });
            } finally {
                setLoading(false);
            }
        }
    };

    // Define columns with React Select for Attendance Status
    const columns = [
        {
            name: 'S.No',
            selector: (row) => row.sNo,
            sortable: true,
            width: '80px',
            center: true,
        },
        {
            name: 'Student Name',
            selector: (row) => row.fullName,
            sortable: true,
            cell: (row) => (
                <div className="font-medium text-gray-900">{row.fullName}</div>
            ),
        },
        {
            name: 'Student Roll Number',
            selector: (row) => row.studentRollNumber,
            sortable: true,
            cell: (row) => (
                <div className="text-gray-700">{row.studentRollNumber}</div>
            ),
        },
        {
            name: 'Attendance Status',
            cell: (row) => {
                const selectedOption = attendanceOptions.find(
                    (option) => option.value === row.attendanceStatus
                );

                return (
                    <Select
                        value={selectedOption || null}
                        onChange={(option) =>
                            handleAttendanceStatusChange(row.studentId, option)
                        }
                        options={attendanceOptions}
                        styles={customSelectStyles}
                        placeholder="Select"
                        isClearable
                        className="w-full sm:w-auto"
                    />
                );
            },
            sortable: true,
            width: '220px',
        },
    ];

    // Custom styles for DataTable
    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#f0f4f8',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#333',
            },
        },
        cells: {
            style: {
                fontSize: '14px',
                color: '#555',
            },
        },
        pagination: {
            style: {
                borderTop: '1px solid #e0e0e0',
            },
        },
    };

    const data = attendanceData;

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            {/* Back button */}
            <div className="flex items-center mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-indigo-700 hover:text-indigo-900 font-semibold"
                >
                    <AiOutlineArrowLeft className="mr-2" /> Back
                </button>
            </div>

            {/* Page Title */}
            <h2 className="text-2xl font-semibold mb-6 text-indigo-700">
                {actionType === 'update' ? 'Update Attendance' : 'Take Attendance'}
            </h2>

            {/* Date Picker and Submit Button */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <label className="mr-2 font-semibold">Select Date:</label>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy-MM-dd"
                    className="w-full sm:w-auto p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    onClick={handleSubmit}
                    className="mt-4 sm:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none transition-colors duration-200"
                >
                    Submit
                </button>
            </div>

            {/* Attendance Summary */}
            {!loading && (
                <div className="mb-6 flex flex-wrap gap-4">
                    <div className="flex-1 p-4 bg-gray-100 rounded-md">
                        <p className="font-semibold">Total Number of Students</p>
                        <p className="text-xl">
                            {attendanceData.length > 0 ? attendanceData.length : 'N/A'}
                        </p>
                    </div>
                    <div className="flex-1 p-4 bg-green-500 rounded-md">
                        <p className="font-semibold text-white">Present</p>
                        <p className="text-xl text-white">
                            {hasAttendanceStatus
                                ? attendanceData.filter((item) => item.attendanceStatus === 'Present').length
                                : 'N/A'}
                        </p>
                    </div>
                    <div className="flex-1 p-4 bg-red-500 rounded-md">
                        <p className="font-semibold text-white">Absent</p>
                        <p className="text-xl text-white">
                            {hasAttendanceStatus
                                ? attendanceData.filter((item) => item.attendanceStatus === 'Absent').length
                                : 'N/A'}
                        </p>
                    </div>
                    <div className="flex-1 p-4 bg-yellow-500 rounded-md">
                        <p className="font-semibold text-white">Leave</p>
                        <p className="text-xl text-white">
                            {hasAttendanceStatus
                                ? attendanceData.filter((item) => item.attendanceStatus === 'Leave').length
                                : 'N/A'}
                        </p>
                    </div>
                </div>
            )}

            {/* Conditional Messages in Body */}
            <div className="mb-6">
                {/* Holiday Message */}
                {isHoliday && holidayInfo && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                        <p className="font-bold">Holiday</p>
                        <p>The selected date is a holiday: <strong>{holidayInfo.leaveTitle}</strong>. Attendance will not be counted for this day.</p>
                    </div>
                )}

                {/* Teacher Absent Message */}
                {!teacherPresent && !isHoliday && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                        <p className="font-bold">Teacher Absent</p>
                        <p>The teacher is not present on the selected date.</p>
                    </div>
                )}

                {/* Attendance Exists Message */}
                {attendanceExists && !isHoliday && teacherPresent && (
                    <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
                        <p className="font-bold">Attendance Exists</p>
                        <p>Attendance has already been taken for this date. You can update it below.</p>
                    </div>
                )}
            </div>

            {/* DataTable */}
            {!isHoliday && teacherPresent && !loading && data.length > 0 && (
                <>
                    <DataTable
                        columns={columns}
                        data={data}
                        pagination
                        highlightOnHover
                        theme="solarized"
                        customStyles={customStyles}
                        responsive
                        pointerOnHover
                        striped
                        noHeader
                    />
                    {(actionType === 'enter' || actionType === 'update') && (
                        <button
                            onClick={handleSaveAttendance}
                            className={`mt-6 px-6 py-3 text-white rounded-md shadow-md hover:bg-opacity-90 focus:outline-none transition-colors duration-200 ${
                                actionType === 'update'
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {actionType === 'update' ? 'Update Attendance' : 'Save Attendance'}
                        </button>
                    )}
                </>
            )}

            {/* Loading Indicator */}
            {loading && (
                <div className="flex justify-center items-center h-64">
                    <svg
                        className="animate-spin h-10 w-10 text-indigo-600"
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
                    <span className="ml-2 text-indigo-600">Processing...</span>
                </div>
            )}
        </div>
    );
};

export default TakeViewAttendance;
