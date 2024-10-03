
import axios from 'axios';

// Create an instance of axios with environment-based configuration
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001', // Use env variable for API base URL
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Set a 10-second timeout for requests
});

// Add a request interceptor to include tokens automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    const client = localStorage.getItem('client');
    const uid = localStorage.getItem('uid');

    if (accessToken && client && uid) {
      config.headers['access-token'] = accessToken;
      config.headers['client'] = client;
      config.headers['uid'] = uid;
    }

    return config;
  },
  (error) => {
    // Handle request error here
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors and refresh tokens if needed
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that falls within the range of 2xx causes this function to trigger
    return response;
  },
  async (error) => {
    // Handle non-2xx responses
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors (e.g., token expiration)
    if (error.response && error.response.status === 401) {
      try {
        // Optionally: refresh token logic here if your backend supports it

        // Redirect to login page if necessary
        window.location.href = '/login';
      } catch (err) {
        console.error('Error refreshing token or redirecting:', err);
      }
    }

    // Global error handling for other status codes
    if (error.response && error.response.data) {
      console.error('Response error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
