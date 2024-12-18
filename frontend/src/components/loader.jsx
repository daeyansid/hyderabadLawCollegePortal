import React from 'react';

const Loader = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                <p className="mt-4 text-lg font-semibold text-blue-500">Loading...</p>
            </div>
        </div>
    );
};

export default Loader;
