// src/components/DiaryDetailModal.jsx

import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const DiaryDetailModal = ({ isOpen, diary, onClose }) => {
    if (!isOpen || !diary) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="Close Modal"
                >
                    <AiOutlineClose size={24} />
                </button>

                {/* Modal Content */}
                <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
                    Diary Entry Details
                </h2>

                <div className="space-y-2">
                    <p>
                        <span className="font-medium text-gray-700">Date:</span>{' '}
                        {new Date(diary.date).toLocaleDateString()}
                    </p>
                    <p>
                        <span className="font-medium text-gray-700">Subject:</span>{' '}
                        {diary.subject?.subjectName || 'N/A'}
                    </p>
                    <p>
                        <span className="font-medium text-gray-700">Description:</span>{' '}
                        {diary.description}
                    </p>
                    <p>
                        <span className="font-medium text-gray-700">Remarks:</span>{' '}
                        {diary.remarks || 'N/A'}
                    </p>
                    <p>
                        <span className="font-medium text-gray-700">Assignment Status:</span>{' '}
                        {diary.assignToAll ? (
                            <span className="inline-block px-2 py-1 text-green-800 bg-green-200 rounded-full text-sm font-semibold">
                                Assigned to All
                            </span>
                        ) : (
                            <span className="inline-block px-2 py-1 text-yellow-800 bg-yellow-200 rounded-full text-sm font-semibold">
                                Assigned to You
                            </span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DiaryDetailModal;
