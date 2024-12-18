import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { deleteTeacherLeave, deleteStaffLeave, getCombinedLeaves } from '../../api/combinedLeaveApi';
import { AiFillEye, AiFillEdit, AiFillDelete } from 'react-icons/ai';
import AddStaffLeaveModal from './leaveManagement/AddStaffLeaveModal';
import ViewLeaveModal from './leaveManagement/ViewLeaveModal';
import EditLeaveModal from './leaveManagement/EditLeaveModal';
import AddTeacherLeaveModal from './leaveManagement/AddTeacherLeaveModal';
import Swal from 'sweetalert2';

const CombinedLeaveDataTable = () => {
    const [leaves, setLeaves] = useState([]);
    const [filteredLeaves, setFilteredLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);

    const fetchCombinedLeaves = async () => {
        try {
            const leaveData = await getCombinedLeaves();
            setLeaves(leaveData);
            setFilteredLeaves(leaveData);
            setLoading(false);
        } catch (error) {
            console.error('Unable to fetch leave data.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCombinedLeaves();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);


        const filtered = leaves.filter((leave) =>
            (leave.userType && leave.userType.toLowerCase().includes(value)) ||
            (leave.teacherId?.fullName && leave.teacherId.fullName.toLowerCase().includes(value)) ||
            (leave.staffId?.fullName && leave.staffId.fullName.toLowerCase().includes(value)) ||
            (leave.branchId?.branchName && leave.branchId.branchName.toLowerCase().includes(value)) ||
            (leave.leaveReason && leave.leaveReason.toLowerCase().includes(value)) ||
            (leave.status && leave.status.toLowerCase().includes(value))
        );
        setFilteredLeaves(filtered);
    };

    // Handle Delete click
    const handleDeleteClick = async (leaveId, userType) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete this ${userType} leave. This action cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (confirm.isConfirmed) {
            try {
                if (userType === 'Teacher') {
                    await deleteTeacherLeave(leaveId); // Delete teacher leave
                } else {
                    await deleteStaffLeave(leaveId); // Delete staff leave
                }
                Swal.fire('Deleted!', 'The leave has been deleted.', 'success');
                fetchCombinedLeaves(); // Refresh the data after deletion
            } catch (error) {
                Swal.fire('Error!', 'Failed to delete the leave.', 'error');
            }
        }
    };

    // Handle view button click
    const handleViewClick = (leave) => {
        setSelectedLeave(leave);  // Set selected leave data
        setShowViewModal(true);   // Show the view modal
    };

    // Handle edit button click
    const handleEditClick = (leave) => {
        setSelectedLeave(leave);  // Set selected leave data
        setShowEditModal(true);   // Show the edit modal
    };

    // Define table columns
    const columns = [
        {
            name: '#',
            cell: (row, index) => index + 1,  // Row number
            width: '50px',
            sortable: false,
        },
        {
            name: 'User Type',
            selector: (row) => row.userType,  // Show Teacher or Staff
            sortable: true,
            wrap: true,  // Wrap text in cells
            cell: (row) => (
                <span
                    className={`px-2 py-1 rounded-full text-white ${row.userType === 'Teacher' ? 'bg-blue-500' : 'bg-purple-500'}`}
                >
                    {row.userType}
                </span>
            )
        },
        {
            name: 'Name',
            selector: (row) => (row.userType === 'Teacher' ? row.teacherId.fullName : row.staffId.fullName),
            sortable: true,
            wrap: true,
        },
        {
            name: 'Branch',
            selector: (row) => row.branchId.branchName,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Leave Reason',
            selector: (row) => row.leaveReason,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Start Date',
            selector: (row) => new Date(row.leaveStartDate).toLocaleDateString(),
            sortable: true,
            wrap: true,
        },
        {
            name: 'End Date',
            selector: (row) => new Date(row.leaveEndDate).toLocaleDateString(),
            sortable: true,
            wrap: true,
        },
        {
            name: 'Total Days',
            selector: (row) => row.totalLeaveDays,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Status',
            selector: (row) => row.status,
            cell: (row) => (
                <span
                    className={`px-2 py-1 rounded-full text-white ${row.status === 'Approved' ? 'bg-green-500' : row.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'}`}
                >
                    {row.status}
                </span>
            ),
            sortable: true,
            wrap: true,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex space-x-2">
                    <AiFillEye
                        className="text-blue-500 cursor-pointer"
                        onClick={() => handleViewClick(row)} // Open the view modal
                    />
                    {row.status === 'Pending' ? (
                        <AiFillEdit
                            className="text-yellow-500 cursor-pointer"
                            onClick={() => handleEditClick(row)} // Open the edit modal
                        />
                    ) : (
                        <AiFillEdit
                            className="text-gray-400 cursor-not-allowed" // Disabled style
                            title="Edit disabled for non-pending status"
                        />
                    )}
                    <AiFillDelete
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDeleteClick(row._id, row.userType)} // Pass the leave ID and user type
                    />
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }

    ];

    // Custom styles for the DataTable
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
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Leave Records</h2>
                <div className="space-x-2">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                    >
                        Add Staff Leave
                    </button>
                    <button
                        onClick={() => setShowAddTeacherModal(true)}
                        className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                    >
                        Add Teacher Leave
                    </button>
                </div>
            </div>

            {/* Search Input */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={handleSearch}
                    className="p-2 border border-gray-300 rounded-md w-full"
                />
            </div>

            {loading ? (
                <p>Loading leave data...</p>
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredLeaves}  // Use filtered data for display
                    pagination
                    highlightOnHover
                    customStyles={customStyles}  // Apply custom styles
                />
            )}

            {/* Add Staff Leave Modal */}
            {showAddModal && (
                <AddStaffLeaveModal
                    showModal={showAddModal}
                    setShowModal={setShowAddModal}
                    reloadLeaves={fetchCombinedLeaves}
                />
            )}

            {/* View Leave Modal */}
            {showViewModal && selectedLeave && (
                <ViewLeaveModal
                    showModal={showViewModal}
                    setShowModal={setShowViewModal}
                    leave={selectedLeave} // Pass the selected leave to the modal
                    reloadLeaves={fetchCombinedLeaves} // Reload after status change
                />
            )}

            {/* Edit Leave Modal */}
            {showEditModal && selectedLeave && (
                <EditLeaveModal
                    showModal={showEditModal}
                    setShowModal={setShowEditModal}
                    leave={selectedLeave} // Pass the selected leave to the modal
                    reloadLeaves={fetchCombinedLeaves} // Reload after status change
                />
            )}

            {/* Add Teacher Leave Modal */}
            {showAddTeacherModal && (
                <AddTeacherLeaveModal
                    showModal={showAddTeacherModal}
                    setShowModal={setShowAddTeacherModal}
                    reloadLeaves={fetchCombinedLeaves} // Reload leaves after addition
                />
            )}
        </div>
    );
};

export default CombinedLeaveDataTable;
