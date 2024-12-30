import React, { useState, useEffect } from 'react';
import { checkExistingAttendance, createAttendance, updateAttendance } from '../../../../api/teacherAttendance';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, DatePicker, Select, Button, Card, message, Spin, Typography } from 'antd';
import { LoadingOutlined, CalendarOutlined, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

function TakeAttendance() {
    const [form] = Form.useForm(); // Initialize the form instance

    const [existingAttendance, setExistingAttendance] = useState(null);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const teacherId = location.state?.teacherId;
    const classId = location.state?.classId;
    const slotId = location.state?.slotId;
    const teacherName = location.state?.teacherName;
    const subjectId = location.state?.subjectId;
    const slotName = location.state?.slotName;

    const [attendanceData, setAttendanceData] = useState({
        teacherId: teacherId,
        classId: classId,
        slotId: slotId,
        date: dayjs().format('YYYY-MM-DD'),
        attendanceStatus: '',
        staffStatus: 'Teacher',
        month: dayjs().month() + 1,
        year: dayjs().year()
    });

    useEffect(() => {
        setAttendanceData(prev => ({
            ...prev,
            teacherId,
            classId,
            slotId
        }));
        checkExisting();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teacherId, classId, slotId, attendanceData.date]);

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    const checkExisting = async () => {
        try {
            setLoading(true);
            const result = await checkExistingAttendance(
                teacherId,
                classId,
                slotId,
                attendanceData.date
            );
            console.log("result", result);
            if (result.exists) {
                setExistingAttendance(result.attendance);
                message.info('Attendance record exists for this date. You can update it.');
                setAttendanceData(prev => ({
                    ...prev,
                    attendanceStatus: result.attendance.attendanceStatus
                }));
                // Update the form field with the existing attendance status
                form.setFieldsValue({
                    attendanceStatus: result.attendance.attendanceStatus
                });
            } else {
                setExistingAttendance(null);
                // Reset the attendanceStatus field in the form
                form.setFieldsValue({
                    attendanceStatus: undefined
                });
            }
        } catch (error) {
            message.error(error.message || 'Error checking attendance');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const submissionData = {
                ...attendanceData,
                attendanceStatus: values.attendanceStatus
            };
            if (existingAttendance) {
                await updateAttendance(existingAttendance._id, submissionData);
                message.success('Attendance updated successfully');
                checkExisting();
            } else {
                const addAttendance = await createAttendance(submissionData);
                if(addAttendance === 201) message.success('Attendance marked successfully');
                checkExisting();
            }
        } catch (error) {
            message.error(error.message || 'Error marking attendance');
        } finally {
            setLoading(false);
        }
    };

    const statusColors = {
        Present: '#52c41a',
        Absent: '#ff4d4f',
        Leave: '#faad14'
    };

    return (
        <div>
            <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate(-1)}
                className="mb-4"
            >
                Back
            </Button>
            <Spin spinning={loading} indicator={antIcon}>
                <Card 
                    className="mx-auto max-w-2xl shadow-lg"
                    title={
                        <Title level={3} className="text-center text-gradient">
                            {existingAttendance ? 'Update Attendance' : 'Mark Attendance'}
                        </Title>
                    }
                >
                    <Form
                        form={form} // Attach the form instance
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{
                            date: dayjs(attendanceData.date),
                            attendanceStatus: attendanceData.attendanceStatus
                        }}
                    >
                        <Form.Item
                            label="Date"
                            name="date"
                            rules={[{ required: true, message: 'Please select a date!' }]}
                        >
                            <DatePicker 
                                className="w-full"
                                format="YYYY-MM-DD"
                                onChange={(date) => {
                                    if (date) {
                                        const formattedDate = date.format('YYYY-MM-DD');
                                        setAttendanceData(prev => ({
                                            ...prev,
                                            date: formattedDate,
                                            month: date.month() + 1,
                                            year: date.year(),
                                            attendanceStatus: '' // Clear the attendance status
                                        }));
                                        // Reset the attendanceStatus field in the form
                                        form.setFieldsValue({
                                            attendanceStatus: undefined
                                        });
                                        checkExisting(); // Fetch attendance for the new date
                                    }
                                }}
                                prefix={<CalendarOutlined />} // This might not work as DatePicker doesn't support prefix
                            />
                        </Form.Item>

                        <Form.Item
                            label="Attendance Status"
                            name="attendanceStatus"
                            rules={[{ required: true, message: 'Please select attendance status!' }]}
                        >
                            <Select
                                placeholder="Select Status"
                                onChange={(value) => setAttendanceData(prev => ({
                                    ...prev,
                                    attendanceStatus: value
                                }))}
                                // Removed the prefix prop as it's not valid for Select
                                // value is managed by the form, so no need to set it here
                                dropdownRender={menu => (
                                    <div style={{ background: '#fff' }}>
                                        {menu}
                                    </div>
                                )}
                            >
                                <Option value="Present">
                                    <span style={{ color: statusColors.Present }}>● </span>
                                    Present
                                </Option>
                                <Option value="Absent">
                                    <span style={{ color: statusColors.Absent }}>● </span>
                                    Absent
                                </Option>
                                <Option value="Leave">
                                    <span style={{ color: statusColors.Leave }}>● </span>
                                    Leave
                                </Option>
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Button 
                                type="primary" 
                                htmlType="submit"
                                block
                                loading={loading}
                                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                            >
                                {existingAttendance ? 'Update Attendance' : 'Mark Attendance'}
                            </Button>
                        </Form.Item>
                    </Form>

                    <div className="mt-4">
                        <Card className="bg-gray-50">
                            <p><strong>Teacher:</strong> {teacherName}</p>
                            <p><strong>Slot:</strong> {slotName}</p>
                        </Card>
                    </div>
                </Card>
            </Spin>
            <style jsx>{`
                .ant-select-item-option-content {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
            `}</style>
        </div>
    );
}

export default TakeAttendance;
