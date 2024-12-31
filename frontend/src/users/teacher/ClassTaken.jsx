// src/components/ClassTaken.jsx

import React, { useState, useEffect } from 'react';
import { Card, Select, Row, Col, Statistic, Spin } from 'antd';
import { getAttendanceCount } from '../../api/teacherAttendance';

const { Option } = Select;

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

    // Responsive styles using CSS-in-JS approach
    const styles = {
        cardHeader: {
            backgroundColor: '#1890ff',
            color: 'white',
            padding: '16px',
            borderRadius: '8px 8px 0 0',
        },
        selectContainer: {
            marginTop: '16px',
            marginBottom: '16px',
        },
        statisticCard: {
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            textAlign: 'center',
            padding: '24px',
            backgroundColor: '#ffffff',
        },
    };

    return (
        <Card 
            title={<div style={styles.cardHeader}><h2 style={{ margin: 0 }}>My Attendance Statistics</h2></div>} 
            bordered={false} 
            style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        >
            {/* Responsive Selects */}
            <Row gutter={[16, 16]} style={styles.selectContainer}>
                <Col xs={24} sm={12}>
                    <Select
                        style={{ width: '100%' }}
                        value={selectedMonth}
                        onChange={setSelectedMonth}
                        placeholder="Select Month"
                    >
                        {months.map(month => (
                            <Option key={month.value} value={month.value}>
                                {month.label}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col xs={24} sm={12}>
                    <Select
                        style={{ width: '100%' }}
                        value={selectedYear}
                        onChange={setSelectedYear}
                        placeholder="Select Year"
                    >
                        {years.map(year => (
                            <Option key={year.value} value={year.value}>
                                {year.label}
                            </Option>
                        ))}
                    </Select>
                </Col>
            </Row>

            {/* Loading Spinner */}
            <Spin spinning={loading} tip="Loading statistics...">
                {/* Responsive Statistic Cards */}
                {stats && (
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={6}>
                            <Card style={styles.statisticCard}>
                                <Statistic 
                                    title="Present Days" 
                                    value={stats.Present}
                                    valueStyle={{ color: '#52c41a' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card style={styles.statisticCard}>
                                <Statistic 
                                    title="Absent Days" 
                                    value={stats.Absent}
                                    valueStyle={{ color: '#ff4d4f' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card style={styles.statisticCard}>
                                <Statistic 
                                    title="Leave Days" 
                                    value={stats.Leave}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card style={styles.statisticCard}>
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