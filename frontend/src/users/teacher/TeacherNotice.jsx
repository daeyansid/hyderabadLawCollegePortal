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
                    >
                        View
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h2 style={{ color: 'white', margin: 0 }}>My Notices</h2>
            </div>

            <Table 
                columns={columns}
                dataSource={notices}
                rowKey="_id"
                loading={loading}
                style={tableStyles}
                rowClassName={(_, index) => index % 2 === 0 ? 'even-row' : 'odd-row'}
            />

            <Modal
                title="Notice Details"
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
        </div>
    );
}

// Add styles
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
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default TeacherNotice;