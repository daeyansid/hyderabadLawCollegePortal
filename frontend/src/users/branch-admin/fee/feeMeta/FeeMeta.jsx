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
            render: (fee) => `Rs. ${fee.toLocaleString()}`
        },
        {
            title: 'Admission Fee',
            dataIndex: 'admissionFee',
            key: 'admissionFee',
            render: (fee) => `Rs. ${fee.toLocaleString()}`
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    {/* <Button 
                        type="primary" 
                        icon={<EditOutlined />}
                        onClick={() => {
                            setSelectedFee(record);
                            setShowUpdateModal(true);
                        }}
                    >
                        Edit
                    </Button> */}
                    <Button 
                        danger 
                        icon={<DeleteOutlined />}
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
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => setShowAddModal(true)}
                    disabled={isAddDisabled}
                    title={isAddDisabled ? "Only one fee structure allowed" : ""}
                >
                    Add New Fee Structure
                </Button>
                {isAddDisabled && (
                    <span style={{ marginLeft: 8, color: 'red' }}>
                        Only one fee structure is allowed
                    </span>
                )}
            </div>

            <Table 
                columns={columns} 
                dataSource={feeList} 
                loading={loading}
                rowKey="_id"
            />

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
