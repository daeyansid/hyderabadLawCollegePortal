// AuthProvider.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [userInfo, setUserInfo] = useState({
        username: '',
        adminName: '',
        adminEmail: '',
        branchTypeAdmin: '',
        branchId: '',
        adminSelfId: '',
        machineAttendance: '',
        dairy: '',
        sectionId: '',
        classId: '',
    });

    useEffect(() => {
        // Load data from localStorage on initial render
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');

        if (token) {
            setIsAuthenticated(true);
            setUserRole(role);
            setUserInfo({
                username: localStorage.getItem('username') || '',
                adminName: localStorage.getItem('adminName') || '',
                adminEmail: localStorage.getItem('adminEmail') || '',
                branchTypeAdmin: localStorage.getItem('branchTypeAdmin') || '',
                branchId: localStorage.getItem('branchId') || '',
                adminSelfId: localStorage.getItem('adminSelfId') || '',
                dairy: localStorage.getItem('dairy') || '',
                machineAttendance: localStorage.getItem('machineAttendance') || '',
                sectionId: localStorage.getItem('sectionId') || '',
                classId: localStorage.getItem('classId') || '',
            });
        }
    }, []);

    const login = (data) => {
        const { token, userRole, userId, username, adminName, adminEmail, branchId, branchTypeAdmin, adminSelfId, machineAttendance, dairy, sectionId, classId } = data;

        // Update localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);
        localStorage.setItem('adminName', adminName);
        localStorage.setItem('adminEmail', adminEmail);
        localStorage.setItem('branchId', branchId);
        localStorage.setItem('branchTypeAdmin', branchTypeAdmin);
        localStorage.setItem('adminSelfId', adminSelfId);
        localStorage.setItem('machineAttendance', machineAttendance);
        localStorage.setItem('sectionId', sectionId);
        localStorage.setItem('classId', classId);
        localStorage.setItem('dairy', dairy);

        // Update state immediately
        setIsAuthenticated(true);
        setUserRole(userRole);
        setUserInfo({
            username,
            adminName,
            adminEmail,
            branchTypeAdmin,
            branchId,
            adminSelfId,
            machineAttendance,
            classId,
            sectionId,
            dairy
        });
    };

    const logout = () => {
        // Clear localStorage and reset state
        localStorage.clear();
        sessionStorage.setItem('hasReloaded', 'false');
        sessionStorage.setItem('hasReloadedSuperAdmin', 'false');
        setIsAuthenticated(false);
        setUserRole(null);
        setUserInfo({
            username: '',
            adminName: '',
            adminEmail: '',
            branchTypeAdmin: '',
            branchId: '',
            adminSelfId: '',
            machineAttendance: '',
            sectionId: '',
            classId: '',
            dairy: '',
        });

        Swal.fire({
            title: 'Logged Out',
            text: 'You have been logged out successfully.',
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 1000,
            willClose: () => {
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1000);
            },
        });
    };

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole, userInfo, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
