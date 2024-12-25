import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, Upload, Button, message, Card, Typography, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { updateFeeDetails, getFeeDetailById } from '../../../../api/feeDetails';
import { fetchClasses } from '../../../../api/classApi';
import { fetchStudentsBySemester } from '../../../../api/studentApi';

const { Text } = Typography;

const UpdateFeeDetail = ({ visible, onCancel, onSuccess, selectedId }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [remainingFee, setRemainingFee] = useState(0);
    const [totalFees, setTotalFees] = useState(0);
    const [feeData, setFeeData] = useState(null);
    const [initialLoading, setInitialLoading] = useState(false);

    useEffect(() => {
        if (visible && selectedId) {
            loadFeeDetail();
        }
    }, [visible, selectedId]);

    const loadFeeDetail = async () => {
        setInitialLoading(true);
        try {
            const response = await getFeeDetailById(selectedId);
            const data = response.data;
            setFeeData(data);
            
            // Set form values directly from response data
            form.setFieldsValue({
                semester: data.classId._id,
                studentId: data.studentId._id,
                admissionConfirmationFee: data.admissionConfirmationFee,
                semesterFeesPaid: data.semesterFeesPaid,
                discount: data.discount,
                lateFeeSurcharged: data.lateFeeSurcharged,
                otherPenalties: data.otherPenalties
            });

            // Calculate initial fees
            calculateFees(data);

            // Set challan if exists
            if (data.challanPicture) {
                setFileList([{
                    uid: '-1',
                    name: 'Current Challan',
                    status: 'done',
                    url: `${process.env.REACT_APP_API_URL}/${data.challanPicture}`
                }]);
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('Failed to load fee detail');
            onCancel();
        }
        setInitialLoading(false);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();
            
            // Process form values
            const formValues = { ...values };
            formValues.classId = formValues.semester;
            delete formValues.semester;

            // Convert admissionConfirmationFee to boolean
            formValues.admissionConfirmationFee = Boolean(formValues.admissionConfirmationFee);

            Object.keys(formValues).forEach(key => {
                if (key === 'admissionConfirmationFee') {
                    formData.append(key, formValues[key] ? 'true' : 'false');
                } else {
                    formData.append(key, formValues[key]);
                }
            });

            // Append the file to formData if it exists
            if (fileList[0]?.originFileObj) {
                console.log('File:', fileList[0].originFileObj);
                formData.append('challanPicture', fileList[0].originFileObj);
            }
    
            // Log the formData contents for verification
            console.log('FormData Entries:');
            for (let pair of formData.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }
    
            // Make the API call to update the fee details
            await updateFeeDetails(feeData._id, formData);
            message.success('Fee details updated successfully');
            onSuccess();
        } catch (error) {
            console.error('Error:', error);
            message.error('Failed to update fee details');
        }
    };

    const handleSemesterFeePaidChange = (value) => {
        if (feeData?.semesterFeesTotal?.semesterFee && value) {
            const paid = Number(value);
            const total = feeData.semesterFeesTotal.semesterFee;
            const remaining = total - paid;
            setRemainingFee(remaining >= 0 ? remaining : 0);
        }
    };

    const uploadProps = {
        beforeUpload: (file) => {
            setFileList([file]);
            return false;
        },
        fileList,
    };

    const calculateFees = (values = {}) => {
        if (!feeData?.semesterFeesTotal) return;

        const semesterFeesPaid = Number(values.semesterFeesPaid) || 0;
        const discount = Number(values.discount) || 0;
        const lateFee = Number(values.lateFeeSurcharged) || 0;
        const otherPenalties = Number(values.otherPenalties) || 0;

        const total = feeData.semesterFeesTotal.semesterFee +
            lateFee +
            otherPenalties +
            feeData.totalAdmissionFee.admissionFee;
        setTotalFees(total);

        const remaining = feeData.semesterFeesTotal.semesterFee -
            semesterFeesPaid -
            discount +
            lateFee +
            otherPenalties;
        setRemainingFee(remaining >= 0 ? remaining : 0);
    };

    const handleFormValueChange = (_, allValues) => {
        calculateFees(allValues);
    };

    useEffect(() => {
        if (feeData) {
            calculateFees(form.getFieldsValue());
        }
    }, [feeData]);

    return (
        <Modal
            title="Update Fee Detail"
            visible={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            width={800}
            confirmLoading={loading}
        >
            {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    {feeData?.semesterFeesTotal && (
                        <Card style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text strong>Semester Fee: Rs. {feeData.semesterFeesTotal.semesterFee.toLocaleString()}</Text>
                                <Text strong>Admission Fee: Rs. {feeData.totalAdmissionFee.admissionFee.toLocaleString()}</Text>
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
                            <Select disabled>
                                <Select.Option value={feeData?.classId._id}>
                                    {feeData?.classId.className}
                                </Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="studentId"
                            label="Student"
                            rules={[{ required: true, message: 'Please select a student' }]}
                        >
                            <Select disabled>
                                <Select.Option value={feeData?.studentId._id}>
                                    {feeData?.studentId.fullName} - {feeData?.studentId.rollNumber} of Semester {feeData?.classId.className}
                                </Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="admissionConfirmationFee"
                            label="Admission Fee Confirmed"
                            valuePropName="checked"
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
                                        const totalFee = feeData?.semesterFeesTotal?.semesterFee || 0;
                                        if (numValue > totalFee) {
                                            return Promise.reject('Paid amount cannot exceed total semester fee');
                                        }
                                        return Promise.resolve();
                                    }
                                }
                            ]}
                        >
                            <Input
                                type="number"
                                min="0"
                                max={feeData?.semesterFeesTotal?.semesterFee}
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

                    {feeData?.semesterFeesTotal && (
                        <div style={{
                            borderTop: '1px solid #f0f0f0',
                            marginTop: 24,
                            paddingTop: 16,
                            marginBottom: -24,
                            backgroundColor: '#fafafa',
                            padding: '16px 24px',
                            marginLeft: -24,
                            marginBottom: 20,
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
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
                </>
            )}
        </Modal>
    );
};

export default UpdateFeeDetail;
