import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { updateFeeDetails } from '../../../../api/feeDetails';
import { fetchClasses } from '../../../../api/classApi';
import { fetchStudents } from '../../../../api/studentApi';

const UpdateFeeDetail = ({ visible, onCancel, onSuccess, feeData }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            loadSemesters();
            loadStudents();
        }
    }, [visible]);

    useEffect(() => {
        if (feeData) {
            form.setFieldsValue({
                ...feeData,
                studentId: feeData.studentId._id,
                semester: feeData.semester?._id
            });
            
            if (feeData.challanPicture) {
                setFileList([{
                    uid: '-1',
                    name: 'Current Challan',
                    status: 'done',
                    url: `${process.env.REACT_APP_API_URL}/${feeData.challanPicture}`
                }]);
            }
        }
    }, [feeData, form]);

    const loadSemesters = async () => {
        try {
            const response = await fetchClasses();
            setSemesters(response.data || []);
        } catch (error) {
            message.error('Failed to load semesters');
        }
    };

    const loadStudents = async () => {
        try {
            const response = await fetchStudents();
            setStudents(response.data || []);
        } catch (error) {
            message.error('Failed to load students');
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();
            
            if (fileList[0]?.originFileObj) {
                formData.append('challanPicture', fileList[0].originFileObj);
            }

            Object.keys(values).forEach(key => {
                formData.append(key, values[key]);
            });

            await updateFeeDetails(feeData._id, formData);
            message.success('Fee details updated successfully');
            onSuccess();
        } catch (error) {
            message.error('Failed to update fee details');
        }
    };

    const uploadProps = {
        beforeUpload: (file) => {
            setFileList([file]);
            return false;
        },
        fileList,
    };

    return (
        <Modal
            title="Update Fee Detail"
            visible={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            width={800}
            confirmLoading={loading}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="semester"
                    label="Semester"
                    rules={[{ required: true, message: 'Please select semester' }]}
                >
                    <Select 
                        placeholder="Select semester"
                        loading={!semesters.length}
                        disabled
                    >
                        {semesters.map(semester => (
                            <Select.Option key={semester._id} value={semester._id}>
                                {semester.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="studentId"
                    label="Student"
                    rules={[{ required: true, message: 'Please select a student' }]}
                >
                    <Select 
                        placeholder="Select student"
                        loading={!students.length}
                        disabled
                        showSearch
                        optionFilterProp="children"
                    >
                        {students.map(student => (
                            <Select.Option key={student._id} value={student._id}>
                                {student.name} - {student.enrollmentNumber}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="admissionConfirmationFee"
                    label="Admission Fee Confirmed"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Form.Item
                    name="semesterFeesPaid"
                    label="Semester Fees Paid"
                    rules={[{ required: true, message: 'Please enter semester fees paid' }]}
                >
                    <Input type="number" min="0" />
                </Form.Item>

                <Form.Item
                    name="discount"
                    label="Discount"
                >
                    <Input type="number" min="0" />
                </Form.Item>

                <Form.Item
                    name="lateFeeSurcharged"
                    label="Late Fee Surcharge"
                >
                    <Input type="number" min="0" />
                </Form.Item>

                <Form.Item
                    name="otherPenalties"
                    label="Other Penalties"
                >
                    <Input type="number" min="0" />
                </Form.Item>

                <Form.Item
                    label="Upload New Challan"
                >
                    <Upload {...uploadProps} maxCount={1}>
                        <Button icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateFeeDetail;
