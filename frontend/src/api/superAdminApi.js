// src/api/superAdminApi.js

import axios from 'axios';

// Base URL setup (adjust if necessary)
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/super-admin`;

// Function to fetch dashboard data
export const getDashboardData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard-data`, {
            headers: {
                // Include authorization headers if required
                // 'Authorization': `Bearer ${token}`
            },
        });
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch dashboard data.');
        }
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
    }
};
