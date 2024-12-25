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

    const branchId = localStorage.getItem('branchId');

    useEffect(() => {
        if (visible) {
            form.resetFields();
            fetchClassesData();
            if (editingTest) {
                populateEditData();
            }
        }
    }, [visible, editingTest]);

    const populateEditData = async () => {
        try {
            const classResponse = await fetchClasses(branchId);
            setClasses(classResponse.data);

            const [studentsResponse, subjectsResponse] = await Promise.all([
                fetchStudentsBySemester(editingTest.classId._id),
                getAllSubjectsByClassId(editingTest.classId._id),
            ]);

            setStudents(studentsResponse);
            setSubjects(subjectsResponse);

            form.setFieldsValue({
                classId: editingTest.classId._id,
                studentId: editingTest.studentId._id,
                subjectId: editingTest.subjectId._id,
                midTermPaperMarks: editingTest.midTermPaperMarks,
                assignmentPresentationMarks: editingTest.assignmentPresentationMarks,
                attendanceMarks: editingTest.attendanceMarks,
            });
        } catch (error) {
            console.error('Error populating edit data:', error);
        }
    };

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
            form.resetFields(['studentId', 'subjectId', 'midTermPaperMarks', 'assignmentPresentationMarks', 'attendanceMarks']);
            setStudents([]);
            setSubjects([]);

            if (classId) {
                const [studentsResponse, subjectsResponse] = await Promise.all([
                    fetchStudentsBySemester(classId),
                    getAllSubjectsByClassId(classId),
                ]);
                setStudents(studentsResponse);
                setSubjects(subjectsResponse);
            }
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
            title={
                <div style={{ color: editingTest ? '#4096ff' : '#52c41a' }}>
                    {editingTest ? '📝 Edit Test Record' : '➕ Add New Test Record'}
                </div>
            }
            visible={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            confirmLoading={loading}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={editingTest ? {
                    classId: editingTest.classId._id,
                    studentId: editingTest.studentId._id,
                    subjectId: editingTest.subjectId._id,
                    midTermPaperMarks: editingTest.midTermPaperMarks,
                    assignmentPresentationMarks: editingTest.assignmentPresentationMarks,
                    attendanceMarks: editingTest.attendanceMarks,
                } : undefined}
            >
                <Form.Item
                    name="classId"
                    label="Class"
                    rules={[{ required: true, message: 'Please select class' }]}
                >
                    <Select onChange={handleClassChange} disabled={!!editingTest}>
                        {classes.map((cls) => (
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
                    <Select disabled={!!editingTest}>
                        {students.map((student) => (
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
                    <Select disabled={!!editingTest}>
                        {subjects.map((subject) => (
                            <Option key={subject._id} value={subject._id}>
                                {subject.subjectName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="midTermPaperMarks"
                    label="Mid Term Paper Marks  (Maximum 20)"
                    rules={[
                        { required: true, message: 'Please enter mid term paper marks' },
                        { type: 'number', min: 0, max: 20, message: 'Marks must be between 0 and 20' },
                    ]}
                >
                    <InputNumber min={0} max={20} />
                </Form.Item>

                <Form.Item
                    name="assignmentPresentationMarks"
                    label="Assignment/Presentation Marks (Maximum 10)"
                    rules={[
                        { required: true, message: 'Please enter assignment/presentation marks' },
                        { type: 'number', min: 0, max: 10, message: 'Marks must be between 0 and 10' },
                    ]}
                >
                    <InputNumber min={0} max={10} />
                </Form.Item>

                <Form.Item
                    name="attendanceMarks"
                    label="Attendance Marks  (Maximum 10)"
                    rules={[
                        { required: true, message: 'Please enter attendance marks' },
                        { type: 'number', min: 0, max: 10, message: 'Marks must be between 0 and 10' },
                    ]}
                >
                    <InputNumber min={0} max={10} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddTestManagment;
