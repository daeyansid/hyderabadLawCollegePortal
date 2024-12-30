import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, Upload, message, Button, Card, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { createFeeDetails, checkFeeDetailExists, getFeeDetailsByStudentId, getFeeDetailLinkByStudentId } from '../../../../api/feeDetails';
import { fetchClasses } from '../../../../api/classApi';
import { fetchStudentsBySemester } from '../../../../api/studentApi';
import { getCurrentFeeMeta } from '../../../../api/feeMeta';

const { Text } = Typography;

const AddFeeDetail = ({ visible, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [feeMeta, setFeeMeta] = useState(null);
    const [remainingFee, setRemainingFee] = useState(0);
    const [totalFees, setTotalFees] = useState(0);
    const [studentFeeDetails, setStudentFeeDetails] = useState([]);

    useEffect(() => {
        if (visible) {
            loadSemesters();
            loadFeeMeta();
        }
    }, [visible]);

    const loadSemesters = async () => {
        try {
            const response = await fetchClasses();
            // console.log("response",response);
            setSemesters(response.data || []);
        } catch (error) {
            message.error('Failed to load semesters');
        }
    };

    const loadFeeMeta = async () => {
        try {
            const feeMetaData = await getCurrentFeeMeta();
            if (!feeMetaData) {
                message.error('No fee structure found. Please create one first.');
                onCancel();
                return;
            }
            setFeeMeta(feeMetaData);
        } catch (error) {
            message.error('Failed to load fee structure');
        }
    };

    const handleSemesterChange = async (semesterId) => {
        try {
            setLoading(true);
            const response = await fetchStudentsBySemester(semesterId);
            // console.log("response of sem",response);
            setStudents(response || []);
            form.setFieldValue('studentId', undefined);
        } catch (error) {
            message.error('Failed to fetch students for selected semester');
        } finally {
            setLoading(false);
        }
    };

    const handleStudentSelect = async (studentId) => {
        console.log("studentId In hereeeee");
        console.log("studentId:", studentId);
        try {
            const semesterId = form.getFieldValue('semester');
            if (!semesterId) {
                message.error('Please select a semester first');
                form.setFieldValue('studentId', undefined);
                return;
            }

            // First check if fee details exist
            const existingFeeResponse = await checkFeeDetailExists(studentId, semesterId);
            if (existingFeeResponse.data.exists) {
                message.warning('Fee details already exist for this student in this semester');
                form.setFieldValue('studentId', undefined);
                return;
            }

            // Fetch previous fee details for the student
            const feeDetailsResponse = await getFeeDetailLinkByStudentId(studentId);
            
            if (feeDetailsResponse?.data?.data) {
                const latestFeeDetail = feeDetailsResponse.data.data;
                setStudentFeeDetails(latestFeeDetail);
                
                // console.log("feeDetailsResponse",feeDetailsResponse.data.data);
                console.log("latestFeeDetail", studentFeeDetails);
                console.log("studentFeeDetails totalAdmissionFee", studentFeeDetails.totalAdmissionFee.admissionFee);
                console.log("studentFeeDetails semesterFeesTotal", studentFeeDetails.semesterFeesTotal.admissionFee);

                // Update feeMeta with the fetched values
                if (studentFeeDetails.totalAdmissionFee && studentFeeDetails.semesterFeesTotal) {
                    setFeeMeta({
                        ...feeMeta,
                        semesterFee: studentFeeDetails.semesterFeesTotal.admissionFee || 0,
                        admissionFee: studentFeeDetails.totalAdmissionFee.admissionFee || 0,
                        _id: studentFeeDetails.totalAdmissionFee._id
                    });
                }
            }

        } catch (error) {
            console.error('Error checking fee details:', error);
            message.error('Failed to verify student fee details');
            form.setFieldValue('studentId', undefined);
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();

            if (fileList[0]) {
                formData.append('challanPicture', fileList[0].originFileObj);
            }

            formData.append('totalAdmissionFee', feeMeta._id);
            formData.append('semesterFeesTotal', feeMeta._id);

            // Change semester to classId in the form data
            const formValues = { ...values };
            formValues.classId = formValues.semester;
            delete formValues.semester;

            // Convert admissionConfirmationFee to boolean
            formValues.admissionConfirmationFee = Boolean(formValues.admissionConfirmationFee);

            // Append modified form data
            Object.keys(formValues).forEach(key => {
                if (key === 'admissionConfirmationFee') {
                    formData.append(key, formValues[key] ? 'true' : 'false');
                } else {
                    formData.append(key, formValues[key]);
                }
            });

            // Log formData keys and values
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }
            // return;
            await createFeeDetails(formData);
            message.success('Fee details created successfully');
            form.resetFields();
            setFileList([]);
            onSuccess();
        } catch (error) {
            console.error('Error:', error);
            message.error('Failed to create fee details');
        }
    };


    const handleSemesterFeePaidChange = (value) => {
        if (feeMeta && value) {
            const paid = Number(value);
            const total = feeMeta.semesterFee;
            const remaining = total - paid;
            setRemainingFee(remaining >= 0 ? remaining : 0);
        }
    };

    const calculateFees = (values = {}) => {
        if (!feeMeta) return;

        const semesterFeesPaid = Number(values.semesterFeesPaid) || 0;
        const discount = Number(values.discount) || 0;
        const lateFee = Number(values.lateFeeSurcharged) || 0;
        const otherPenalties = Number(values.otherPenalties) || 0;

        // Calculate total fees (Semester + Changes + Admission)
        const total = feeMeta.semesterFee + lateFee + otherPenalties + feeMeta.admissionFee;
        setTotalFees(total);

        // Calculate remaining fee
        const remaining = feeMeta.semesterFee - semesterFeesPaid - discount + lateFee + otherPenalties;
        setRemainingFee(remaining >= 0 ? remaining : 0);
    };

    const handleFormValueChange = (_, allValues) => {
        calculateFees(allValues);
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
            {feeMeta && (
                <Card style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text strong>Semester Fee: Rs. {feeMeta.semesterFee.toLocaleString()}</Text>
                        <Text strong>Admission Fee: Rs. {feeMeta.admissionFee.toLocaleString()}</Text>
                    </div>
                </Card>
            )}

            <Form
                form={form}
                layout="vertical"
                onValuesChange={handleFormValueChange}
            >
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
                        onChange={handleStudentSelect}
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
                    initialValue={false}
                >
                    <Switch
                        checkedChildren="Yes"
                        unCheckedChildren="No"
                    />
                </Form.Item>

                <Form.Item
                    name="semesterFeesPaid"
                    label="Semester Fees Paid"
                    rules={[
                        { required: true, message: 'Please enter semester fees paid' },
                        {
                            validator: (_, value) => {
                                if (!value) return Promise.resolve();
                                const numValue = Number(value);
                                const maxAllowed = feeMeta?.semesterFee;
                                if (numValue > maxAllowed) {
                                    return Promise.reject(`Paid amount cannot exceed ${maxAllowed}`);
                                }
                                return Promise.resolve();
                            }
                        }
                    ]}
                >
                    <Input
                        type="number"
                        min="0"
                        max={feeMeta?.semesterFee}
                        onChange={(e) => handleSemesterFeePaidChange(e.target.value)}
                        placeholder="Enter paid amount"
                    />
                </Form.Item>

                <Form.Item
                    name="discount"
                    label="Discount"
                    rules={[{ required: true, message: 'Please enter discount amount' }]}
                >
                    <Input type="number" min="0" placeholder="Enter discount amount" />
                </Form.Item>

                <Form.Item
                    name="lateFeeSurcharged"
                    label="Late Fee Surcharge"
                    rules={[{ required: true, message: 'Please enter late fee surcharge' }]}
                >
                    <Input type="number" min="0" placeholder="Enter late fee surcharge" />
                </Form.Item>

                <Form.Item
                    name="otherPenalties"
                    label="Other Penalties"
                    rules={[{ required: true, message: 'Please enter other penalties' }]}
                >
                    <Input type="number" min="0" placeholder="Enter other penalties" />
                </Form.Item>

                <Form.Item
                    label="Upload Challan"
                    rules={[{ required: true, message: 'Please upload challan picture' }]}
                >
                    <Upload {...uploadProps} maxCount={1}>
                        <Button icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                </Form.Item>
            </Form>

            {feeMeta && (
                <div style={{
                    borderTop: '1px solid #f0f0f0',
                    marginTop: 24,
                    paddingTop: 16,
                    marginBottom: -24,
                    backgroundColor: '#fafafa',
                    padding: '16px 24px',
                    marginLeft: -24,
                    marginRight: -24,
                    marginBottom: 20,
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Text strong style={{ fontSize: 16 }}>
                            Overview :
                        </Text>

                        <Text strong type="warning" style={{ fontSize: 16 }}>
                            Total Fees: Rs. {totalFees.toLocaleString()}
                        </Text>

                        <Text
                            strong
                            type={remainingFee < 0 ? "danger" : "success"}
                            style={{ fontSize: 16 }}
                        >
                            Remaining Fee: Rs. {remainingFee.toLocaleString()}
                        </Text>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default AddFeeDetail;
