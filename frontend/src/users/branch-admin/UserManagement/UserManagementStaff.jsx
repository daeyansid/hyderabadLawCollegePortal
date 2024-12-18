import React, { useEffect, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { fetchStaff, deleteStaff } from '../../../api/staffApi';
import { AiFillEdit, AiFillDelete, AiFillEye, AiFillPrinter } from 'react-icons/ai';
import AddStaffModal from './Staff/AddStaffModal';
import ViewStaffModal from './Staff/ViewStaffModal'; 
import EditStaffModal from './Staff/EditStaffModal'; 
import moment from 'moment';
import StaffIdCard from './Staff/StaffIdCard';
import { useReactToPrint } from 'react-to-print';

const UserManagementStaff = () => {
    const [staff, setStaff] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const printRef = useRef();

    useEffect(() => {
        loadStaff();
    }, []);

    const loadStaff = async () => {
        try {
            const staffData = await fetchStaff();
            if (staffData) {
                setStaff(staffData.data);
            }
        } catch (error) {
            console.error('Unable to fetch staff. Please try again later.');
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
                    await deleteStaff(id);
                    Swal.fire('Deleted!', 'The staff member has been deleted.', 'success');
                    loadStaff();
                } catch (error) {
                    console.error('Unable to delete staff:', error);
                    Swal.fire('Error!', 'Unable to delete staff. Please try again later.', 'error');
                }
            }
        });
    };

    const handleViewClick = (staff) => {
        setSelectedStaff(staff._id); // Pass staff ID to the modal
        setShowViewModal(true);
    };

    const handleEditClick = (staff) => {
        setSelectedStaff(staff._id); // Pass staff ID to the modal
        setShowEditModal(true);
    };

    const handlePrintClick = (staff) => {
        setSelectedStaff(staff);
        setTimeout(() => handlePrint(), 0); // Delay to ensure ref updates
    };

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: 'Staff ID Card',
        onAfterPrint: () => setSelectedStaff(null), // Reset after printing
    });

    const filteredData = Array.isArray(staff)
        ? staff.filter((member) =>
              member.fullName?.toLowerCase().includes(filterText.toLowerCase()) ||
              member.cnicNumber?.includes(filterText) ||
              member.phoneNumber?.includes(filterText) ||
              member.staffType?.toLowerCase().includes(filterText.toLowerCase())
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
            selector: (row) => row.fullName,
            sortable: true,
        },
        {
            name: 'CNIC Number',
            selector: (row) => row.cnicNumber,
            sortable: true,
        },
        {
            name: 'Phone Number',
            selector: (row) => row.phoneNumber,
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
                <h2 className="text-2xl font-semibold text-indigo-700">Admin Staff Management</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Add Admin Staff
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
                <AddStaffModal showModal={showAddModal} setShowModal={setShowAddModal} reloadData={loadStaff} />
            )}
            {showViewModal && selectedStaff && (
                <ViewStaffModal 
                    showModal={showViewModal} 
                    setShowModal={setShowViewModal} 
                    staffId={selectedStaff} // Pass the selected staff ID to the modal
                />
            )}
            {showEditModal && selectedStaff && (
                <EditStaffModal 
                    showModal={showEditModal} 
                    setShowModal={setShowEditModal} 
                    staffId={selectedStaff} // Pass the selected staff ID to the modal
                    reloadData={loadStaff} 
                />
            )}

            {/* Hidden component for printing */}
            {selectedStaff && (
                <div style={{ display: 'none' }}>
                    <StaffIdCard ref={printRef} staff={selectedStaff} />
                </div>
            )}
        </div>
    );
};

export default UserManagementStaff;