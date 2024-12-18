// SuperAdminUser.jsx

import React, { useEffect, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { fetchBranchAdmins, deleteBranchAdmin } from '../../api/super-admin/superAdminUser';
import { AiFillEdit, AiFillDelete, AiFillEye, AiFillPrinter } from 'react-icons/ai';
import AddBranchAdminModal from './user/AddBranchAdminModal';
import ViewBranchAdminModal from './user/ViewBranchAdminModal';
import UpdateBranchAdminModal from './user/UpdateBranchAdminModal';
import moment from 'moment';
import BranchAdminIdCard from './user/BranchAdminIdCard';
import { useReactToPrint } from 'react-to-print';
import {baseURL} from '../../index';

const SuperAdminUser = () => {
    const [branchAdmins, setBranchAdmins] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const printRef = useRef();

    const loadBranchAdmins = async () => {
        try {
            const data = await fetchBranchAdmins();
            setBranchAdmins(data.data);
        } catch (error) {
            console.error('Unable to fetch branch admins. Please try again later.');
        }
    };

    useEffect(() => {
        loadBranchAdmins();
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
                    await deleteBranchAdmin(id);
                    setBranchAdmins(branchAdmins.filter((admin) => admin._id !== id));
                    Swal.fire('Deleted!', 'Branch admin deleted successfully.', 'success');
                    loadBranchAdmins();
                } catch (error) {
                    console.error('Unable to delete staff:', error);
                    Swal.fire('Error!', 'Unable to delete branch admin. Please try again later.', 'error');
                }
            }
        });
    };

    const handleViewClick = (admin) => {
        if (!admin.branch || !admin.branch.branchName) {
            Swal.fire({
                icon: 'error',
                title: 'Branch Not Assigned',
                text: 'Branch has not been assigned yet. Please assign a branch before printing the View Complete Information.',
            });
            return;
        }


        setSelectedAdmin(admin);
        setShowViewModal(true);
    };

    const handleEditClick = (admin) => {

        if (!admin.branch || !admin.branch.branchName) {
            Swal.fire({
                icon: 'error',
                title: 'Branch Not Assigned',
                text: 'Branch has not been assigned yet. Please assign a branch before printing the Edit Complete Information.',
            });
            return;
        }

        setSelectedAdmin(admin);
        setShowUpdateModal(true);
    };

    const handlePrintClick = (admin) => {

        if (!admin.branch || !admin.branch.branchName) {
            Swal.fire({
                icon: 'error',
                title: 'Branch Not Assigned',
                text: 'Branch has not been assigned yet. Please assign a branch before printing the ID card.',
            });
            return;
        }

        setSelectedAdmin(admin);
        setTimeout(() => handlePrint(), 0);
    };

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: 'Branch Admin ID Card',
        onAfterPrint: () => setSelectedAdmin(null), // Reset after printing
    });

    const filteredData = branchAdmins.filter(
        (admin) =>
            admin.fullName.toLowerCase().includes(filterText.toLowerCase()) ||
            admin.userId.email.toLowerCase().includes(filterText.toLowerCase())
    );

    const columns = [
        {
            name: 'S No',
            selector: (row, index) => index + 1,
            width: '90px',
        },
        {
            name: 'Full Name',
            selector: (row) => row.fullName,
            sortable: true,
        },
        {
            name: 'Email',
            selector: (row) => row.userId.email,
            sortable: true,
        },
        {
            name: 'Phone Number',
            selector: (row) => row.phoneNumber,
            sortable: true,
        },
        {
            name: 'CNIC Number',
            selector: (row) => row.cnicNumber,
            sortable: true,
        },
        {
            name: 'Join Date',
            selector: (row) => moment(row.joinDate).format('YYYY-MM-DD'),
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex space-x-3">
                    <AiFillEye className="text-blue-500 cursor-pointer" onClick={() => handleViewClick(row)} />
                    <AiFillEdit className="text-green-500 cursor-pointer" onClick={() => handleEditClick(row)} />
                    <AiFillDelete className="text-red-500 cursor-pointer" onClick={() => handleDelete(row._id)} />
                    <AiFillPrinter className="text-purple-500 cursor-pointer" onClick={() => handlePrintClick(row)} />
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
                <h2 className="text-2xl font-semibold text-indigo-700">Branch Admin Management</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Add Branch Admin
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
                <AddBranchAdminModal showModal={showAddModal} setShowModal={setShowAddModal} reloadData={loadBranchAdmins} />
            )}
            {showViewModal && selectedAdmin && (
                <ViewBranchAdminModal showModal={showViewModal} setShowModal={setShowViewModal} admin={selectedAdmin} />
            )}
            {showUpdateModal && selectedAdmin && (
                <UpdateBranchAdminModal
                    showModal={showUpdateModal}
                    setShowModal={setShowUpdateModal}
                    admin={selectedAdmin}
                    reloadData={loadBranchAdmins}
                />
            )}

            {/* Hidden component for printing */}
            {selectedAdmin && (
                <div style={{ display: 'none' }}>
                    <BranchAdminIdCard ref={printRef} admin={selectedAdmin} />
                </div>
            )}
        </div>
    );
};

export default SuperAdminUser;
