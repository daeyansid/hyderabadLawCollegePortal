// src/components/BranchAdminLeaveDataTable.jsx

import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import {
  getBranchAdminLeavesByBranchAdminId,
  deleteBranchAdminLeave,
} from '../../api/branchAdminLeaveApi';
import { AiFillEye, AiFillEdit, AiFillDelete } from 'react-icons/ai';
import Swal from 'sweetalert2';
import AddBranchAdminLeaveModal from './leaveManagementOwn/AddBranchAdminLeaveModal';
import EditBranchAdminLeaveModal from './leaveManagementOwn/EditBranchAdminLeaveModal';
import ViewBranchAdminLeaveModal from './leaveManagementOwn/ViewBranchAdminLeaveModal';

const BranchAdminLeaveDataTable = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedLeave, setSelectedLeave] = useState(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch leaves for the currently logged-in branch admin
  const fetchLeaves = async () => {
    try {
      const branchAdminId = localStorage.getItem('adminSelfId');
      if (!branchAdminId) {
        throw new Error('Branch Admin ID is missing. Please login again.');
      }

      // Fetch leaves for the branch admin using their ID
      const data = await getBranchAdminLeavesByBranchAdminId(branchAdminId);
      setLeaves(data);
      setFilteredLeaves(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Search functionality
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = leaves.filter(
      (leave) =>
        (leave.leaveReason && leave.leaveReason.toLowerCase().includes(value)) ||
        (leave.status && leave.status.toLowerCase().includes(value))
    );

    setFilteredLeaves(filtered);
  };

  // Handle Delete
const handleDelete = async (leaveId) => {
  const confirm = await Swal.fire({
    title: 'Are you sure?',
    text: 'You are about to delete this leave. This action cannot be undone!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  });

  if (confirm.isConfirmed) {
    try {
      await deleteBranchAdminLeave(leaveId);
      Swal.fire('Deleted!', 'The leave has been deleted.', 'success');

      // Update the state by filtering out the deleted leave
      setLeaves((prevLeaves) => prevLeaves.filter((leave) => leave._id !== leaveId));
      setFilteredLeaves((prevFilteredLeaves) =>
        prevFilteredLeaves.filter((leave) => leave._id !== leaveId)
      );
    } catch (error) {
      Swal.fire('Error!', 'Failed to delete the leave.', 'error');
    }
  }
};


  // Handle View
  const handleView = (leave) => {
    setSelectedLeave(leave);
    setShowViewModal(true);
  };

  // Handle Edit
  const handleEdit = (leave) => {
    setSelectedLeave(leave);
    setShowEditModal(true);
  };

  // Define columns for DataTable
  const columns = [
    {
      name: '#',
      cell: (row, index) => index + 1,
      width: '50px',
      sortable: false,
    },
    // Since the branch admin is viewing their own leaves, we can omit the 'Name' column
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
          className={`px-2 py-1 rounded-full text-white ${
            row.status === 'Approved'
              ? 'bg-green-500'
              : row.status === 'Pending'
              ? 'bg-yellow-500'
              : 'bg-red-500'
          }`}
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
            onClick={() => handleView(row)}
          />
          {row.status === 'Pending' ? (
            <AiFillEdit
              className="text-yellow-500 cursor-pointer"
              onClick={() => handleEdit(row)}
            />
          ) : (
            <AiFillEdit
              className="text-gray-400 cursor-not-allowed"
              title="Edit disabled for non-pending status"
            />
          )}
          {row.status === 'Pending' ? (
            <AiFillDelete
              className="text-red-500 cursor-pointer"
              onClick={() => handleDelete(row._id)}
            />
          ) : (
            <AiFillDelete
              className="text-gray-400 cursor-not-allowed"
              title="Delete disabled for non-pending status"
            />
          )}
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

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">My Leaves</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Add Leave
        </button>
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
        <p>Loading leaves...</p>
      ) : (
        <DataTable
          columns={columns}
          data={filteredLeaves}
          pagination
          highlightOnHover
          customStyles={customStyles}
        />
      )}

      {/* Add Leave Modal */}
      {showAddModal && (
        <AddBranchAdminLeaveModal
          showModal={showAddModal}
          setShowModal={setShowAddModal}
          reloadLeaves={fetchLeaves}
        />
      )}

      {/* View Leave Modal */}
      {showViewModal && selectedLeave && (
        <ViewBranchAdminLeaveModal
          showModal={showViewModal}
          setShowModal={setShowViewModal}
          leave={selectedLeave}
        />
      )}

      {/* Edit Leave Modal */}
      {showEditModal && selectedLeave && (
        <EditBranchAdminLeaveModal
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          leave={selectedLeave}
          reloadLeaves={fetchLeaves}
        />
      )}
    </div>
  );
};

export default BranchAdminLeaveDataTable;
