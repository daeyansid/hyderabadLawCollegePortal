// src/pages/student/Diary/DiaryDetailModal.jsx

import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const DiaryDetailModal = ({ isOpen, diary, onClose }) => {
    if (!isOpen || !diary) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    <AiOutlineClose size={24} />
                </button>
                <h2 className="text-2xl font-bold text-indigo-700 mb-4">
                    Diary Entry Details
                </h2>
                <div className="space-y-2">
                    <p>
                        <span className="font-medium">Date:</span> {new Date(diary.date).toLocaleDateString()}
                    </p>
                    <p>
                        <span className="font-medium">Subject:</span> {diary.subject?.subjectName || 'N/A'}
                    </p>
                    <p>
                        <span className="font-medium">Description:</span> {diary.description}
                    </p>
                    <p>
                        <span className="font-medium">Remarks:</span> {diary.remarks || 'N/A'}
                    </p>
                    <p>
                        <span className="font-medium">Assignment:</span>{' '}
                        {diary.assignToAll ? 'Assigned to All' : 'Assigned to Student'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DiaryDetailModal;
