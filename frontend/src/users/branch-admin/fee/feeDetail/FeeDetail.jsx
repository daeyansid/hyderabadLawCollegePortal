import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Image, Tag, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { getAllFeeDetails, deleteFeeDetails } from '../../../../api/feeDetails';
import AddFeeDetail from './AddFeeDetail';
import UpdateFeeDetail from './UpdateFeeDetail';

const { Text } = Typography;

const FeeDetail = () => {
    const [feeDetails, setFeeDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedFee, setSelectedFee] = useState(null);
    const [selectedFeeId, setSelectedFeeId] = useState(null);

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
            dataIndex: ['studentId', 'fullName'],
            key: 'studentName',
            sorter: (a, b) => a.studentId.fullName.localeCompare(b.studentId.fullName),
        },
        {
            title: 'Roll Number',
            dataIndex: ['studentId', 'rollNumber'],
            key: 'rollNumber',
        },
        {
            title: 'Semester',
            dataIndex: ['classId', 'className'],
            key: 'semester',
        },
        {
            title: 'Semester Fee',
            dataIndex: ['semesterFeesTotal', 'semesterFee'],
            key: 'semesterFee',
            render: (fee) => `Rs. ${fee.toLocaleString()}`,
        },
        {
            title: 'Admission Fee',
            dataIndex: ['totalAdmissionFee', 'admissionFee'],
            key: 'admissionFee',
            render: (fee) => `Rs. ${fee.toLocaleString()}`,
        },
        {
            title: 'Admission Status',
            dataIndex: 'admissionConfirmationFee',
            key: 'admissionStatus',
            render: (status) => (
                <Tag color={status ? 'success' : 'error'}>
                    {status ? 'Confirmed' : 'Pending'}
                </Tag>
            ),
        },
        {
            title: 'Paid Amount',
            dataIndex: 'semesterFeesPaid',
            key: 'semesterFeesPaid',
            render: (amount) => `Rs. ${amount.toLocaleString()}`,
        },
        {
            title: 'Discount',
            dataIndex: 'discount',
            key: 'discount',
            render: (amount) => `Rs. ${amount.toLocaleString()}`,
        },
        {
            title: 'Late Fee',
            dataIndex: 'lateFeeSurcharged',
            key: 'lateFee',
            render: (amount) => `Rs. ${amount.toLocaleString()}`,
        },
        {
            title: 'Other Penalties',
            dataIndex: 'otherPenalties',
            key: 'otherPenalties',
            render: (amount) => `Rs. ${amount.toLocaleString()}`,
        },
        {
            title: 'Challan',
            dataIndex: 'challanPicture',
            key: 'challan',
            render: (image) =>
                image ? (
                    <Image
                        src={`${process.env.REACT_APP_API_URL}/${image}`}
                        alt="Challan"
                        width={50}
                        preview={true}
                    />
                ) : (
                    'No challan'
                ),
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
                            setSelectedFeeId(record._id);
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
            ),
        },
    ];

    const tableSummary = (pageData) => {
        const totalPaid = pageData.reduce((sum, record) => sum + record.semesterFeesPaid, 0);
        const totalDiscount = pageData.reduce((sum, record) => sum + record.discount, 0);
        const totalLateFee = pageData.reduce((sum, record) => sum + record.lateFeeSurcharged, 0);
        const totalPenalties = pageData.reduce((sum, record) => sum + record.otherPenalties, 0);

        return (
            <Table.Summary fixed>
                <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={6}>
                        Total
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={6}>
                        <Text type="success">Rs. {totalPaid.toLocaleString()}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={7}>
                        <Text type="warning">Rs. {totalDiscount.toLocaleString()}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={8}>
                        <Text type="danger">Rs. {totalLateFee.toLocaleString()}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={9}>
                        <Text type="danger">Rs. {totalPenalties.toLocaleString()}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={10} colSpan={2} />
                </Table.Summary.Row>
            </Table.Summary>
        );
    };

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
                summary={tableSummary}
                scroll={{ x: true }}
                pagination={{
                    defaultPageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} records`,
                }}
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
                    setSelectedFeeId(null);
                }}
                onSuccess={() => {
                    setShowUpdateModal(false);
                    setSelectedFeeId(null);
                    fetchFeeDetails();
                }}
                selectedId={selectedFeeId}
            />
        </div>
    );
};

export default FeeDetail;