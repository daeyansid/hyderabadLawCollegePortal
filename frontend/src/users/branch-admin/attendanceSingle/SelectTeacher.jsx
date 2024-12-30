import React, { useEffect, useState } from 'react';
import { fetchTeachers } from '../../../api/teacherApi';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Button } from 'antd';

const SelectTeacher = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getTeachers = async () => {
            try {
                const response = await fetchTeachers();
                setTeachers(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching teachers:', error);
                setLoading(false);
            }
        };
        getTeachers();
    }, []);

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
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button 
                    type="primary"
                    onClick={() => navigate('/branch-admin/attendance/assigned-classes-attendance-single', {
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
            title="Select Teacher Take/View/Edit for Student Attendance"
            loading={loading}
        >
            <Table 
                columns={columns}
                dataSource={teachers}
                rowKey="_id"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    position: ['bottomCenter'],
                }}
            />
        </Card>
    );
};

export default SelectTeacher;
