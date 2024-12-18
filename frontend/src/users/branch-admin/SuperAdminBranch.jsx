import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { fetchBranches, deleteBranch } from '../../api/super-admin/superAdminBranch'; 
import { AiFillEdit, AiFillDelete, AiFillEye } from 'react-icons/ai';
import CreateBranchModal from './branch/CreateBranchModal';
import ViewBranchModal from './branch/ViewBranchModal'; 
import UpdateBranchModal from './branch/UpdateBranchModal'; // Import the update modal

const SuperAdminBranch = () => {
    const [branches, setBranches] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);

    const navigate = useNavigate();

    const loadBranches = async () => {
        try {
            const branchData = await fetchBranches();
            if (branchData) {
                setBranches(branchData.data);
            }
        } catch (error) {
            console.error('Unable to fetch branches. Please try again later.');
        }
    };

    useEffect(() => {
        loadBranches();
    }, []);

        const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteBranch(id);
                    setBranches(branches.filter((branch) => branch._id !== id));
                    Swal.fire('Deleted!', 'Branch Deleted Successfully.', 'success');
                    loadBranches();
                } catch (error) {
                    console.error('Unable to delete staff:', error);
                    Swal.fire('Error!', 'Unable to delete branch admin. Please try again later.', 'error');
                }
            }
        });
    };

    const handleViewClick = (branch) => {
        setSelectedBranch(branch);
        setShowViewModal(true);
    };

    const handleEditClick = (branch) => {
        setSelectedBranch(branch);
        setShowUpdateModal(true);
    };

    const filteredData = Array.isArray(branches)
        ? branches.filter((branch) =>
              branch.branchName.toLowerCase().includes(filterText.toLowerCase()) ||
              branch.branchPhoneNumber.toLowerCase().includes(filterText.toLowerCase()) ||
              branch.branchAddress.toLowerCase().includes(filterText.toLowerCase()) ||
              branch.assignedTo?.fullName.toLowerCase().includes(filterText.toLowerCase())
          )
        : [];

    const columns = [
        {
            name: 'S No',
            selector: (row, index) => index + 1,
            width: '90px',
        },
        {
            name: 'Branch Name',
            selector: (row) => row.branchName,
            sortable: true,
        },
        {
            name: 'Branch Contact Num',
            selector: (row) => row.branchPhoneNumber,
            sortable: true,
        },
        {
            name: 'Branch Address',
            selector: (row) => row.branchAddress,
            sortable: true,
        },
        {
            name: 'Assigned To',
            selector: (row) => row.assignedTo?.fullName || 'N/A',
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex space-x-3">
                    <AiFillEye
                        className="text-blue-500 cursor-pointer"
                        onClick={() => handleViewClick(row)}
                    />
                    <AiFillEdit
                        className="text-green-500 cursor-pointer"
                        onClick={() => handleEditClick(row)}
                    />
                    <AiFillDelete
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDelete(row._id)}
                    />
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const customStyles = {
        headCells: {
            style: {
                fontSize: '14px',
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

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-semibold text-indigo-700">Branch Management</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Create Branch
                </button>
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    className="p-2 border border-gray-300 rounded-md w-full"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />
            </div>
            <DataTable
                columns={columns}
                data={filteredData}
                customStyles={customStyles}
                pagination
            />
            {showModal && (
                <CreateBranchModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    reloadBranches={loadBranches}
                />
            )}
            {showViewModal && selectedBranch && (
                <ViewBranchModal
                    showModal={showViewModal}
                    setShowModal={setShowViewModal}
                    branch={selectedBranch}
                />
            )}
            {showUpdateModal && selectedBranch && (
                <UpdateBranchModal
                    showModal={showUpdateModal}
                    setShowModal={setShowUpdateModal}
                    branch={selectedBranch}
                    reloadBranches={loadBranches}
                />
            )}
        </div>
    );
};

export default SuperAdminBranch;