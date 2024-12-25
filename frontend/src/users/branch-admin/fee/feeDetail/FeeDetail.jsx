import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Image, Tag, Typography, Card } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, DollarOutlined } from '@ant-design/icons';
import { getAllFeeDetails, deleteFeeDetails } from '../../../../api/feeDetails';
import AddFeeDetail from './AddFeeDetail';
import UpdateFeeDetail from './UpdateFeeDetail';

const { Text, Title } = Typography;

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

    const getStatusColor = (amount, total) => {
        const percentage = (amount / total) * 100;
        if (percentage >= 90) return '#52c41a';
        if (percentage >= 50) return '#faad14';
        return '#f5222d';
    };

    const columns = [
        {
            title: 'Student Name',
            dataIndex: ['studentId', 'fullName'],
            key: 'studentName',
            sorter: (a, b) => a.studentId.fullName.localeCompare(b.studentId.fullName),
            render: (text) => <Text strong style={{ color: '#1890ff' }}>{text}</Text>
        },
        {
            title: 'Roll Number',
            dataIndex: ['studentId', 'rollNumber'],
            key: 'rollNumber',
            render: (text) => <Tag color="purple">{text}</Tag>
        },
        {
            title: 'Semester',
            dataIndex: ['classId', 'className'],
            key: 'semester',
            render: (text) => <Tag color="cyan">{text}</Tag>
        },
        {
            title: 'Semester Fee',
            dataIndex: ['semesterFeesTotal', 'semesterFee'],
            key: 'semesterFee',
            render: (fee) => (
                <Text style={{ color: '#722ed1', fontWeight: 'bold' }}>
                    Rs. {fee.toLocaleString()}
                </Text>
            ),
        },
        {
            title: 'Admission Fee',
            dataIndex: ['totalAdmissionFee', 'admissionFee'],
            key: 'admissionFee',
            render: (fee) => (
                <Text style={{ color: '#13c2c2', fontWeight: 'bold' }}>
                    Rs. {fee.toLocaleString()}
                </Text>
            ),
        },
        {
            title: 'Admission Status',
            dataIndex: 'admissionConfirmationFee',
            key: 'admissionStatus',
            render: (status) => (
                <Tag color={status ? 'success' : 'error'} style={{ fontWeight: 'bold' }}>
                    {status ? '✓ Confirmed' : '⚠ Pending'}
                </Tag>
            ),
        },
        {
            title: 'Paid Amount',
            dataIndex: 'semesterFeesPaid',
            key: 'semesterFeesPaid',
            render: (amount, record) => (
                <Tag color={getStatusColor(amount, record.semesterFeesTotal.semesterFee)} style={{ fontWeight: 'bold' }}>
                    Rs. {amount.toLocaleString()}
                </Tag>
            ),
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
                        style={{ background: '#4096ff' }}
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
        <Card
            title={
                <Space>
                    <DollarOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                    <Title level={3} style={{ margin: 0, color: '#52c41a' }}>Fee Management</Title>
                </Space>
            }
            style={{ 
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
        >
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setShowAddModal(true)}
                style={{ 
                    marginBottom: 16,
                    background: '#52c41a',
                    borderColor: '#52c41a',
                    borderRadius: '6px'
                }}
            >
                Add New Fee Detail
            </Button>

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
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '8px'
                }}
                rowClassName={(record, index) => 
                    index % 2 === 0 ? 'even-row' : 'odd-row'
                }
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
        </Card>
    );
};

// Add these styles to your CSS
const styles = `
.even-row {
    background-color: #fafafa;
}
.odd-row {
    background-color: #fff;
}
.ant-table-thead > tr > th {
    background: #f0f5ff;
    color: #1890ff;
    font-weight: bold;
}
.ant-table-tbody > tr:hover > td {
    background: #e6f7ff !important;
}
`;

export default FeeDetail;