// frontend/src/components/BranchDailyTimeSlotsList.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { getBranchDailyTimeSlotsByBranchClassDaysIdSetting, deleteBranchDailyTimeSlot } from '../../../api/branchDailyTimeSlotsApi';
import Swal from 'sweetalert2';
import AddBranchDailyTimeSlot from './AddBranchDailyTimeSlot';
import { AiFillDelete, AiFillEdit, AiOutlineArrowLeft } from 'react-icons/ai';

const BranchDailyTimeSlotsList = () => {
    const { branchClassDaysId } = useParams();
    const navigate = useNavigate();
    const [timeSlots, setTimeSlots] = useState([]);
    const [dayName, setDayName] = useState('');
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // Function to fetch time slots and day name
    const fetchBranchDailyTimeSlots = async () => {
        try {
            const data = await getBranchDailyTimeSlotsByBranchClassDaysIdSetting(branchClassDaysId);
            setTimeSlots(data.timeSlots);
            setDayName(data.day);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch time slots:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (branchClassDaysId) {
            fetchBranchDailyTimeSlots();
        } else {
            Swal.fire('Error', 'Invalid Branch Class Days ID.', 'error');
            setLoading(false);
        }
    }, [branchClassDaysId]);

    // Handle Delete
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this time slot?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (confirm.isConfirmed) {
            setDeletingId(id);
            try {
                await deleteBranchDailyTimeSlot(id);
                Swal.fire('Deleted!', 'Time slot has been deleted.', 'success');
                await fetchBranchDailyTimeSlots();
            } catch (error) {
                console.error('Failed to delete time slot:', error);
                Swal.fire('Error', 'Failed to delete time slot.', 'error');
            } finally {
                setDeletingId(null);
            }
        }
    };

    // Handle Edit
    const handleEdit = (slot) => {
        setSelectedSlot(slot);
        setShowEditModal(true);
    };

    // Define columns for DataTable
    const columns = [
        {
            name: 'Slot',
            selector: (row) => row.slot,
            sortable: true,
        },
        {
            name: 'Slot Type',
            selector: (row) => row.slotType,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex space-x-2">
                    {/* Edit Button */}
                    <button
                        onClick={() => handleEdit(row)}
                        className="flex items-center justify-center text-blue-500 cursor-pointer"
                        title="Edit Time Slot"
                    >
                        <AiFillEdit size={20} />
                    </button>

                    {/* Delete Button */}
                    <button
                        onClick={() => handleDelete(row._id)}
                        className="flex items-center justify-center text-red-500 cursor-pointer"
                        disabled={deletingId === row._id}
                        title="Delete Time Slot"
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
                <span className="ml-2 text-indigo-600">Loading time slots...</span>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            {/* Header with Back and Add Buttons */}
            <div className="flex justify-between items-center mb-4">
                <button
                    // onClick={() => navigate('/branch-admin/scheduleAndAssign/day')}
                    onClick={() => navigate(-1)}
                    className="flex items-center text-indigo-600 hover:text-indigo-800"
                >
                    <AiOutlineArrowLeft size={24} className="mr-2" />
                    Back
                </button>
                <h2 className="text-2xl font-semibold text-indigo-700">
                    Branch Daily Time Slots - {dayName}
                </h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
                >
                    Add Time Slot
                </button>
            </div>

            {/* DataTable for displaying Branch Daily Time Slots */}
            <DataTable
                columns={columns}
                data={timeSlots}
                pagination
                highlightOnHover
                customStyles={customStyles}
                noDataComponent="No time slots found."
                progressPending={loading}
            />

            {/* Add Branch Daily Time Slot Modal */}
            {showAddModal && (
                <AddBranchDailyTimeSlot
                    showModal={showAddModal}
                    setShowModal={setShowAddModal}
                    branchClassDaysId={branchClassDaysId}
                    reload={fetchBranchDailyTimeSlots}
                />
            )}

            {/* Edit Branch Daily Time Slot Modal */}
            {showEditModal && selectedSlot && (
                <AddBranchDailyTimeSlot
                    showModal={showEditModal}
                    setShowModal={setShowEditModal}
                    branchClassDaysId={branchClassDaysId}
                    reload={fetchBranchDailyTimeSlots}
                    selectedSlot={selectedSlot}
                />
            )}
        </div>
    );
};

export default BranchDailyTimeSlotsList;