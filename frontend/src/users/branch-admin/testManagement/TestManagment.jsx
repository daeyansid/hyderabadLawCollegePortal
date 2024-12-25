import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Card } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllTests, deleteTest } from '../../../api/testManagment';
import AddTestManagment from './AddTestManagment';

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
        setEditingTest(record);
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

    const columns = [
        {
            title: 'Student Name',
            dataIndex: ['studentId', 'fullName'],
            key: 'studentName'
        },
        {
            title: 'Class',
            dataIndex: ['classId', 'className'],
            key: 'className'
        },
        {
            title: 'Mid Term Paper',
            dataIndex: 'midTermPaperMarks',
            key: 'midTermPaperMarks'
        },
        {
            title: 'Assignment',
            dataIndex: 'assignmentPresentationMarks',
            key: 'assignmentPresentationMarks'
        },
        {
            title: 'Attendance',
            dataIndex: 'attendanceMarks',
            key: 'attendanceMarks'
        },
        {
            title: 'Total Marks',
            key: 'totalMarks',
            render: (_, record) => (
                record.midTermPaperMarks + 
                record.assignmentPresentationMarks + 
                record.attendanceMarks
            )
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
        <Card title="Test Management">
            <Button 
                type="primary" 
                onClick={() => {
                    setEditingTest(null);
                    setIsModalVisible(true);
                }}
                style={{ marginBottom: 16 }}
            >
                Add New Test Record
            </Button>
            
            <Table 
                columns={columns} 
                dataSource={tests} 
                loading={loading}
                rowKey="_id"
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