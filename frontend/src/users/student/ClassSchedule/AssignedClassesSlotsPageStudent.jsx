// src/pages/AssignedClassesSlotsPageStudent.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllSlotsForDayStudent } from '../../../api/classSlotAssignmentsStudentApi';
import DataTable from 'react-data-table-component';
import { AiOutlineArrowLeft } from 'react-icons/ai'; // Import an arrow icon from react-icons

const AssignedClassesSlotsPageStudent = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const { branchDayId } = useParams();
    const [slots, setSlots] = useState([]);
    const [filteredSlots, setFilteredSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [error, setError] = useState(null);

    const sectionId = localStorage.getItem('sectionId');
    const classId = localStorage.getItem('classId');

    // Fetch slots
    const fetchSlots = async () => {
        setLoading(true);
        try {
            const data = await getAllSlotsForDayStudent(branchDayId, sectionId);
            console.log("data",data);

            // Ensure data is an array
            if (Array.isArray(data) && data.length > 0) {
                // Sort the data by start time
                const sortedData = data.sort((a, b) => {
                    const timeA = parseTime(a.slot.split(' ')[0]);
                    const timeB = parseTime(b.slot.split(' ')[0]);
                    return timeA - timeB;
                });

                setSlots(sortedData);
                setFilteredSlots(sortedData);
                setError(null);
            } else {
                setError('No slots found for this day.');
                setSlots([]);
                setFilteredSlots([]);
            }
        } catch (error) {
            console.error(error);
            setError(error.message || 'Failed to fetch slots.');
            setSlots([]);
            setFilteredSlots([]);
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
        fetchSlots();
    }, [branchDayId, sectionId]);

    // Handle Search
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);
        const filtered = slots.filter((slot) => {
            const timeSlot = `${slot.slot}`.toLowerCase();
            const className = slot.classId?.name?.toLowerCase() || '';
            const sectionName = slot.sectionId?.name?.toLowerCase() || '';
            const subjectName = slot.subjectId?.name?.toLowerCase() || '';
            const teacherName = slot.teacherId
                ? `${slot.teacherId.firstName} ${slot.teacherId.lastName}`.toLowerCase()
                : '';

            return (
                timeSlot.includes(value) ||
                className.includes(value) ||
                sectionName.includes(value) ||
                subjectName.includes(value) ||
                teacherName.includes(value)
            );
        });
        setFilteredSlots(filtered);
    };

    // Define columns for DataTable
    const columns = [
        {
            name: 'Time Slot',
            selector: (row) => row.slot,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Class',
            selector: (row) => row.classId ? row.classId.className : 'Break',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Section',
            selector: (row) => row.sectionId ? row.sectionId.sectionName : 'N/A',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Subject',
            selector: (row) => row.subjectId ? row.subjectId.subjectName : 'N/A',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Teacher',
            selector: (row) => row.teacherId
                ? `${row.teacherId.fullName}`
                : 'N/A',
            sortable: true,
            wrap: true,
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

            {/* Heading */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold text-indigo-700">
                    Assigned Classes and Slots
                </h1>
            </div>

            {/* Search Input */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by slot, class, section, subject, teacher..."
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

            {/* DataTable for displaying slots */}
            <DataTable
                columns={columns}
                data={filteredSlots}
                pagination
                highlightOnHover
                customStyles={customStyles}
                noDataComponent={!loading && 'No slots found for this day.'}
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
                        <span className="ml-2 text-indigo-600">Loading slots...</span>
                    </div>
                }
            />
        </div>
    );
};

export default AssignedClassesSlotsPageStudent;