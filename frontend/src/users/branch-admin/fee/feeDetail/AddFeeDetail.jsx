import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { createFeeDetails } from '../../../../api/feeDetails';
import { fetchClasses } from '../../../../api/classApi';
import { fetchStudents, fetchStudentsBySemester } from '../../../../api/studentApi';

const AddFeeDetail = ({ visible, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            loadSemesters();
        }
    }, [visible]);

    const loadSemesters = async () => {
        try {
            const response = await fetchClasses();
            console.log("response",response);
            setSemesters(response.data || []);
        } catch (error) {
            message.error('Failed to load semesters');
        }
    };

    // const loadStudents = async () => {
    //     try {
    //         const response = await fetchStudents();
    //         setStudents(response.data || []);
    //     } catch (error) {
    //         message.error('Failed to load students');
    //     }
    // };

    const handleSemesterChange = async (semesterId) => {
        try {
            setLoading(true);
            const response = await fetchStudentsBySemester(semesterId);
            console.log("response of sem",response);
            setStudents(response || []);
            // Clear selected student when semester changes
            form.setFieldValue('studentId', undefined);
        } catch (error) {
            message.error('Failed to fetch students for selected semester');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();
            
            // Append file if exists
            if (fileList[0]) {
                formData.append('challanPicture', fileList[0].originFileObj);
            }

            // Append other form data
            Object.keys(values).forEach(key => {
                formData.append(key, values[key]);
            });

            await createFeeDetails(formData);
            message.success('Fee details created successfully');
            form.resetFields();
            setFileList([]);
            onSuccess();
        } catch (error) {
            message.error('Failed to create fee details');
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
            title="Add New Fee Detail"
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
                        onChange={handleSemesterChange}
                    >
                        <option value="">Select Semester</option>
                        {semesters.map(semester => (
                            <Select.Option key={semester._id} value={semester._id}>
                                {semester.className}
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
                        loading={loading}
                        showSearch
                        optionFilterProp="children"
                    >
                        {students.map(student => (
                            <Select.Option key={student._id} value={student._id}>
                                {student.fullName} - {student.rollNumber} on Semester {student.className}
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
                    label="Upload Challan"
                >
                    <Upload {...uploadProps} maxCount={1}>
                        <Button icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddFeeDetail;
