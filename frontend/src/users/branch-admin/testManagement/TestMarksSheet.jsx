import React, { useState, useEffect } from 'react';
import { Card, Select, Table, Typography, Space, Row, Col, Tag, Empty } from 'antd';
import { BookOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { fetchClasses } from '../../../api/classApi';
import { fetchStudentsBySemester } from '../../../api/studentApi';
import { getAllTests } from '../../../api/testManagment';

const { Title, Text } = Typography;
const { Option } = Select;

function TestMarksSheet() {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [tests, setTests] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const years = Array.from(new Array(5), (val, index) => new Date().getFullYear() - index);

    useEffect(() => {
        fetchClassesData();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            fetchStudents();
            resetFilters(['student']);
        }
    }, [selectedClass]);

    useEffect(() => {
        if (allFiltersSelected()) {
            fetchTestData();
        } else {
            setTests([]);
        }
    }, [selectedClass, selectedStudent, selectedYear]);

    const resetFilters = (fields) => {
        if (fields.includes('student')) {
            setSelectedStudent(null);
        }
        setTests([]);
    };

    const allFiltersSelected = () => {
        return selectedClass && selectedStudent && selectedYear;
    };

    const fetchClassesData = async () => {
        try {
            const branchId = localStorage.getItem('branchId');
            const response = await fetchClasses(branchId);
            setClasses(response.data);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const fetchStudents = async () => {
        try {
            const studentsRes = await fetchStudentsBySemester(selectedClass);
            setStudents(studentsRes);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const fetchTestData = async () => {
        if (!allFiltersSelected()) return;

        setLoading(true);
        try {
            const response = await getAllTests();
            let filteredData = response.data.filter(test => 
                test.classId._id === selectedClass &&
                test.studentId._id === selectedStudent &&
                new Date(test.createdAt).getFullYear() === selectedYear &&
                !test.IsDelete
            );

            setTests(filteredData);
        } catch (error) {
            console.error('Error fetching tests:', error);
        } finally {
            setLoading(false);
        }
    };

    const getGradeColor = (marks, total) => {
        const percentage = (marks / total) * 100;
        if (percentage >= 85) return 'green';
        if (percentage >= 70) return 'blue';
        if (percentage >= 50) return 'orange';
        return 'red';
    };

    const columns = [
        {
            title: 'Student Name',
            dataIndex: ['studentId', 'fullName'],
            key: 'studentName',
            fixed: 'left',
            render: (text) => <Text strong style={{ color: '#1890ff' }}>{text}</Text>
        },
        {
            title: 'Subject',
            dataIndex: ['subjectId', 'subjectName'],
            key: 'subject',
            render: (text) => <Tag color="cyan">{text}</Tag>
        },
        {
            title: 'Mid Term (20)',
            dataIndex: 'midTermPaperMarks',
            key: 'midTerm',
            render: (marks) => (
                <Tag color={getGradeColor(marks, 20)}>{marks}/20</Tag>
            )
        },
        {
            title: 'Assignment (10)',
            dataIndex: 'assignmentPresentationMarks',
            key: 'assignment',
            render: (marks) => (
                <Tag color={getGradeColor(marks, 10)}>{marks}/10</Tag>
            )
        },
        {
            title: 'Attendance (10)',
            dataIndex: 'attendanceMarks',
            key: 'attendance',
            render: (marks) => (
                <Tag color={getGradeColor(marks, 10)}>{marks}/10</Tag>
            )
        },
        {
            title: 'Total (40)',
            key: 'total',
            render: (_, record) => {
                const total = record.midTermPaperMarks + 
                            record.assignmentPresentationMarks + 
                            record.attendanceMarks;
                return (
                    <Tag color={getGradeColor(total, 40)} style={{ fontWeight: 'bold' }}>
                        {total}/40
                    </Tag>
                );
            }
        }
    ];

    const calculateSummary = (data) => {
        // Calculate grand totals
        const grandTotals = data.reduce((acc, record) => {
            acc.midTerm += record.midTermPaperMarks;
            acc.assignment += record.assignmentPresentationMarks;
            acc.attendance += record.attendanceMarks;
            acc.total += (
                record.midTermPaperMarks + 
                record.assignmentPresentationMarks + 
                record.attendanceMarks
            );
            return acc;
        }, {
            midTerm: 0,
            assignment: 0,
            attendance: 0,
            total: 0
        });

        return (
            <Table.Summary.Row style={{ 
                backgroundColor: '#f0f5ff',
                fontWeight: 'bold'
            }}>
                <Table.Summary.Cell index={0} colSpan={2}>
                    <Text strong type="primary">Grand Total</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                    <Tag color="blue" style={{ fontWeight: 'bold' }}>
                        {grandTotals.midTerm}/{data.length * 20}
                    </Tag>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                    <Tag color="blue" style={{ fontWeight: 'bold' }}>
                        {grandTotals.assignment}/{data.length * 10}
                    </Tag>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                    <Tag color="blue" style={{ fontWeight: 'bold' }}>
                        {grandTotals.attendance}/{data.length * 10}
                    </Tag>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                    <Tag color="green" style={{ fontWeight: 'bold' }}>
                        {grandTotals.total}/{data.length * 40}
                    </Tag>
                </Table.Summary.Cell>
            </Table.Summary.Row>
        );
    };

    return (
        <Card 
            title={<Title level={3} style={{ color: '#1890ff' }}>Test Marks Sheet</Title>}
            style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        >
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Text><BookOutlined /> Select Class</Text>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Select Class"
                            onChange={(value) => {
                                setSelectedClass(value);
                            }}
                            value={selectedClass}
                        >
                            {classes.map(cls => (
                                <Option key={cls._id} value={cls._id}>{cls.className}</Option>
                            ))}
                        </Select>
                    </Space>
                </Col>
                <Col span={8}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Text><UserOutlined /> Select Student</Text>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Select Student"
                            onChange={setSelectedStudent}
                            value={selectedStudent}
                            disabled={!selectedClass}
                        >
                            {students.map(student => (
                                <Option key={student._id} value={student._id}>
                                    {student.fullName}
                                </Option>
                            ))}
                        </Select>
                    </Space>
                </Col>
                <Col span={8}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Text><CalendarOutlined /> Select Year</Text>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Select Year"
                            onChange={setSelectedYear}
                            value={selectedYear}
                        >
                            {years.map(year => (
                                <Option key={year} value={year}>{year}</Option>
                            ))}
                        </Select>
                    </Space>
                </Col>
            </Row>

            {!allFiltersSelected() ? (
                <Empty 
                    description="Please select all filters to view test data"
                    style={{ margin: '40px 0' }}
                />
            ) : (
                <Table
                    columns={columns}
                    dataSource={tests}
                    loading={loading}
                    rowKey="_id"
                    pagination={false}
                    summary={calculateSummary}
                    style={{ marginTop: 16 }}
                    scroll={{ x: 'max-content' }}
                />
            )}
        </Card>
    );
}

export default TestMarksSheet;