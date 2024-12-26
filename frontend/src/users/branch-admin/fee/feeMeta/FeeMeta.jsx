import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { getAllFeeMeta, deleteFeeMeta } from '../../../../api/feeMeta';
import FeeMetaAdd from './FeeMetaAdd';
// import FeeMetaUpdate from './FeeMetaUpdate';

const FeeMeta = () => {
    const [feeList, setFeeList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedFee, setSelectedFee] = useState(null);

    const fetchFeeList = async () => {
        setLoading(true);
        try {
            const response = await getAllFeeMeta();
            setFeeList(response.data || []);
        } catch (error) {
            console.error('Error:', error);
            message.error('Failed to fetch fee structures');
            setFeeList([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchFeeList();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteFeeMeta(id);
            message.success('Fee structure deleted successfully');
            fetchFeeList();
        } catch (error) {
            message.error('Failed to delete fee structure');
        }
    };

    const columns = [
        {
            title: 'Semester Fee',
            dataIndex: 'semesterFee',
            key: 'semesterFee',
            render: (fee) => (
                <span className="text-lg font-semibold text-indigo-600">
                    Rs. {fee.toLocaleString()}
                </span>
            )
        },
        {
            title: 'Admission Fee',
            dataIndex: 'admissionFee',
            key: 'admissionFee',
            render: (fee) => (
                <span className="text-lg font-semibold text-purple-600">
                    Rs. {fee.toLocaleString()}
                </span>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button 
                        danger 
                        icon={<DeleteOutlined />}
                        className="hover:bg-red-500 hover:text-white transition-colors"
                        onClick={() => handleDelete(record._id)}
                    >
                        Delete
                    </Button>
                </Space>
            )
        }
    ];

    const isAddDisabled = feeList.length >= 1;

    return (
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 min-h-screen">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 background-gradient">
                    Fee Structure Management
                </h1>
                
                <div className="mb-6">
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={() => setShowAddModal(true)}
                        disabled={isAddDisabled}
                        title={isAddDisabled ? "Only one fee structure allowed" : ""}
                        className={`
                            ${!isAddDisabled ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600' : ''}
                            border-0 h-10 font-medium
                        `}
                    >
                        Add New Fee Structure
                    </Button>
                    {isAddDisabled && (
                        <span className="ml-3 text-red-500 font-medium">
                            Only one fee structure is allowed
                        </span>
                    )}
                </div>

                <Table 
                    columns={columns} 
                    dataSource={feeList} 
                    loading={loading}
                    rowKey="_id"
                    className="custom-table"
                    pagination={false}
                    rowClassName="hover:bg-blue-50 transition-colors"
                    style={{
                        background: 'white',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                />

                <style jsx>{`
                    .background-gradient {
                        background: linear-gradient(to right, #4F46E5, #7C3AED);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                    
                    .custom-table .ant-table-thead > tr > th {
                        background: #f0f0f0;
                        color: #000000;
                        font-weight: 600;
                        border-bottom: 2px solid #e5e7eb;
                    }

                    .custom-table .ant-table-tbody > tr:hover > td {
                        background: #EEF2FF !important;
                    }
                `}</style>
            </div>

            <FeeMetaAdd 
                visible={showAddModal}
                onCancel={() => setShowAddModal(false)}
                onSuccess={() => {
                    setShowAddModal(false);
                    fetchFeeList();
                }}
            />

            {/* <FeeMetaUpdate 
                visible={showUpdateModal}
                onCancel={() => {
                    setShowUpdateModal(false);
                    setSelectedFee(null);
                }}
                onSuccess={() => {
                    setShowUpdateModal(false);
                    setSelectedFee(null);
                    fetchFeeList();
                }}
                feeData={selectedFee}
            /> */}
        </div>
    );
};

export default FeeMeta;
