import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useParams } from 'react-router-dom';
import { getAllSlotsForDay, deleteClassSlotAssignment } from '../../api/classSlotAssignmentsApi';
import Swal from 'sweetalert2';
import { AiOutlineReload, AiOutlinePlus, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import AddClassSlotAssignmentModal from './scheduleAndAssign/AddClassSlotAssignmentModal';
import EditClassSlotAssignmentModal from './scheduleAndAssign/EditClassSlotAssignmentModal';

const ClassSlotAssignmentsList = () => {
    const { branchClassDaysIdParam } = useParams();
    const { sectionIdParam } = useParams();
    const [assignments, setAssignments] = useState([]);
    const [filteredAssignments, setFilteredAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [dataFetched, setDataFetched] = useState(false);

    // Fetch all Slots (Class Slot Assignments and Break Slots)
    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const data = await getAllSlotsForDay(branchClassDaysIdParam, sectionIdParam);

            // Sort the data in ascending order based on slot times
            const parseSlotTime = (slotStr) => {
                if (!slotStr) return 0;
                const [startTimeStr] = slotStr.split(' to ');
                const [time, period] = startTimeStr.trim().split(' ');
                let [hours, minutes] = time.split(':').map(Number);
                if (period === 'PM' && hours !== 12) {
                    hours += 12;
                }
                if (period === 'AM' && hours === 12) {
                    hours = 0;
                }
                return hours * 60 + minutes;
            };

            const sortedData = data.sort((a, b) => {
                return parseSlotTime(a.slot) - parseSlotTime(b.slot);
            });

            setAssignments(sortedData);
            setFilteredAssignments(sortedData);
            setError(null);
            setDataFetched(true); // Set data fetched to true after fetching
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to fetch Slots.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, [branchClassDaysIdParam]);

    // Handle Search
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);
        const filtered = assignments.filter((assignment) => {
            const slot = assignment.slot?.toLowerCase() || '';
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

    // Handle Delete
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this assignment?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteClassSlotAssignment(id);
                    Swal.fire('Deleted!', 'The assignment has been deleted.', 'success');
                    fetchAssignments();
                } catch (error) {
                    Swal.fire('Error', error.message || 'Failed to delete the assignment.', 'error');
                }
            }
        });
    };

    // Handle Edit
    const handleEdit = (assignment) => {
        setSelectedAssignment(assignment);
        setShowEditModal(true);
    };

    // Define columns for DataTable
    const columns = [
        {
            name: 'Slot',
            selector: (row) => row.slot || 'N/A',
            sortable: true,
            wrap: true,
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
        {
            name: 'Class / Section',
            selector: (row) =>
                row.classId ? `${row.classId?.className || 'N/A'} - ${row.sectionId?.sectionName || 'N/A'}` : 'N/A',
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
            name: 'Teacher',
            selector: (row) => row.teacherId?.fullName || 'N/A',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Actions',
            cell: (row) =>
                row.slotType === 'Class Slot' ? (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleEdit(row)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit Assignment"
                        >
                            <AiOutlineEdit size={20} />
                        </button>
                        <button
                            onClick={() => handleDelete(row._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete Assignment"
                        >
                            <AiOutlineDelete size={20} />
                        </button>
                    </div>
                ) : (
                    <span className="text-gray-500">N/A</span>
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
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-indigo-700">Class Timetable</h2>
                <div className="flex space-x-4">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                        <AiOutlinePlus className="mr-2" size={20} />
                        Assign Class
                    </button>
                </div>
            </div>

            {/* Search Input */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by slot, class, section, subject, teacher, etc..."
                    value={searchText}
                    onChange={handleSearch}
                    className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* DataTable for displaying Class Slot Assignments and Break Slots */}
            <DataTable
                columns={columns}
                data={filteredAssignments}
                pagination
                highlightOnHover
                customStyles={customStyles}
                noDataComponent={
                    dataFetched && !loading && assignments.length === 0 ? 'No Class Slot Assignments found.' : null
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
                        <span className="ml-2 text-indigo-600">Loading Class Slot Assignments...</span>
                    </div>
                }
            />

            {/* Add Class Slot Assignment Modal */}
            {showAddModal && (
                <AddClassSlotAssignmentModal
                    showModal={showAddModal}
                    setShowModal={setShowAddModal}
                    reloadAssignments={fetchAssignments}
                />
            )}

            {/* Edit Class Slot Assignment Modal */}
            {showEditModal && selectedAssignment && (
                <EditClassSlotAssignmentModal
                    showModal={showEditModal}
                    setShowModal={setShowEditModal}
                    reloadAssignments={fetchAssignments}
                    assignment={selectedAssignment}
                />
            )}
        </div>
    );
};

export default ClassSlotAssignmentsList;
