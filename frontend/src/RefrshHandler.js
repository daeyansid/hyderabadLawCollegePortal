import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const RefrshHandler = ({ setIsAuthenticated }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userRole } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);

            // Redirect based on user role
            if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup') {
                if (userRole === 'branchAdmin') {
                    navigate('/branch-admin/dashboard', { replace: true });
                } else if (userRole === 'teacher') {
                    navigate('/teacher/dashboard', { replace: true });
                } else if (userRole === 'guardian') {
                    navigate('/guardian/dashboard', { replace: true });
                } else if (userRole === 'student') {
                    navigate('/student/dashboard', { replace: true });
                }
            }
        }
    }, [location, navigate, setIsAuthenticated, userRole]);

    return null;
};

export default RefrshHandler;
