import React, { useState, useEffect } from 'react';
import { Card, Select, Row, Col, Statistic, Spin } from 'antd';
import { getAttendanceCount } from '../../api/teacherAttendance';

const ClassTaken = () => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);

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
        const fetchStats = async () => {
            try {
                setLoading(true);
                const teacherId = localStorage.getItem('adminSelfId');
                if (!teacherId) {
                    throw new Error('Teacher ID not found');
                }
                const response = await getAttendanceCount(teacherId, selectedMonth, selectedYear);
                setStats(response);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [selectedMonth, selectedYear]);

    return (
        <Card title="My Attendance Statistics" headStyle={{ backgroundColor: '#1890ff', color: 'white' }}>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Select
                        style={{ width: '100%' }}
                        value={selectedMonth}
                        onChange={setSelectedMonth}
                        options={months}
                    />
                </Col>
                <Col span={12}>
                    <Select
                        style={{ width: '100%' }}
                        value={selectedYear}
                        onChange={setSelectedYear}
                        options={years}
                    />
                </Col>
            </Row>

            <Spin spinning={loading}>
                {stats && (
                    <Row gutter={16} style={{ marginTop: 16 }}>
                        <Col span={6}>
                            <Card style={{ backgroundColor: '#f6ffed' }}>
                                <Statistic 
                                    title="Present Days" 
                                    value={stats.Present}
                                    valueStyle={{ color: '#52c41a' }}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card style={{ backgroundColor: '#fff2f0' }}>
                                <Statistic 
                                    title="Absent Days" 
                                    value={stats.Absent}
                                    valueStyle={{ color: '#ff4d4f' }}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card style={{ backgroundColor: '#e6f7ff' }}>
                                <Statistic 
                                    title="Leave Days" 
                                    value={stats.Leave}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card style={{ backgroundColor: '#f9f0ff' }}>
                                <Statistic 
                                    title="Total Working Days" 
                                    value={stats.total}
                                    valueStyle={{ color: '#722ed1' }}
                                />
                            </Card>
                        </Col>
                    </Row>
                )}
            </Spin>
        </Card>
    );
};

export default ClassTaken;