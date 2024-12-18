// frontend/src/components/BranchClassDaysList.jsx

import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { getAllBranchClassDays, deleteBranchClassDay } from '../../api/branchClassDaysApi';
import Swal from 'sweetalert2';
import AddBranchClassDay from './scheduleAndAssign/AddBranchClassDay';
import { AiFillDelete, AiOutlineArrowRight } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const BranchClassDaysList = () => {
    const [branchClassDays, setBranchClassDays] = useState([]);
    const [filteredClassDays, setFilteredClassDays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    const fetchBranchClassDays = async () => {
        try {
            const data = await getAllBranchClassDays();
            setBranchClassDays(data);
            setFilteredClassDays(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch branch class days:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBranchClassDays();
    }, []);

    // Search functionality to filter class days
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);
        const filtered = branchClassDays.filter(
            (item) =>
                (item.branchId?.branchName?.toLowerCase().includes(value)) ||
                (item.branchId?.branchAddress?.toLowerCase().includes(value)) ||
                (item.day?.toLowerCase().includes(value))
        );
        setFilteredClassDays(filtered);
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this class day?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (confirm.isConfirmed) {
            setDeletingId(id);
            try {
                await deleteBranchClassDay(id);
                Swal.fire('Deleted!', 'Class day has been deleted.', 'success');

                await fetchBranchClassDays();

                setBranchClassDays((prev) => {
                    const updated = prev.filter((item) => item._id !== id);
                    setFilteredClassDays(updated);
                    return updated;
                });
            } catch (error) {
                console.error('Failed to delete class day:', error);
                Swal.fire('Error', 'Failed to delete class day.', 'error');
            } finally {
                setDeletingId(null);
            }
        }
    };

    // Define columns for DataTable
    const columns = [
        {
            name: 'Branch Name',
            selector: (row) => row.branchId?.branchName || 'N/A',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Branch Address',
            selector: (row) => row.branchId?.branchAddress || 'N/A',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Day',
            selector: (row) => row.day,
            sortable: true,
            wrap: true,
            cell: (row) => {
                // Define day categories
                const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
                const weekends = ['Saturday', 'Sunday'];

                let bgColor = 'bg-gray-500';
                let textColor = 'text-white';

                if (weekdays.includes(row.day)) {
                    bgColor = 'bg-blue-500';
                } else if (weekends.includes(row.day)) {
                    bgColor = 'bg-green-500';
                } else {
                    bgColor = 'bg-purple-500'; // For any other days
                }

                return (
                    <span className={`px-2 py-1 rounded-full ${bgColor} ${textColor}`}>
                        {row.day}
                    </span>
                );
            },
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex space-x-3">
                    {/* Arrow Icon to Navigate to BranchDailyTimeSlotsList */}
                    <Link
                        to={`/branch-admin/scheduleAndAssign/timeSlot/${row._id}`}
                        className="text-indigo-500 cursor-pointer"
                        title="View Time Slots"
                    >
                        <AiOutlineArrowRight size={20} />
                    </Link>

                    {/* Delete Icon */}
                    <button
                        onClick={() => handleDelete(row._id)}
                        className="flex items-center justify-center text-red-500 cursor-pointer"
                        disabled={deletingId === row._id}
                        title="Delete Class Day"
                    >
                        {deletingId === row._id ? (
                            <svg
                                className="animate-spin h-5 w-5 text-red-500"
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
                        ) : (
                            <AiFillDelete size={20} />
                        )}
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
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

    if (loading) {
        return (
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
                <span className="ml-2 text-indigo-600">Loading class days...</span>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-indigo-700">Branch Class Days</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
                >
                    {/* Optional: Add an icon */}
                    Add Class Day
                </button>
            </div>

            {/* Search Input */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by branch name, address, or day..."
                    value={searchText}
                    onChange={handleSearch}
                    className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* DataTable for displaying Branch Class Days */}
            <DataTable
                columns={columns}
                data={filteredClassDays}
                pagination
                highlightOnHover
                customStyles={customStyles}
                noDataComponent="No class days found."
                progressPending={loading}
            />

            {/* Add Branch Class Day Modal */}
            {showAddModal && (
                <AddBranchClassDay
                    showModal={showAddModal}
                    setShowModal={setShowAddModal}
                    reload={fetchBranchClassDays}
                />
            )}
        </div>
    );
};

export default BranchClassDaysList;
