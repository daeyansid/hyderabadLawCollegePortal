// UserManagementTeacher.jsx

import React, { useEffect, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { fetchTeachers, deleteTeacher } from '../../../api/teacherApi';
import { AiFillEdit, AiFillDelete, AiFillEye, AiFillPrinter } from 'react-icons/ai';
import AddTeacherModal from './teacher/AddTeacherModal';
import EditTeacherModal from './teacher/EditTeacherModal';
import ViewTeacherModal from './teacher/ViewTeacherModal';
import moment from 'moment';
import TeacherIdCard from './teacher/TeacherIdCard';
import { useReactToPrint } from 'react-to-print';

const UserManagementTeacher = () => {
    const [teachers, setTeachers] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedTeacherId, setSelectedTeacherId] = useState(null);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    const printRef = useRef();

    useEffect(() => {
        loadTeachers();
    }, []);

    const loadTeachers = async () => {
        try {
            const teacherData = await fetchTeachers();
            if (teacherData) {
                setTeachers(teacherData.data);
            }
        } catch (error) {
            console.error('Unable to fetch teachers. Please try again later.');
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
                    await deleteTeacher(id);
                    Swal.fire('Deleted!', 'The teacher has been deleted.', 'success');
                    loadTeachers();
                } catch (error) {
                    console.error('Unable to delete teacher:', error);
                    Swal.fire('Error!', 'Unable to delete teacher. Please try again later.', 'error');
                }
            }
        });
    };

    const handleViewClick = (id) => {
        setSelectedTeacherId(id);
        setShowViewModal(true);
    };

    const handleEditClick = (id) => {
        setSelectedTeacherId(id);
        setShowEditModal(true);
    };

    const handlePrintClick = (teacher) => {
        setSelectedTeacher(teacher);
        setTimeout(() => handlePrint(), 0); // Delay to ensure ref updates
    };

    const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Teacher ID Card',
    onAfterPrint: () => setSelectedTeacher(null), // Reset after printing
});

    const filteredData = Array.isArray(teachers)
        ? teachers.filter((teacher) =>
              teacher.fullName?.toLowerCase().includes(filterText.toLowerCase()) ||
              teacher.cnicNumber?.includes(filterText) ||
              teacher.phoneNumber?.includes(filterText) ||
              teacher.userRole?.toLowerCase().includes(filterText.toLowerCase())
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
                    <AiFillEye className="text-blue-500 cursor-pointer" onClick={() => handleViewClick(row._id)} />
                    <AiFillEdit className="text-green-500 cursor-pointer" onClick={() => handleEditClick(row._id)} />
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
                <h2 className="text-2xl font-semibold text-indigo-700">Teacher Management</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Add Teacher
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
                <AddTeacherModal showModal={showAddModal} setShowModal={setShowAddModal} reloadData={loadTeachers} />
            )}
            {showEditModal && (
                <EditTeacherModal
                    showModal={showEditModal}
                    setShowModal={setShowEditModal}
                    teacherId={selectedTeacherId}
                    reloadData={loadTeachers}
                />
            )}
            {showViewModal && (
                <ViewTeacherModal showModal={showViewModal} setShowModal={setShowViewModal} teacherId={selectedTeacherId} />
            )}

            {/* Hidden component for printing */}
           {selectedTeacher && (
                <div style={{ display: 'none' }}>
                    <TeacherIdCard ref={printRef} teacher={selectedTeacher} />
                </div>
            )}
        </div>
    );
};

export default UserManagementTeacher;
