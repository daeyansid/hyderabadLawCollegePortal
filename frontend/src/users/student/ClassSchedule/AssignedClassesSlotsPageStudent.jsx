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

    const classId = localStorage.getItem('classId');

    // Fetch slots
    const fetchSlots = async () => {
        setLoading(true);
        try {
            const data = await getAllSlotsForDayStudent(branchDayId, classId);
            // console.log("data",data);

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
    }, [branchDayId, classId]);

    // Handle Search
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);
        const filtered = slots.filter((slot) => {
            const timeSlot = `${slot.slot}`.toLowerCase();
            const className = slot.classId?.name?.toLowerCase() || '';
            const subjectName = slot.subjectId?.name?.toLowerCase() || '';
            const teacherName = slot.teacherId
                ? `${slot.teacherId.firstName} ${slot.teacherId.lastName}`.toLowerCase()
                : '';

            return (
                timeSlot.includes(value) ||
                className.includes(value) ||
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
            name: 'Semester',
            selector: (row) => row.classId ? row.classId.className : 'Break',
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

    // Updated custom styles for DataTable
    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                paddingLeft: '16px',
                paddingRight: '16px',
                transition: 'all 0.2s ease',
            },
        },
        rows: {
            style: {
                fontSize: '14px',
                '&:nth-of-type(even)': {
                    backgroundColor: '#eef2ff',
                },
                '&:hover': {
                    backgroundColor: '#e0e7ff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
                {/* Back button with arrow */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-200"
                    >
                        <AiOutlineArrowLeft className="mr-2" /> Back
                    </button>
                </div>

                {/* Heading */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                        Assigned Classes and Slots
                    </h1>
                </div>

                {/* Search Input */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search by slot, class, subject, teacher..."
                        value={searchText}
                        onChange={handleSearch}
                        className="p-3 border border-indigo-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-indigo-50/30"
                    />
                </div>

                {/* Error Handling */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg animate-fade-in">
                        <p>{error}</p>
                    </div>
                )}

                {/* DataTable */}
                <div className="rounded-lg overflow-hidden border border-indigo-100">
                    <DataTable
                        columns={columns}
                        data={filteredSlots}
                        pagination
                        highlightOnHover
                        customStyles={customStyles}
                        noDataComponent={
                            !loading && (
                                <div className="p-6 text-indigo-600">
                                    No slots found for this day.
                                </div>
                            )
                        }
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
                                <span className="ml-2 text-indigo-600 font-semibold">Loading slots...</span>
                            </div>
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default AssignedClassesSlotsPageStudent;