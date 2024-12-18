import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate
import { getAssignmentsSingleByTeacherAndDay } from '../../../api/classSlotAssignmentsSingleApi';
import DataTable from 'react-data-table-component';
import { AiOutlineArrowLeft } from 'react-icons/ai'; // Import an arrow icon from react-icons

const AssignedClassesSlotsPage = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const { branchDayId } = useParams();
    const [assignments, setAssignments] = useState([]);
    const [filteredAssignments, setFilteredAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [error, setError] = useState(null);
    const [dayName, setDayName] = useState('');

    // Fetch assignments
    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const teacherId = localStorage.getItem('adminSelfId');
            if (!teacherId) {
                setError('Teacher ID not found. Please log in again.');
                setLoading(false);
                return;
            }

            const data = await getAssignmentsSingleByTeacherAndDay(branchDayId, teacherId);

            console.log("Data received from API:", data); // Debugging log

            // Ensure data is an array
            if (Array.isArray(data) && data.length > 0) {
                setDayName(data[0].branchClassDaysId.day);

                // Sort the data by start time
                const sortedData = data.sort((a, b) => {
                    const timeA = parseTime(a.branchDailyTimeSlotsId.slot.split(' ')[0]);
                    const timeB = parseTime(b.branchDailyTimeSlotsId.slot.split(' ')[0]);
                    return timeA - timeB;
                });

                setAssignments(sortedData);
                setFilteredAssignments(sortedData);
                console.log("Sorted and filtered assignments:", sortedData); // Debugging log
                setError(null);
            } else {
                setError('No assignments found for this day.');
                setDayName('');
            }
        } catch (error) {
            console.error(error);
            setError(error.message || 'Failed to fetch assignments.');
            setDayName('');
        } finally {
            setLoading(false);
        }
    };

    // Utility function to parse time strings (e.g., "2:00 AM")
    const parseTime = (timeStr) => {
        if (!timeStr || typeof timeStr !== 'string') return 0;
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (modifier === 'PM' && hours !== 12) {
            hours += 12;
        }
        if (modifier === 'AM' && hours === 12) {
            hours = 0;
        }

        return hours * 60 + minutes;
    };

    useEffect(() => {
        fetchAssignments();
    }, [branchDayId]);

    // Handle Search
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);
        const filtered = assignments.filter((assignment) => {
            const slot = `${assignment.branchDailyTimeSlotsId.slot}`.toLowerCase();
            const slotType = assignment.slotType?.toLowerCase() || '';
            const className = assignment.classId?.className?.toLowerCase() || '';
            const sectionName = assignment.sectionId?.sectionName?.toLowerCase() || '';
            const subjectName = assignment.subjectId?.subjectName?.toLowerCase() || '';
            const teacherName = assignment.teacherId?.fullName?.toLowerCase() || '';
            const classType = assignment.classType?.toLowerCase() || '';

            return (
                slot.includes(value) ||
                slotType.includes(value) ||
                className.includes(value) ||
                sectionName.includes(value) ||
                subjectName.includes(value) ||
                teacherName.includes(value) ||
                classType.includes(value)
            );
        });
        setFilteredAssignments(filtered);
    };

    // Define columns for DataTable
    const columns = [
        {
            name: 'Time Slot',
            selector: (row) => row.branchDailyTimeSlotsId.slot,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Class',
            selector: (row) => row.classId?.className || 'N/A',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Section',
            selector: (row) => row.sectionId?.sectionName || 'N/A',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Subject',
            selector: (row) => row.subjectId?.subjectName || 'N/A',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Class Type',
            selector: (row) => row.classType || 'N/A',
            sortable: true,
            wrap: true,
            cell: (row) => (
                <span
                    className={`px-2 py-1 rounded-full ${
                        row.classType === 'Main Class' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                    }`}
                >
                    {row.classType}
                </span>
            ),
        },
        {
            name: 'Slot Type',
            selector: (row) => row.slotType || 'N/A',
            sortable: true,
            wrap: true,
            cell: (row) => (
                <span
                    className={`px-2 py-1 rounded-full ${
                        row.slotType === 'Class Slot' ? 'bg-purple-500 text-white' : 'bg-gray-500 text-white'
                    }`}
                >
                    {row.slotType}
                </span>
            ),
        },
    ];

    // Custom styles for DataTable
    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#f3f4f6',
                color: '#374151',
                fontSize: '14px',
                fontWeight: '600',
                paddingLeft: '16px',
                paddingRight: '16px',
            },
        },
        rows: {
            style: {
                fontSize: '14px',
                '&:nth-of-type(even)': {
                    backgroundColor: '#f9fafb',
                },
            },
        },
        pagination: {
            style: {
                border: 'none',
            },
        },
        cells: {
            style: {
                paddingLeft: '16px',
                paddingRight: '16px',
            },
        },
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            {/* Back button with arrow */}
            <div className="flex items-center mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-indigo-700 hover:text-indigo-900 font-semibold"
                >
                    <AiOutlineArrowLeft className="mr-2" /> Back
                </button>
            </div>

            {/* Day and Assigned Classes Heading */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-indigo-700">
                    {dayName ? `${dayName}'s Assigned Classes` : 'No Day Information'}
                </h2>
            </div>

            {/* Search Input */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by slot, class, section, subject, etc..."
                    value={searchText}
                    onChange={handleSearch}
                    className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* Error Handling */}
            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                    <p>{error}</p>
                </div>
            )}

            {/* DataTable for displaying assignments */}
            <DataTable
                columns={columns}
                data={filteredAssignments}
                pagination
                highlightOnHover
                customStyles={customStyles}
                noDataComponent={!loading && 'No assignments found for this day.'}
                progressPending={loading}
                progressComponent={
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
                        <span className="ml-2 text-indigo-600">Loading assignments...</span>
                    </div>
                }
            />
        </div>
    );
};

export default AssignedClassesSlotsPage;