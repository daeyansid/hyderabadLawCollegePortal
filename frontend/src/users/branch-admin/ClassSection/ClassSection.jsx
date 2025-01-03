import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { fetchClasses, deleteClass } from '../../../api/classApi';
import { fetchSubjectsNew, deleteSubject } from '../../../api/subjectApi';
import { AiFillEdit, AiFillDelete, AiFillEye } from 'react-icons/ai';
import moment from 'moment';
import AddClassModal from './Class/AddClassModal';
import UpdateClassModal from './Class/UpdateClassModal';
import ViewClassModal from './Class/ViewClassModal';
import AddSubjectModal from './Subject/AddSubjectModal';
import UpdateSubjectModal from './Subject/UpdateSubjectModal';
import ViewSubjectModal from './Subject/ViewSubjectModal';

const ClassSection = () => {
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [classFilterText, setClassFilterText] = useState('');
    const [subjectFilterText, setSubjectFilterText] = useState('');

    const [showAddClassModal, setShowAddClassModal] = useState(false);
    const [showUpdateClassModal, setShowUpdateClassModal] = useState(false);
    const [showViewClassModal, setShowViewClassModal] = useState(false);
    const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
    const [showUpdateSubjectModal, setShowUpdateSubjectModal] = useState(false);
    const [showViewSubjectModal, setShowViewSubjectModal] = useState(false);

    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);

    useEffect(() => {
        reloadData();
    }, []);

    const reloadData = async () => {
        // setLoading(true);
        await fetchAllClasses();
        await fetchAllSubjects();
        // setLoading(false);
    };

    const fetchAllClasses = async () => {
        try {
            const classData = await fetchClasses();
            if (classData) {
                setClasses(classData.data);
            }
        } catch (error) {
            console.error('Unable to fetch classes. Please try again later.');
        }
    };

    const fetchAllSubjects = async () => {
        try {
            const subjectData = await fetchSubjectsNew();
            if (subjectData) {
                // console.log('Subjects:', subjectData.data);
                setSubjects(subjectData.data);
            }
        } catch (error) {
            console.error('Unable to fetch subjects. Please try again later.');
        }
    };

const handleClassDelete = async (id) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "Do you really want to delete this class? This action cannot be undone.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
        try {
            await deleteClass(id);
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Class deleted successfully!',
            });
            setClasses(classes.filter((classItem) => classItem._id !== id));
            reloadData();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to delete class. Please try again later.',
            });
        }
    }
};


    const handleSubjectDelete = async (id) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "Do you really want to delete this subject? This action cannot be undone.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
        try {
            await deleteSubject(id);
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Subject deleted successfully!',
            });
            setSubjects(subjects.filter((subject) => subject._id !== id));
            reloadData();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to delete subject. Please try again later.',
            });
        }
    }
};

    const handleClassViewClick = (id) => {
        setSelectedClass(id);
        setShowViewClassModal(true);
    };

    const handleSubjectViewClick = (id) => {
        setSelectedSubject(id);
        setShowViewSubjectModal(true);
    };

    const handleEditClassClick = (id) => {
        setSelectedClass(id);
        setShowUpdateClassModal(true);
    };

    const handleEditSubjectClick = (id) => {
        setSelectedSubject(id);
        setShowUpdateSubjectModal(true);
    };

    const filteredClassData = classes.filter((item) => {
        return (
            item.className.toLowerCase().includes(classFilterText.toLowerCase()) ||
            item.description.toLowerCase().includes(classFilterText.toLowerCase())
        );
    }).map(item => ({
        ...item,
        truncatedDescription: item.description.length > 10 ? item.description.slice(0, 10) + '...' : item.description
    }));

    const filteredSubjectData = subjects
    .filter((item) => {
        return (
            item.subject.name.toLowerCase().includes(subjectFilterText.toLowerCase()) ||
            item.class.name.toLowerCase().includes(subjectFilterText.toLowerCase())
        );
    })
    .map((item, index) => ({
        ...item,
        subjectName: item.subject.name,
        className: item.class.name,
    }));


    const classColumns = [
        {
            name: 'S No',
            selector: (row, index) => index + 1,
            width: '90px',
        },
        {
            name: 'Semester Name',
            selector: (row) => row.className,
            sortable: true,
        },
        {
            name: 'Description',
            selector: (row) => row.description,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex space-x-3">
                    <AiFillEye className="text-blue-500 cursor-pointer" onClick={() => handleClassViewClick(row._id)} />
                    <AiFillEdit className="text-green-500 cursor-pointer" onClick={() => handleEditClassClick(row._id)} />
                    <AiFillDelete className="text-red-500 cursor-pointer" onClick={() => handleClassDelete(row._id)} />
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];


    const subjectColumns = [
        {
            name: 'S No',
            selector: (row, index) => index + 1,
            width: '90px',
        },
        {
            name: 'Subject Name',
            selector: (row) => row.subjectName,
            sortable: true,
        },
        {
            name: 'Semester Name',
            selector: (row) => row.className,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex space-x-3">
                    <AiFillEye className="text-blue-500 cursor-pointer" onClick={() => handleSubjectViewClick(row.subject.id)} />
                    <AiFillEdit className="text-green-500 cursor-pointer" onClick={() => handleEditSubjectClick(row.subject.id)} />
                    <AiFillDelete className="text-red-500 cursor-pointer" onClick={() => handleSubjectDelete(row.subject.id)} />
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
            {/* Class Management Section */}
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-semibold text-indigo-700">Semester Management</h2>
                <button 
                    onClick={() => setShowAddClassModal(true)}
                    className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Add Semester
                </button>
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    className="p-2 border border-gray-300 rounded-md w-full"
                    value={classFilterText}
                    onChange={(e) => setClassFilterText(e.target.value)}
                />
            </div>
            <DataTable
                columns={classColumns}
                data={filteredClassData}
                customStyles={customStyles}
                pagination
            />

            {/* Subject Management Section */}
            <div className="flex justify-between mb-4 mt-10">
                <h2 className="text-2xl font-semibold text-indigo-700">Subject Management</h2>
                <button 
                    onClick={() => setShowAddSubjectModal(true)}
                    className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Add Subject
                </button>
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    className="p-2 border border-gray-300 rounded-md w-full"
                    value={subjectFilterText}
                    onChange={(e) => setSubjectFilterText(e.target.value)}
                />
            </div>
            <DataTable
                columns={subjectColumns}
                data={filteredSubjectData}
                customStyles={customStyles}
                pagination
            />

            {/* Modals */}
            {showAddClassModal && <AddClassModal onClose={() => setShowAddClassModal(false)} reloadData={reloadData} />}
            {showUpdateClassModal && <UpdateClassModal id={selectedClass} onClose={() => setShowUpdateClassModal(false)} reloadData={reloadData} />}
            {showViewClassModal && <ViewClassModal id={selectedClass} onClose={() => setShowViewClassModal(false)} />}

            {showAddSubjectModal && <AddSubjectModal onClose={() => setShowAddSubjectModal(false)} reloadData={reloadData} />}
            {showUpdateSubjectModal && <UpdateSubjectModal id={selectedSubject} onClose={() => setShowUpdateSubjectModal(false)} reloadData={reloadData} />}
            {showViewSubjectModal && <ViewSubjectModal id={selectedSubject} onClose={() => setShowViewSubjectModal(false)} />}
        </div>
    );
};

export default ClassSection;

