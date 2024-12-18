import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { fetchStudents, deleteStudent } from '../../../api/studentApi';
import { AiFillEdit, AiFillDelete, AiFillEye, AiFillPrinter } from 'react-icons/ai';
import StudentIdCard from './Student/StudentIdCard';
import { useReactToPrint } from 'react-to-print';

const UserManagementStudent = () => {
    const [students, setStudents] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const navigate = useNavigate();
    const printRef = useRef();

    useEffect(() => {
        const loadStudents = async () => {
            try {
                const studentData = await fetchStudents();
                if (studentData) {
                    setStudents(studentData);
                }
            } catch (error) {
                console.error('Unable to fetch students. Please try again later.', error);
            }
        };

        loadStudents();
    }, []);

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteStudent(id);
                    setStudents(students.filter((student) => student._id !== id));
                    Swal.fire('Deleted!', 'The student has been deleted.', 'success');
                } catch (error) {
                    console.error('Unable to delete student:', error);
                    Swal.fire('Error!', 'Unable to delete student. Please try again later.', 'error');
                }
            }
        });
    };

    const handleViewClick = (id) => {
        navigate(`/branch-admin/user-management/student-view/${id}`);
    };

    const handlePrintClick = (student) => {
        setSelectedStudent(student);
        setTimeout(() => handlePrint(), 0); // Delay to ensure ref updates
    };

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: 'Student ID Card',
        onAfterPrint: () => setSelectedStudent(null), // Reset after printing
    });

    // Filter students based on search input
    const filteredData = Array.isArray(students)
        ? students.filter((student) => {
              const searchText = filterText.toLowerCase();
              return (
                  student.fullName.toLowerCase().includes(searchText) ||
                  student.castSurname.toLowerCase().includes(searchText) ||
                  student.gender.toLowerCase().includes(searchText) ||
                  (student.classId?.className?.toLowerCase() || '').includes(searchText) ||
                  (student.sectionId?.sectionName?.toLowerCase() || '').includes(searchText)
              );
          })
        : [];

    // Define table columns
    const columns = [
        {
            name: 'S No',
            selector: (row, index) => index + 1,
            width: '70px',
            center: true,
        },
        {
            name: 'Full Name',
            selector: (row) => row.fullName || 'N/A',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Cast/Surname',
            selector: (row) => row.castSurname || 'N/A',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Gender',
            selector: (row) => row.gender || 'N/A',
            sortable: true,
            center: true,
        },
        {
            name: 'Class',
            selector: (row) => row.classId?.className || 'N/A',
            sortable: true,
            center: true,
        },
        {
            name: 'Section',
            selector: (row) => row.sectionId?.sectionName || 'N/A',
            sortable: true,
            center: true,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex space-x-2">
                    <AiFillEye
                        className="text-blue-500 cursor-pointer"
                        size={20}
                        title="View"
                        onClick={() => handleViewClick(row._id)}
                    />
                    <Link
                        to={`/branch-admin/user-management/student-edit/${row._id}`}
                        className="text-green-500 cursor-pointer"
                        title="Edit"
                    >
                        <AiFillEdit size={20} />
                    </Link>
                    <AiFillDelete
                        className="text-red-500 cursor-pointer"
                        size={20}
                        title="Delete"
                        onClick={() => handleDelete(row._id)}
                    />
                    <AiFillPrinter
                        className="text-purple-500 cursor-pointer"
                        size={20}
                        title="Print ID Card"
                        onClick={() => handlePrintClick(row)}
                    />
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '180px',
            center: true,
        },
    ];

    // Custom styles for the DataTable
    const customStyles = {
        headCells: {
            style: {
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: '#F3F4F6',
                color: '#374151',
                padding: '12px',
            },
        },
        cells: {
            style: {
                fontSize: '14px',
                padding: '12px',
            },
        },
        rows: {
            style: {
                minHeight: '60px',
                '&:nth-of-type(even)': {
                    backgroundColor: '#F9FAFB',
                },
            },
        },
        pagination: {
            style: {
                borderTop: '1px solid #E5E7EB',
                paddingTop: '12px',
            },
        },
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <h2 className="text-2xl font-semibold text-indigo-700 mb-4 sm:mb-0">
                    Student Management
                </h2>
                <Link
                    to="/branch-admin/user-management/student-add"
                    className="inline-block bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition duration-300"
                >
                    Add Student
                </Link>
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by name, caste, gender, class, or section..."
                    className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />
            </div>
            <DataTable
                columns={columns}
                data={filteredData}
                customStyles={customStyles}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 25, 50]}
                highlightOnHover
                pointerOnHover
                noDataComponent="No students found"
            />

            {/* Hidden component for printing */}
            {selectedStudent && (
                <div style={{ display: 'none' }}>
                    <StudentIdCard ref={printRef} student={selectedStudent} />
                </div>
            )}
        </div>
    );
};

export default UserManagementStudent;
