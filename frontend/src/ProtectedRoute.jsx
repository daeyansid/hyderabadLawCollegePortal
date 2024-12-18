import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, userRole } = useAuth();
    const location = useLocation();

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // Loading state
    }


    return children;
};

export default ProtectedRoute;
