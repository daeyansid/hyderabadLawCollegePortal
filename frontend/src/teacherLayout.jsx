import React, { useState } from 'react';
import Nav from './layout/teacher/nav';
import Aside from './layout/teacher/aside';
import { Outlet } from 'react-router-dom';

export default function TeacherLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev); // Toggle sidebar open/close state
    };

    return (
        <>
            {/* Navbar */}
            <Nav toggleSidebar={toggleSidebar} />

            {/* Sidebar */}
            <Aside isSidebarOpen={isSidebarOpen} />

            {/* Main content */}
            <div className={`flex flex-col min-h-screen ${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300 w-full`}>
                <main className="flex-1 p-4 bg-custom-backGround-content relative z-10">
                    <div className="p-4 mt-14 lg:p-4 lg:mt-24 lg:ml-60 md:ml-60 md:mt-20">
                        <Outlet />
                    </div>
                </main>
            </div>
        </>
    );
}
