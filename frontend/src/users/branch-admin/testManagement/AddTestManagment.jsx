import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, InputNumber } from 'antd';
import { createTest, updateTest } from '../../../api/testManagment';
import { fetchClasses } from '../../../api/classApi';
import { fetchStudentsBySemester } from '../../../api/studentApi';
import { getAllSubjectsByClassId } from '../../../api/subjectApi';

const { Option } = Select;

const AddTestManagment = ({ visible, onCancel, onSuccess, editingTest }) => {
    const [form] = Form.useForm();
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [classSubjects, setClassSubjects] = useState([]);

    const branchId = localStorage.getItem('branchId');

    useEffect(() => {
        if (visible) {
            fetchClassesData();
        }
    }, [visible]);

    useEffect(() => {
        if (editingTest) {
            form.setFieldsValue({
                classId: editingTest.classId._id,
                studentId: editingTest.studentId._id,
                subjectId: editingTest.subjectId._id,
                midTermPaperMarks: editingTest.midTermPaperMarks,
                assignmentPresentationMarks: editingTest.assignmentPresentationMarks,
                attendanceMarks: editingTest.attendanceMarks
            });
            handleClassChange(editingTest.classId._id);
        }
    }, [editingTest, form]);

    const fetchClassesData = async () => {
        try {
            const response = await fetchClasses(branchId);
            setClasses(response.data);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const handleClassChange = async (classId) => {
        try {
            const [studentsResponse, subjectsResponse] = await Promise.all([
                fetchStudentsBySemester(classId),
                getAllSubjectsByClassId(classId)
            ]);
            setStudents(studentsResponse);
            setClassSubjects(subjectsResponse);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            
            if (editingTest) {
                await updateTest(editingTest._id, values);
            } else {
                await createTest(values);
            }
            
            onSuccess();
            form.resetFields();
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={editingTest ? "Edit Test Record" : "Add New Test Record"}
            visible={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            confirmLoading={loading}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="classId"
                    label="Class"
                    rules={[{ required: true, message: 'Please select class' }]}
                >
                    <Select onChange={handleClassChange}>
                        {classes.map(cls => (
                            <Option key={cls._id} value={cls._id}>
                                {cls.className}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="studentId"
                    label="Student"
                    rules={[{ required: true, message: 'Please select student' }]}
                >
                    <Select>
                        {students.map(student => (
                            <Option key={student._id} value={student._id}>
                                {student.fullName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="subjectId"
                    label="Subject"
                    rules={[{ required: true, message: 'Please select subject' }]}
                >
                    <Select>
                        {classSubjects.map(subject => (
                            <Option key={subject._id} value={subject._id}>
                                {subject.subjectName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="midTermPaperMarks"
                    label="Mid Term Paper Marks"
                    rules={[
                        { required: true, message: 'Please enter mid term paper marks' },
                        { type: 'number', min: 0, max: 20, message: 'Marks must be between 0 and 20' }
                    ]}
                >
                    <InputNumber min={0} max={20} />
                </Form.Item>

                <Form.Item
                    name="assignmentPresentationMarks"
                    label="Assignment/Presentation Marks"
                    rules={[
                        { required: true, message: 'Please enter assignment/presentation marks' },
                        { type: 'number', min: 0, max: 10, message: 'Marks must be between 0 and 10' }
                    ]}
                >
                    <InputNumber min={0} max={10} />
                </Form.Item>

                <Form.Item
                    name="attendanceMarks"
                    label="Attendance Marks"
                    rules={[
                        { required: true, message: 'Please enter attendance marks' },
                        { type: 'number', min: 0, max: 10, message: 'Marks must be between 0 and 10' }
                    ]}
                >
                    <InputNumber min={0} max={10} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddTestManagment;
