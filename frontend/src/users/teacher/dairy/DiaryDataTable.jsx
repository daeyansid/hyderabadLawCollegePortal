// src/components/DiaryDataTable.jsx

import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { getDiaries, deleteDiary } from '../../../api/diaryApi';
import { AiFillEye, AiFillDelete, AiFillEdit } from 'react-icons/ai'; 
import Swal from 'sweetalert2';
import AddDiaryModal from './AddDiaryModal';
import ViewDiaryModal from './ViewDiaryModal';
import EditDiaryModal from './EditDiaryModal';

const DiaryDataTable = () => {
    const [diaries, setDiaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedDiaryId, setSelectedDiaryId] = useState(null);

    const fetchDiaries = async () => {
        try {
            const diaryData = await getDiaries();
            setDiaries(diaryData);
            setLoading(false);
        } catch (error) {
            console.error('Unable to fetch diary data.', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiaries();
    }, []);

    const handleViewClick = (diaryId) => {
        setSelectedDiaryId(diaryId);
        setShowViewModal(true);
    };

    const handleEditClick = (diaryId) => {
        setSelectedDiaryId(diaryId);
        setShowEditModal(true);
    };

    const handleDeleteClick = async (diaryId) => {
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
                await deleteDiary(diaryId);
                Swal.fire('Deleted!', 'The diary entry has been deleted.', 'success');
                
                // Update the diary list by removing the deleted entry
                setDiaries((prevDiaries) => prevDiaries.filter((diary) => diary._id !== diaryId));
            } catch (error) {
                Swal.fire('Error!', 'Failed to delete the diary entry. Please try again later.', 'error');
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

    // Define table columns
    const columns = [
        {
            name: 'Date',
            selector: (row) => new Date(row.date).toLocaleDateString(),
            sortable: true,
        },
        {
            name: 'Subject',
            selector: (row) => (row.subject ? row.subject.subjectName : 'N/A'),
            sortable: true,
        },
        {
            name: 'Class',
            selector: (row) => (row.class ? row.class.className : 'N/A'),
            sortable: true,
        },
        {
            name: 'Section',
            selector: (row) => (row.section ? row.section.sectionName : 'N/A'),
            sortable: true,
        },
        {
            name: 'Assign To All',
            selector: (row) => (row.assignToAll ? 'Yes' : 'No'),
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex space-x-3">
                    <AiFillEye
                        className="text-blue-500 cursor-pointer"
                        onClick={() => handleViewClick(row._id)}
                        title="View Diary"
                    />
                    <AiFillEdit
                        className="text-green-500 cursor-pointer"
                        onClick={() => handleEditClick(row._id)}
                        title="Edit Diary"
                    />
                    <AiFillDelete
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDeleteClick(row._id)}
                        title="Delete Diary"
                    />
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
                <h2 className="text-2xl font-semibold text-indigo-700">Diary Records</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                >
                    Add Diary
                </button>
            </div>
            {loading ? (
                <p>Loading diary data...</p>
            ) : (
                <DataTable
                    columns={columns}
                    data={diaries}
                    pagination
                    customStyles={customStyles}
                />
            )}

            {/* Add Diary Modal */}
            {showAddModal && (
                <AddDiaryModal 
                    showModal={showAddModal} 
                    setShowModal={setShowAddModal} 
                    reloadDiaries={fetchDiaries} 
                />
            )}

            {/* View Diary Modal */}
            {showViewModal && selectedDiaryId && (
                <ViewDiaryModal
                    showModal={showViewModal}
                    setShowModal={setShowViewModal}
                    diaryId={selectedDiaryId}
                />
            )}

            {/* Edit Diary Modal */}
            {showEditModal && selectedDiaryId && (
                <EditDiaryModal
                    showModal={showEditModal}
                    setShowModal={setShowEditModal}
                    diaryId={selectedDiaryId}
                    reloadDiaries={fetchDiaries}
                />
            )}
        </div>
    );
};

export default DiaryDataTable;
