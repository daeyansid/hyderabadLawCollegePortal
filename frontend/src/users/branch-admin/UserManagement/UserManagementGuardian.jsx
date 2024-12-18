import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { fetchGuardians, deleteGuardian } from '../../../api/guardianApi';
import { AiFillEdit, AiFillDelete, AiFillEye } from 'react-icons/ai';
import AddGuardianModal from './Guardian/AddGuardianModal';
import EditGuardianModal from './Guardian/EditGuardianModal';
import ViewGuardianModal from './Guardian/ViewGuardianModal';

const UserManagementGuardian = () => {
    const [guardians, setGuardians] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedGuardianId, setSelectedGuardianId] = useState(null);

    useEffect(() => {
        loadGuardians();
    }, []);

    const loadGuardians = async () => {
        try {
            const guardianData = await fetchGuardians();
            if (guardianData) {
                setGuardians(guardianData.data);
            }
        } catch (error) {
            console.error('Unable to fetch guardians. Please try again later.');
        }
    };

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
                    await deleteGuardian(id);
                    setGuardians(guardians.filter((guardian) => guardian._id !== id));
                    Swal.fire('Deleted!', 'The guardian has been deleted.', 'success');
                } catch (error) {
                    console.error('Unable to delete guardian:', error);
                    Swal.fire('Error!', 'Unable to delete guardian. Please try again later.', 'error');
                }
            }
        });
    };

    const handleViewClick = (id) => {
        setSelectedGuardianId(id);
        setShowViewModal(true);
    };

    const handleEditClick = (id) => {
        setSelectedGuardianId(id);
        setShowEditModal(true);
    };

    const filteredData = Array.isArray(guardians)
        ? guardians.filter((guardian) =>
              (guardian.fullName?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
              (guardian.cnicNumber || '').includes(filterText) ||
              (guardian.guardianPhoneNumber || '').includes(filterText) ||
              (guardian.userRole?.toLowerCase() || '').includes(filterText.toLowerCase())
          )
        : [];

    const columns = [
        {
            name: 'S No',
            selector: (row, index) => index + 1,
            width: '90px',
        },
        {
            name: 'Full Name',
            selector: (row) => row.fullName || 'N/A',
            sortable: true,
        },
        {
            name: 'CNIC Number',
            selector: (row) => row.cnicNumber || 'N/A',
            sortable: true,
        },
        {
            name: 'Phone Number',
            selector: (row) => row.guardianPhoneNumber || 'N/A',
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
                    <AiFillEdit
                        className="text-green-500 cursor-pointer"
                        onClick={() => handleEditClick(row._id)}
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
                <h2 className="text-2xl font-semibold text-indigo-700">Guardian Management</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Add Guardian
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
            <DataTable columns={columns} data={filteredData} customStyles={customStyles} pagination />
            
            {showAddModal && (
                <AddGuardianModal showModal={showAddModal} setShowModal={setShowAddModal} reloadData={loadGuardians} />
            )}
            {showEditModal && selectedGuardianId && (
                <EditGuardianModal
                    showModal={showEditModal}
                    setShowModal={setShowEditModal}
                    guardianId={selectedGuardianId}
                    reloadData={loadGuardians}
                />
            )}
            {showViewModal && selectedGuardianId && (
                <ViewGuardianModal
                    showModal={showViewModal}
                    setShowModal={setShowViewModal}
                    guardianId={selectedGuardianId}
                />
            )}
        </div>
    );
};

export default UserManagementGuardian;
