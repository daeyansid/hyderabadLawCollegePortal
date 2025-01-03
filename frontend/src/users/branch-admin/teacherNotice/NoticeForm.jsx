import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Select, Switch, Button, message } from 'antd';
import { fetchTeachers } from '../../../api/teacherApi';
import { createTeacherNotice, updateTeacherNotice } from '../../../api/tecaherNotice';
import moment from 'moment';

const { TextArea } = Input;

function NoticeForm({ notice, onSuccess }) {
    const [form] = Form.useForm();
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadTeachers();
        if (notice) {
            form.setFieldsValue({
                ...notice,
                date: moment(notice.date),
                assignedTeachers: notice.assignedTeachers?.map(t => t._id)
            });
        }
    }, [notice, form]);

    const loadTeachers = async () => {
        try {
            const data = await fetchTeachers();
            // console.log("data" , data);
            setTeachers(data.data);
        } catch (error) {
            message.error('Failed to load teachers');
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const formData = {
                ...values,
                date: values.date.format('YYYY-MM-DD')
            };
            // console.log("formData", formData);
            // return;
            if (notice) {
                await updateTeacherNotice(notice._id, formData);
            } else {
                await createTeacherNotice(formData);
            }
            onSuccess();
            form.resetFields();
        } catch (error) {
            message.error('Failed to save notice');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
                assignToAll: false,
                assignedTeachers: []
            }}
        >
            <Form.Item
                name="date"
                label="Date"
                rules={[{ required: true, message: 'Please select date' }]}
            >
                <DatePicker 
                    style={{ width: '100%' }} 
                    disabled={!!notice} // Disable if notice exists (editing mode)
                />
            </Form.Item>

            <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please enter description' }]}
            >
                <TextArea rows={4} />
            </Form.Item>

            <Form.Item
                name="remarks"
                label="Remarks"
            >
                <TextArea rows={3} />
            </Form.Item>

            <Form.Item
                name="assignToAll"
                valuePropName="checked"
            >
                <Switch checkedChildren="Assign to All" unCheckedChildren="Select Teachers" />
            </Form.Item>

            <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                    prevValues.assignToAll !== currentValues.assignToAll
                }
            >
                {({ getFieldValue }) => {
                    const assignToAll = getFieldValue('assignToAll');
                    return !assignToAll ? (
                        <Form.Item
                            name="assignedTeachers"
                            label="Select Teachers"
                            rules={[{ required: true, message: 'Please select teachers' }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Select teachers"
                                style={{ width: '100%' }}
                            >
                                {teachers.map(teacher => (
                                    <Select.Option key={teacher._id} value={teacher._id}>
                                        {teacher.fullName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    ) : null;
                }}
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                    {notice ? 'Update Notice' : 'Create Notice'}
                </Button>
            </Form.Item>
        </Form>
    );
}

export default NoticeForm;
