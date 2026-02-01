import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.audiotruyenfree.site/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Only run on client-side to access localStorage
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Return only data from response
        return response.data;
    },
    (error) => {
        // Handle common errors
        if (error.response) {
            // Server responded with a status code outside 2xx range
            if (error.response.status === 401) {
                // Unauthorized - Redirect to login if on client side
                if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/dang-nhap')) {
                    // window.location.href = '/dang-nhap'; // Uncomment to enable auto-redirect
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
