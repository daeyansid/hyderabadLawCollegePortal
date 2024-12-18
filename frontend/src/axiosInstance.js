import axios from "axios";

// Create an axios instance with the base URL for your API
const axiosInstance = axios.create({
  // baseURL: 'http://localhost:5000/api', // Adjust base URL as necessary
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
});

// Add a request interceptor to include Authorization headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      // Ensure the token is formatted with 'Bearer ' prefix
      config.headers["Authorization"] = token;
    } else {
      console.warn("Token not found in localStorage");
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle global response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Handle unauthorized errors (401) specifically
      if (status === 401) {
        console.error(
          "Unauthorized:",
          data.message || "JWT token wrong or expired"
        );
        // Handle expired or invalid token - prompt user to login
        alert("Session expired or unauthorized. Please log in again.");
        // Clear the token and redirect to login page
        localStorage.removeItem("token");
        window.location.href = "/login"; // Redirect to login page
      } else {
        console.error("Response error:", status, data);
      }
    } else {
      console.error("Network or configuration error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
