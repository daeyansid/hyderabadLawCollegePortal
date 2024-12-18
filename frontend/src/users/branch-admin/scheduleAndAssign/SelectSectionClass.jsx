import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { fetchClasses } from '../../../api/classApi';
import { fetchSections } from '../../../api/sectionApi';
import { AiOutlineArrowRight, AiOutlineBook, AiOutlineAppstore } from 'react-icons/ai';
import { useNavigate, useParams } from 'react-router-dom';

const SelectSection = () => {
    const { branchClassDayIdParam } = useParams();
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const classData = await fetchClasses();
            if (classData) {
                setClasses(classData.data);
            }
            const sectionData = await fetchSections();
            if (sectionData) {
                setSections(sectionData.data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch classes or sections:', error);
            // Swal.fire('Error', 'Failed to fetch classes or sections.', 'error');
            setLoading(false);
        }
    };

    // Navigate to the assign route
    const handleAssign = (classId, sectionId) => {
        if (sectionId) {
            navigate(`/branch-admin/scheduleAndAssign/ClassSlotAssignmentsList/${branchClassDayIdParam}/${sectionId}`);
        }
    };

    // Prepare combined data
    const combinedData = [];

    classes.forEach((classItem) => {
        const classSections = sections.filter(
            (section) => section.classId && section.classId._id === classItem._id
        );

        if (classSections.length > 0) {
            classSections.forEach((section) => {
                combinedData.push({
                    classId: classItem._id,
                    className: classItem.className,
                    description: classItem.description,
                    sectionId: section._id,
                    sectionName: section.sectionName,
                    roomNumber: section.roomNumber,
                });
            });
        } else {
            // Class has no sections
            combinedData.push({
                classId: classItem._id,
                className: classItem.className,
                description: classItem.description,
                sectionId: null,
                sectionName: 'N/A',
                roomNumber: 'N/A',
            });
        }
    });

    // Also include sections that do not have classId (if any)
    const sectionsWithoutClass = sections.filter(
        (section) => !section.classId
    );

    sectionsWithoutClass.forEach((section) => {
        combinedData.push({
            classId: null,
            className: 'N/A',
            description: 'N/A',
            sectionId: section._id,
            sectionName: section.sectionName,
            roomNumber: section.roomNumber,
        });
    });

    // Filtered data
    const filteredData = combinedData.filter((item) => {
        return (
            (item.className && item.className.toLowerCase().includes(filterText.toLowerCase())) ||
            (item.description && item.description.toLowerCase().includes(filterText.toLowerCase())) ||
            (item.sectionName && item.sectionName.toLowerCase().includes(filterText.toLowerCase())) ||
            (item.roomNumber && item.roomNumber.toLowerCase().includes(filterText.toLowerCase()))
        );
    });

    // Columns for DataTable
    const columns = [
        {
            name: 'S No',
            selector: (row, index) => index + 1,
            width: '70px',
            center: true,
            grow: 0,
        },
        {
            name: 'Class Name',
            selector: (row) => row.className,
            sortable: true,
            wrap: true,
            cell: (row) => (
                <div className="flex items-center">
                    <AiOutlineBook className="text-indigo-500 mr-2" size={20} />
                    <span className="font-medium text-gray-700">{row.className}</span>
                </div>
            ),
        },
        {
            name: 'Section Name',
            selector: (row) => row.sectionName,
            sortable: true,
            wrap: true,
            cell: (row) => (
                <div className="flex items-center">
                    <AiOutlineAppstore className="text-green-500 mr-2" size={20} />
                    {row.sectionName !== 'N/A' ? (
                        <span className="font-medium text-gray-700">{row.sectionName}</span>
                    ) : (
                        <span className="text-gray-400 italic">No Section</span>
                    )}
                </div>
            ),
        },
        {
            name: 'Actions',
            cell: (row) => {
                const isDisabled = row.sectionName === 'N/A';
                return (
                    <button
                        onClick={() => handleAssign(row.classId, row.sectionId)}
                        className={`flex items-center ${
                            isDisabled
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700'
                        } text-white px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        title="Assign"
                        disabled={isDisabled}
                    >
                        <span className="mr-2">Assign</span>
                        <AiOutlineArrowRight size={20} />
                    </button>
                );
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            center: true,
        },
    ];

    // Custom styles for DataTable
    const customStyles = {
        header: {
            style: {
                minHeight: '56px',
            },
        },
        headRow: {
            style: {
                backgroundColor: '#f0f4f8', // Light gray-blue background
                borderBottomWidth: '1px',
                borderBottomColor: '#e2e8f0',
            },
        },
        headCells: {
            style: {
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a202c', // Darker text color
            },
        },
        cells: {
            style: {
                fontSize: '14px',
                color: '#4a5568',
            },
        },
        rows: {
            highlightOnHoverStyle: {
                backgroundColor: '#edf2f7', // Light gray background on hover
                borderBottomColor: '#e2e8f0',
                outline: '1px solid #e2e8f0',
            },
            stripedStyle: {
                backgroundColor: '#f7fafc', // Slightly different background for striped rows
            },
        },
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-6">Available Classes and Sections</h2>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <svg
                        className="animate-spin h-10 w-10 text-indigo-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span className="ml-2 text-indigo-600">Loading available classes and sections...</span>
                </div>
            ) : (
                <>
                    {/* Search Input */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search by Class Name, Section Name, or Room Number..."
                            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                        />
                    </div>

                    {/* Combined Table */}
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        customStyles={customStyles}
                        pagination
                        highlightOnHover
                        striped
                        responsive
                    />
                </>
            )}
        </div>
    );
};

export default SelectSection;