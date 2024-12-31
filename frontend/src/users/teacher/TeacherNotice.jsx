// src/pages/TeacherNotice.jsx

import React, { useState, useEffect } from 'react';
import { Table, Space, Modal, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { getTeacherNoticesByTeacherId } from '../../api/tecaherNotice';

function TeacherNotice() {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState(null);

    useEffect(() => {
        const teacherId = localStorage.getItem('adminSelfId');
        if (teacherId) {
            loadNotices(teacherId);
        }
    }, []);

    const loadNotices = async (teacherId) => {
        setLoading(true);
        try {
            const data = await getTeacherNoticesByTeacherId(teacherId);
            setNotices(data);
        } catch (error) {
            console.error('Error loading notices:', error);
        } finally {
            setLoading(false);
        }
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
        marginBottom: '24px',
        color: 'white'
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
            responsive: ['xs', 'sm', 'md', 'lg', 'xl'], // Always show on all screen sizes
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            responsive: ['sm', 'md', 'lg', 'xl'], // Hide on extra small screens
            ellipsis: true, // Truncate overflowing text with ellipsis
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
            responsive: ['md', 'lg', 'xl'], // Hide on small and extra small screens
            ellipsis: true,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button 
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => {
                            setSelectedNotice(record);
                            setViewModalVisible(true);
                        }}
                        size="small" // Smaller button for better fit on mobile
                    >
                        View
                    </Button>
                </Space>
            ),
            responsive: ['xs', 'sm', 'md', 'lg', 'xl'], // Always show
        },
    ];

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h2 style={{ color: 'white', margin: 0 }}>My Notices</h2>
            </div>

            {/* Enable horizontal scrolling on small screens */}
            <div style={{ overflowX: 'auto' }}>
                <Table 
                    columns={columns}
                    dataSource={notices}
                    rowKey="_id"
                    loading={loading}
                    style={tableStyles}
                    rowClassName={(_, index) => index % 2 === 0 ? 'even-row' : 'odd-row'}
                    pagination={{ responsive: true, pageSize: 10 }}
                />
            </div>

            {/* Responsive Modal */}
            <Modal
                title="Notice Details"
                visible={viewModalVisible}
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
                // Adjust modal width based on screen size
                width={window.innerWidth < 576 ? '100%' : '600px'}
                bodyStyle={{ padding: '24px' }}
                destroyOnClose
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
                    </div>
                )}
            </Modal>

            {/* Responsive Styles */}
            <style>{`
                /* Mobile-specific styles */
                @media (max-width: 576px) {
                    .notice-detail-item {
                        margin-bottom: 12px;
                        padding: 8px;
                        background: #f8f9fa;
                        border-radius: 4px;
                    }
                    .notice-detail-item h4 {
                        font-size: 14px;
                    }
                    .notice-detail-item p {
                        font-size: 14px;
                    }
                    .ant-table-thead > tr > th {
                        font-size: 14px;
                        padding: 8px;
                    }
                    .ant-table-tbody > tr > td {
                        font-size: 14px;
                        padding: 8px;
                    }
                    .ant-btn {
                        font-size: 12px;
                        padding: 4px 8px;
                    }
                    .ant-modal-content {
                        padding: 16px;
                    }
                }

                /* Common styles */
                .notice-detail-item {
                    margin-bottom: 16px;
                    padding: 12px;
                    background: #f8f9fa;
                    border-radius: 6px;
                    transition: all 0.3s ease;
                }
                .notice-detail-item:hover {
                    background: #e6f7ff;
                    transform: translateY(-2px);
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
                .ant-modal-header {
                    background: #f0f5ff;
                }
                .ant-modal-title {
                    color: #1890ff;
                }
            `}</style>
        </div>
    );
}

export default TeacherNotice;
