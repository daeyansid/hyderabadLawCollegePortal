import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { fetchClasses } from '../../../api/classApi';
import { getDayById } from '../../../api/branchClassDaysApi';
import { AiOutlineArrowRight, AiOutlineBook } from 'react-icons/ai';
import { useNavigate, useParams } from 'react-router-dom';

const SelectSection = () => {
    const { branchClassDayIdParam } = useParams();
    const [classes, setClasses] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [loading, setLoading] = useState(true);
    const [dayData, setDayData] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);

        // for Day name
        try {
            const dayData = await getDayById(branchClassDayIdParam);
            console.log("dayData", dayData);
            setDayData(dayData.day);
        } catch (err) {
            console.error(err);
            setError('Failed to Day Name.');
        } finally {
            setLoading(false);
        }


        try {
            const classData = await fetchClasses();
            if (classData) {
                setClasses(classData.data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch classes:', error);
            setLoading(false);
        }
    };

    const handleAssign = (classId) => {
        navigate(`/branch-admin/scheduleAndAssign/ClassSlotAssignmentsList/${branchClassDayIdParam}/${classId}`);
    };

    const handleBackClick = () => {
        navigate(-1); // This will navigate back to the previous page
    };

    const filteredData = classes.filter((item) => {
        return (
            (item.className && item.className.toLowerCase().includes(filterText.toLowerCase())) ||
            (item.description && item.description.toLowerCase().includes(filterText.toLowerCase()))
        );
    });

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
            name: 'Actions',
            cell: (row) => (
                <button
                    onClick={() => handleAssign(row._id)}
                    className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    title="Assign"
                >
                    <span className="mr-2">Assign</span>
                    <AiOutlineArrowRight size={20} />
                </button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            center: true,
        },
    ];

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
            <button
                onClick={handleBackClick}
                className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-gray-400"
            >
                Back
            </button>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-6">Available Classes for {dayData || 'N/A'}</h2>
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
                    <span className="ml-2 text-indigo-600">Loading available classes...</span>
                </div>
            ) : (
                <>
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search by Class Name..."
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