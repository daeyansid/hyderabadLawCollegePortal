import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { getAllTeacherNotices, deleteTeacherNotice } from '../../../api/tecaherNotice';
import NoticeForm from './NoticeForm';

function TeacherNotice() {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingNotice, setEditingNotice] = useState(null);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState(null);

    useEffect(() => {
        loadNotices();
    }, []);

    const loadNotices = async () => {
        setLoading(true);
        try {
            const data = await getAllTeacherNotices();
            // Ensure we're setting an array, even if empty
            setNotices(Array.isArray(data) ? data : []);
        } catch (error) {
            message.error('Failed to load notices');
            setNotices([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this notice?',
            content: 'This action cannot be undone',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await deleteTeacherNotice(id);
                    loadNotices();
                } catch (error) {
                    message.error('Failed to delete notice');
                }
            },
        });
    };

    const tableStyles = {
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        overflow: 'hidden'
    };

    const headerStyle = {
        background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
        padding: '16px 24px',
        borderRadius: '8px 8px 0 0',
        marginBottom: '0'
    };

    const containerStyle = {
        padding: '24px',
        background: 'linear-gradient(to bottom, #f0f2f5, #ffffff)',
        minHeight: '100vh'
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
        },
        {
            title: 'Assigned Teachers',
            dataIndex: 'assignedTeachers',
            key: 'assignedTeachers',
            render: (teachers, record) => {
                if (record.assignToAll) {
                    return 'All Teachers';
                }
                // Show count of teachers if assignToAll is false
                const teacherCount = teachers?.length || 0;
                return `${teacherCount} Teacher${teacherCount !== 1 ? 's' : ''}`;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button 
                        type="default"
                        icon={<EyeOutlined />}
                        onClick={() => {
                            setSelectedNotice(record);
                            setViewModalVisible(true);
                        }}
                    >
                        View
                    </Button>
                    <Button 
                        type="primary" 
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditingNotice(record);
                            setModalVisible(true);
                        }}
                    >
                        Edit
                    </Button>
                    <Button 
                        danger 
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record._id)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={containerStyle}>
            <div style={{ 
                marginBottom: 16, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                background: headerStyle.background,
                padding: headerStyle.padding,
                borderRadius: headerStyle.borderRadius
            }}>
                <h2 style={{ color: 'white', margin: 0 }}>Teacher Notices</h2>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setEditingNotice(null);
                        setModalVisible(true);
                    }}
                    style={{
                        background: '#52c41a',
                        borderColor: '#52c41a',
                        boxShadow: '0 2px 0 rgba(0,0,0,0.045)'
                    }}
                >
                    Add Notice
                </Button>
            </div>

            <Table 
                columns={columns}
                dataSource={notices || []} // Provide fallback empty array
                rowKey={record => record._id || Math.random()} // Ensure unique key
                loading={loading}
                style={tableStyles}
                rowClassName={(_, index) => index % 2 === 0 ? 'even-row' : 'odd-row'}
            />

            {/* View Modal */}
            <Modal
                title="View Notice Details"
                open={viewModalVisible}
                onCancel={() => {
                    setViewModalVisible(false);
                    setSelectedNotice(null);
                }}
                footer={[
                    <Button key="close" onClick={() => {
                        setViewModalVisible(false);
                        setSelectedNotice(null);
                    }}>
                        Close
                    </Button>
                ]}
                width={600}
            >
                {selectedNotice && (
                    <div>
                        <div className="notice-detail-item">
                            <h4>Date:</h4>
                            <p>{new Date(selectedNotice.date).toLocaleDateString()}</p>
                        </div>
                        <div className="notice-detail-item">
                            <h4>Description:</h4>
                            <p>{selectedNotice.description}</p>
                        </div>
                        <div className="notice-detail-item">
                            <h4>Remarks:</h4>
                            <p>{selectedNotice.remarks || 'No remarks'}</p>
                        </div>
                        <div className="notice-detail-item">
                            <h4>Teachers Assignment:</h4>
                            <p>
                                {selectedNotice.assignToAll 
                                    ? 'Assigned to All Teachers' 
                                    : `Assigned to ${selectedNotice.assignedTeachers?.length || 0} Teacher(s)`
                                }
                            </p>
                        </div>
                        {!selectedNotice.assignToAll && selectedNotice.assignedTeachers?.length > 0 && (
                            <div className="notice-detail-item">
                                <h4>Assigned Teachers:</h4>
                                <ul>
                                    {selectedNotice.assignedTeachers.map(teacher => (
                                        <li key={teacher._id}>{teacher.fullName}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {modalVisible && ( // Only render modal when visible
                <Modal
                    title={editingNotice ? "Edit Notice" : "Add New Notice"}
                    open={modalVisible}
                    onCancel={() => {
                        setModalVisible(false);
                        setEditingNotice(null);
                    }}
                    footer={null}
                    width={800}
                >
                    <NoticeForm
                        notice={editingNotice}
                        onSuccess={() => {
                            setModalVisible(false);
                            setEditingNotice(null);
                            loadNotices();
                        }}
                    />
                </Modal>
            )}
        </div>
    );
}

// Update the styles with new color schemes
const styles = `
    .notice-detail-item {
        margin-bottom: 16px;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 6px;
        transition: all 0.3s ease;
    }
    .notice-detail-item:hover {
        background: #e6f7ff;
    }
    .notice-detail-item h4 {
        margin-bottom: 4px;
        color: #1890ff;
        font-weight: 600;
    }
    .notice-detail-item p {
        margin: 0;
        color: #4a4a4a;
    }
    .notice-detail-item ul {
        margin: 0;
        padding-left: 20px;
    }
    .even-row {
        background-color: #ffffff;
    }
    .odd-row {
        background-color: #f8f9fa;
    }
    .odd-row:hover, .even-row:hover {
        background-color: #e6f7ff !important;
    }
    .ant-table-thead > tr > th {
        background: #f0f5ff !important;
        color: #1890ff;
        font-weight: 600;
    }
    .ant-btn-primary {
        background: #1890ff;
        border-color: #1890ff;
        transition: all 0.3s ease;
    }
    .ant-btn-primary:hover {
        background: #40a9ff;
        border-color: #40a9ff;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(24,144,255,0.3);
    }
    .ant-btn-dangerous {
        transition: all 0.3s ease;
    }
    .ant-btn-dangerous:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(255,77,79,0.3);
    }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default TeacherNotice;