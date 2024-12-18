import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { getLeavesByTeacherId, deleteLeave } from '../../api/teacherLeaveApi';
import { AiFillEye, AiFillDelete, AiFillEdit } from 'react-icons/ai'; 
import Swal from 'sweetalert2';
import AddLeaveModal from './leaveManagement/AddLeaveModal';
import ViewLeaveModal from './leaveManagement/ViewLeaveModal';
import EditLeaveModal from './leaveManagement/EditLeaveModal';

const TeacherLeaveDataTable = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedLeaveId, setSelectedLeaveId] = useState(null);

    const teacherId = localStorage.getItem('adminSelfId');

    const fetchLeaves = async () => {
        try {
            const leaveData = await getLeavesByTeacherId(teacherId);
            setLeaves(leaveData);
            setLoading(false);
        } catch (error) {
            console.error('Unable to fetch leave data.');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (teacherId) {
            fetchLeaves();
        } else {
            console.error('No teacherId found in localStorage.');
        }
    }, [teacherId]);

    const handleViewClick = (leaveId) => {
        setSelectedLeaveId(leaveId);
        setShowViewModal(true);
    };

    const handleEditClick = (leaveId) => {
        setSelectedLeaveId(leaveId);
        setShowEditModal(true);
    };

    const handleDeleteClick = async (leaveId) => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        });

        if (confirmDelete.isConfirmed) {
            try {
                await deleteLeave(leaveId);
                Swal.fire('Deleted!', 'The leave has been deleted.', 'success');
                fetchLeaves();
            } catch (error) {
                Swal.fire('Error!', 'Failed to delete the leave. Please try again later.', 'error');
            }
        }
    };

    // Define custom styles for the DataTable
    const customStyles = {
        headCells: {
            style: {
                fontSize: '16px',
                fontWeight: '600',
                backgroundColor: '#F3F4F6',
                color: '#374151',
                padding: '16px',
            },
        },
        cells: {
            style: {
                fontSize: '14px',
                padding: '16px',
            },
        },
        rows: {
            style: {
                '&:nth-of-type(even)': {
                    backgroundColor: '#F9FAFB',
                },
            },
        },
    };

const getStatusStyle = (status) => {
    if (!status) {
        return 'text-gray-600 bg-gray-100 px-2 py-1 rounded-full';
    }

    switch (status) {
        case 'Approved':
            return 'text-green-600 bg-green-100 px-2 py-1 rounded-full';
        case 'Pending':
            return 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full';
        case 'Rejected':
            return 'text-red-600 bg-red-100 px-2 py-1 rounded-full';
        default:
            return 'text-gray-600 bg-gray-100 px-2 py-1 rounded-full';
    }
};


    // Define table columns
    const columns = [
        {
            name: 'Leave Reason',
            selector: (row) => row.leaveReason,
            sortable: true,
        },
        {
            name: 'Start Date',
            selector: (row) => new Date(row.leaveStartDate).toLocaleDateString(),
            sortable: true,
        },
        {
            name: 'End Date',
            selector: (row) => new Date(row.leaveEndDate).toLocaleDateString(),
            sortable: true,
        },
        {
            name: 'Total Days',
            selector: (row) => row.totalLeaveDays,
            sortable: true,
        },
        {
            name: 'status',
            cell: (row) => (
                <span className={getStatusStyle(row.status)}>
                    {row.status ? row.status : 'N/A'}
                </span>
            ),
            sortable: true,
        },        
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex space-x-3">
                    <AiFillEye
                        className="text-blue-500 cursor-pointer"
                        onClick={() => handleViewClick(row._id)}
                    />
                    {row.status == 'Pending' ? (
                        <AiFillEdit
                            className="text-green-500 cursor-pointer"
                            onClick={() => handleEditClick(row._id)}
                        />
                    ) : (
                        <AiFillEdit
                            className="text-gray-400 cursor-not-allowed" // Disable edit icon for non-pending statuses
                            title="Edit disabled for non-pending status"
                        />
                    )}
                    {/* <AiFillDelete
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDeleteClick(row._id)} // Handle delete click
                    /> */}
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
        
    ];

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-semibold text-indigo-700">Leave Records</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                >
                    Add Leave
                </button>
            </div>
            {loading ? (
                <p>Loading leave data...</p>
            ) : (
                <DataTable
                    columns={columns}
                    data={leaves}
                    pagination
                    customStyles={customStyles} // Apply custom styles
                />
            )}

            {/* Add Leave Modal */}
            {showAddModal && (
                <AddLeaveModal showModal={showAddModal} setShowModal={setShowAddModal} reloadLeaves={fetchLeaves} />
            )}

            {/* View Leave Modal */}
            {showViewModal && selectedLeaveId && (
                <ViewLeaveModal
                    showModal={showViewModal}
                    setShowModal={setShowViewModal}
                    leaveId={selectedLeaveId} // Pass the selected leave ID to the view modal
                />
            )}

            {/* Edit Leave Modal */}
            {showEditModal && selectedLeaveId && (
                <EditLeaveModal
                    showModal={showEditModal}
                    setShowModal={setShowEditModal}
                    leaveId={selectedLeaveId} // Pass the selected leave ID to the edit modal
                    reloadLeaves={fetchLeaves} // Reload leaves after editing
                />
            )}
        </div>
    );
};

export default TeacherLeaveDataTable;
