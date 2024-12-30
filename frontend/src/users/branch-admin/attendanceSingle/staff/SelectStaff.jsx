import React, { useEffect, useState } from 'react';
import { fetchTeachers } from '../../../../api/teacherApi';
import { getAttendanceCount } from '../../../../api/teacherAttendance';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Button, Input, Select, Row, Col, Statistic } from 'antd';

const { Search } = Input;

const SelectTeacher = () => {
    const [teachers, setTeachers] = useState([]);
    const [filteredTeachers, setFilteredTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [attendanceStats, setAttendanceStats] = useState(null);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [teacherStats, setTeacherStats] = useState({});
    const navigate = useNavigate();

    const months = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' }
    ];

    const years = Array.from({ length: 5 }, (_, i) => {
        const year = new Date().getFullYear() - 2 + i;
        return { value: year, label: year.toString() };
    });

    useEffect(() => {
        const getTeachers = async () => {
            try {
                const response = await fetchTeachers();
                setTeachers(response.data);
                setFilteredTeachers(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching teachers:', error);
                setLoading(false);
            }
        };
        getTeachers();
    }, []);

    useEffect(() => {
        const fetchAttendanceStats = async () => {
            if (selectedTeacher) {
                try {
                    const stats = await getAttendanceCount(selectedTeacher, selectedMonth, selectedYear);
                    setAttendanceStats(stats);
                } catch (error) {
                    console.error('Error fetching attendance stats:', error);
                }
            }
        };
        fetchAttendanceStats();
    }, [selectedTeacher, selectedMonth, selectedYear]);

    useEffect(() => {
        const fetchAllTeachersStats = async () => {
            const stats = {};
            for (const teacher of teachers) {
                try {
                    const teacherStats = await getAttendanceCount(
                        teacher._id,
                        selectedMonth,
                        selectedYear
                    );
                    stats[teacher._id] = teacherStats;
                } catch (error) {
                    console.error(`Error fetching stats for teacher ${teacher._id}:`, error);
                }
            }
            setTeacherStats(stats);
        };

        if (teachers.length > 0) {
            fetchAllTeachersStats();
        }
    }, [teachers, selectedMonth, selectedYear]);

    const handleSearch = (value) => {
        const filtered = teachers.filter(teacher => 
            teacher.fullName.toLowerCase().includes(value.toLowerCase()) ||
            teacher.userId.email.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredTeachers(filtered);
    };

    const columns = [
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: ['userId', 'email'],
            key: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Present',
            key: 'present',
            render: (_, record) => teacherStats[record._id]?.Present || 0,
        },
        {
            title: 'Absent',
            key: 'absent',
            render: (_, record) => teacherStats[record._id]?.Absent || 0,
        },
        {
            title: 'Leave',
            key: 'leave',
            render: (_, record) => teacherStats[record._id]?.Leave || 0,
        },
        {
            title: 'Total Working Days',
            key: 'total',
            render: (_, record) => teacherStats[record._id]?.total || 0,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button 
                    type="primary"
                    onClick={() => navigate('/branch-admin/attendance/staff/assigned-classes-attendance', {
                        state: { teacherId: record._id, teacherName: record.fullName }
                    })}
                >
                    Select
                </Button>
            ),
        },
    ];

    return (
        <Card 
            title="Select Teacher for Attendance"
            loading={loading}
            headStyle={{ backgroundColor: '#1890ff', color: 'white' }}
        >
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Search
                        placeholder="Search by name or email"
                        onSearch={handleSearch}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ marginBottom: 16 }}
                    />
                </Col>
                <Col span={8}>
                    <Select
                        style={{ width: '100%' }}
                        value={selectedMonth}
                        onChange={setSelectedMonth}
                        options={months}
                    />
                </Col>
                <Col span={8}>
                    <Select
                        style={{ width: '100%' }}
                        value={selectedYear}
                        onChange={setSelectedYear}
                        options={years}
                    />
                </Col>
            </Row>

            {attendanceStats && (
                <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={6}>
                        <Card style={{ backgroundColor: '#f6ffed' }}>
                            <Statistic 
                                title="Present" 
                                value={attendanceStats.Present}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card style={{ backgroundColor: '#fff2f0' }}>
                            <Statistic 
                                title="Absent" 
                                value={attendanceStats.Absent}
                                valueStyle={{ color: '#ff4d4f' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card style={{ backgroundColor: '#e6f7ff' }}>
                            <Statistic 
                                title="Leave" 
                                value={attendanceStats.Leave}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card style={{ backgroundColor: '#f9f0ff' }}>
                            <Statistic 
                                title="Total Working Days" 
                                value={attendanceStats.total}
                                valueStyle={{ color: '#722ed1' }}
                            />
                        </Card>
                    </Col>
                </Row>
            )}

            <Table 
                columns={columns}
                dataSource={filteredTeachers}
                rowKey="_id"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    position: ['bottomCenter'],
                }}
                onRow={(record) => ({
                    onClick: () => {
                        setSelectedTeacher(record._id);
                    },
                    style: {
                        cursor: 'pointer',
                        backgroundColor: selectedTeacher === record._id ? '#e6f7ff' : 'inherit',
                    }
                })}
            />
        </Card>
    );
};

export default SelectTeacher;