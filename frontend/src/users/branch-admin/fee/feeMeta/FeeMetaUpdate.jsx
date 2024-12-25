// import React, { useEffect } from 'react';
// import { Modal, Form, Input, message } from 'antd';
// import { updateFeeMeta } from '../../../../api/feeMeta';

// const FeeMetaUpdate = ({ visible, onCancel, onSuccess, feeData }) => {
//     const [form] = Form.useForm();

//     useEffect(() => {
//         if (feeData) {
//             form.setFieldsValue(feeData);
//         }
//     }, [feeData, form]);

//     const handleSubmit = async () => {
//         try {
//             const values = await form.validateFields();
//             // Convert string values to numbers
//             const formData = {
//                 semesterFee: Number(values.semesterFee),
//                 admissionFee: Number(values.admissionFee)
//             };
//             await updateFeeMeta(feeData._id, formData);
//             message.success('Fee structure updated successfully');
//             onSuccess();
//         } catch (error) {
//             message.error('Failed to update fee structure');
//         }
//     };

//     return (
//         <Modal
//             title="Update Fee Structure"
//             visible={visible}
//             onCancel={onCancel}
//             onOk={handleSubmit}
//         >
//             <Form form={form} layout="vertical">
//                 <Form.Item
//                     name="semesterFee"
//                     label="Semester Fee"
//                     rules={[
//                         { required: true, message: 'Please enter semester fee' },
//                         {
//                             validator: (_, value) => {
//                                 if (!value) return Promise.resolve();
//                                 const numValue = Number(value);
//                                 if (isNaN(numValue) || numValue <= 0) {
//                                     return Promise.reject('Fee must be greater than 0');
//                                 }
//                                 return Promise.resolve();
//                             }
//                         }
//                     ]}
//                 >
//                     <Input type="number" min="1" placeholder="Enter semester fee" />
//                 </Form.Item>

//                 <Form.Item
//                     name="admissionFee"
//                     label="Admission Fee"
//                     rules={[
//                         { required: true, message: 'Please enter admission fee' },
//                         {
//                             validator: (_, value) => {
//                                 if (!value) return Promise.resolve();
//                                 const numValue = Number(value);
//                                 if (isNaN(numValue) || numValue <= 0) {
//                                     return Promise.reject('Fee must be greater than 0');
//                                 }
//                                 return Promise.resolve();
//                             }
//                         }
//                     ]}
//                 >
//                     <Input type="number" min="1" placeholder="Enter admission fee" />
//                 </Form.Item>
//             </Form>
//         </Modal>
//     );
// };

// export default FeeMetaUpdate;
