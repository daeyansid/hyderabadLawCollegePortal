import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Image } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { getAllFeeDetails, deleteFeeDetails } from '../../../../api/feeDetails';
import AddFeeDetail from './AddFeeDetail';
import UpdateFeeDetail from './UpdateFeeDetail';

const FeeDetail = () => {
    const [feeDetails, setFeeDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedFee, setSelectedFee] = useState(null);

    const fetchFeeDetails = async () => {
        setLoading(true);
        try {
            const response = await getAllFeeDetails();
            setFeeDetails(response.data || []);
        } catch (error) {
            message.error('Failed to fetch fee details');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchFeeDetails();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteFeeDetails(id);
            message.success('Fee details deleted successfully');
            fetchFeeDetails();
        } catch (error) {
            message.error('Failed to delete fee details');
        }
    };

    const columns = [
        {
            title: 'Student Name',
            dataIndex: ['studentId', 'name'],
            key: 'studentName'
        },
        {
            title: 'Admission Fee Confirmed',
            dataIndex: 'admissionConfirmationFee',
            key: 'admissionConfirmationFee',
            render: (confirmed) => confirmed ? 'Yes' : 'No'
        },
        {
            title: 'Semester Fees Paid',
            dataIndex: 'semesterFeesPaid',
            key: 'semesterFeesPaid',
            render: (amount) => `Rs. ${amount.toLocaleString()}`
        },
        {
            title: 'Total Dues',
            dataIndex: 'totalDues',
            key: 'totalDues',
            render: (amount) => `Rs. ${amount.toLocaleString()}`
        },
        {
            title: 'Challan',
            dataIndex: 'challanPicture',
            key: 'challanPicture',
            render: (image) => image ? (
                <Image 
                    src={`${process.env.REACT_APP_API_URL}/${image}`}
                    alt="Challan"
                    width={50}
                    preview={true}
                />
            ) : 'No challan'
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button 
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setSelectedFee(record);
                            setShowUpdateModal(true);
                        }}
                    >
                        Edit
                    </Button>
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

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button 
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setShowAddModal(true)}
                >
                    Add New Fee Detail
                </Button>
            </div>

            <Table 
                columns={columns}
                dataSource={feeDetails}
                loading={loading}
                rowKey="_id"
            />

            <AddFeeDetail 
                visible={showAddModal}
                onCancel={() => setShowAddModal(false)}
                onSuccess={() => {
                    setShowAddModal(false);
                    fetchFeeDetails();
                }}
            />

            <UpdateFeeDetail 
                visible={showUpdateModal}
                onCancel={() => {
                    setShowUpdateModal(false);
                    setSelectedFee(null);
                }}
                onSuccess={() => {
                    setShowUpdateModal(false);
                    setSelectedFee(null);
                    fetchFeeDetails();
                }}
                feeData={selectedFee}
            />
        </div>
    );
};

export default FeeDetail;
