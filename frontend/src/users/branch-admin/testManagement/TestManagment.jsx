import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Card, Tag, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { getAllTests, deleteTest } from '../../../api/testManagment';
import AddTestManagment from './AddTestManagment';

const { Title } = Typography;

const TestManagement = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTest, setEditingTest] = useState(null);

    const fetchTests = async () => {
        setLoading(true);
        try {
            const response = await getAllTests();
            console.log(response.data);
            setTests(response.data);
        } catch (error) {
            console.error('Error fetching tests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTests();
    }, []);

    const handleEdit = (record) => {
        // Make sure you're passing the complete record with populated references
        console.log('Editing record:', record); // Add this for debugging
        setEditingTest({
            _id: record._id,
            studentId: record.studentId,
            classId: record.classId,
            subjectId: record.subjectId,
            midTermPaperMarks: record.midTermPaperMarks,
            assignmentPresentationMarks: record.assignmentPresentationMarks,
            attendanceMarks: record.attendanceMarks
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteTest(id);
            fetchTests();
        } catch (error) {
            console.error('Error deleting test:', error);
        }
    };

    const getGradeColor = (marks) => {
        if (marks >= 35) return 'green';
        if (marks >= 25) return 'blue';
        if (marks >= 20) return 'orange';
        return 'red';
    };

    const columns = [
        {
            title: 'Student Name',
            dataIndex: ['studentId', 'fullName'],
            key: 'studentName',
            render: (text) => <span style={{ color: '#1890ff', fontWeight: 500 }}>{text}</span>
        },
        {
            title: 'Semester',
            dataIndex: ['classId', 'className'],
            key: 'className',
            render: (text) => <Tag color="purple">{text}</Tag>
        },
        {
            title: 'Subject',
            dataIndex: ['subjectId', 'subjectName'],
            key: 'subjectName',
            render: (text) => <Tag color="cyan">{text}</Tag>
        },
        {
            title: 'Mid Term Paper',
            dataIndex: 'midTermPaperMarks',
            key: 'midTermPaperMarks',
            render: (marks) => (
                <Tag color={marks >= 15 ? 'green' : marks >= 10 ? 'orange' : 'red'}>
                    {marks}/20
                </Tag>
            )
        },
        {
            title: 'Assignment',
            dataIndex: 'assignmentPresentationMarks',
            key: 'assignmentPresentationMarks',
            render: (marks) => (
                <Tag color={marks >= 7 ? 'green' : marks >= 5 ? 'orange' : 'red'}>
                    {marks}/10
                </Tag>
            )
        },
        {
            title: 'Attendance',
            dataIndex: 'attendanceMarks',
            key: 'attendanceMarks',
            render: (marks) => (
                <Tag color={marks >= 7 ? 'green' : marks >= 5 ? 'orange' : 'red'}>
                    {marks}/10
                </Tag>
            )
        },
        {
            title: 'Total Marks',
            key: 'totalMarks',
            render: (_, record) => {
                const total = record.midTermPaperMarks + 
                            record.assignmentPresentationMarks + 
                            record.attendanceMarks;
                return (
                    <Tag color={getGradeColor(total)} style={{ fontWeight: 'bold' }}>
                        {total}/40
                    </Tag>
                );
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button 
                        type="primary" 
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        style={{ background: '#4096ff' }}
                    >
                        Edit
                    </Button>
                    <Button 
                        type="primary" 
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
        <Card 
            title={<Title level={3} style={{ color: '#1890ff', margin: 0 }}>Test Management</Title>}
            style={{ 
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
        >
            <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => {
                    setEditingTest(null);
                    setIsModalVisible(true);
                }}
                style={{ 
                    marginBottom: 16,
                    background: '#52c41a',
                    borderColor: '#52c41a',
                    borderRadius: '6px'
                }}
            >
                Add New Test Record
            </Button>
            
            <Table 
                columns={columns} 
                dataSource={tests} 
                loading={loading}
                rowKey="_id"
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '8px'
                }}
                pagination={{
                    style: { marginTop: '16px' },
                    pageSize: 10
                }}
            />

            <AddTestManagment
                visible={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingTest(null);
                }}
                onSuccess={() => {
                    setIsModalVisible(false);
                    setEditingTest(null);
                    fetchTests();
                }}
                editingTest={editingTest}
            />
        </Card>
    );
};

export default TestManagement;