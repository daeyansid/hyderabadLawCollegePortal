import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Card, Tag, Typography, Select, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, FilterOutlined } from '@ant-design/icons';
import { getAllTests, deleteTest } from '../../../api/testManagment';
import { fetchClasses } from '../../../api/classApi';
import AddTestManagment from './AddTestManagment';

const { Title } = Typography;
const { Option } = Select;

const TestManagement = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTest, setEditingTest] = useState(null);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [filteredTests, setFilteredTests] = useState([]);

    const years = Array.from(new Array(5), (val, index) => new Date().getFullYear() - index);

    const fetchTests = async () => {
        setLoading(true);
        try {
            const response = await getAllTests();
            // console.log(response.data);
            setTests(response.data);
        } catch (error) {
            console.error('Error fetching tests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTests();
        fetchClassesData();
    }, []);

    useEffect(() => {
        filterTests();
    }, [tests, selectedClass, selectedYear]);

    const fetchClassesData = async () => {
        try {
            const branchId = localStorage.getItem('branchId');
            const response = await fetchClasses(branchId);
            setClasses(response.data);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const filterTests = () => {
        let filtered = [...tests];

        if (selectedClass) {
            filtered = filtered.filter(test => test.classId._id === selectedClass);
        }

        if (selectedYear) {
            filtered = filtered.filter(test => {
                const testYear = new Date(test.createdAt).getFullYear();
                return testYear === selectedYear;
            });
        }

        setFilteredTests(filtered);
    };

    const handleReset = () => {
        setSelectedClass(null);
        setSelectedYear(null);
    };

    const handleEdit = (record) => {
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
            <Row gutter={[16, 16]} className="mb-4">
                {/* Filter by Class */}
                <Col xs={24} sm={12} lg={6}>
                    <Select
                        placeholder="Filter by Class"
                        className="w-full"
                        value={selectedClass}
                        onChange={setSelectedClass}
                        allowClear
                    >
                        {classes.map(cls => (
                            <Option key={cls._id} value={cls._id}>
                                {cls.className}
                            </Option>
                        ))}
                    </Select>
                </Col>

                {/* Filter by Year */}
                <Col xs={24} sm={12} lg={6}>
                    <Select
                        placeholder="Filter by Year"
                        className="w-full"
                        value={selectedYear}
                        onChange={setSelectedYear}
                        allowClear
                    >
                        {years.map(year => (
                            <Option key={year} value={year}>
                                {year}
                            </Option>
                        ))}
                    </Select>
                </Col>

                {/* Reset Filters Button */}
                <Col xs={24} sm={12} lg={6}>
                    <Button
                        icon={<FilterOutlined />}
                        onClick={handleReset}
                        className="w-full sm:w-auto"
                    >
                        Reset Filters
                    </Button>
                </Col>

                {/* Add New Test Record Button */}
                <Col xs={24} sm={12} lg={6} className="text-right">
                    <Button
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setEditingTest(null);
                            setIsModalVisible(true);
                        }}
                        className="bg-green-500 border-green-500 text-white rounded-lg"
                    >
                        Add New Test Record
                    </Button>
                </Col>
            </Row>


            <Table
                columns={columns}
                dataSource={filteredTests}
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