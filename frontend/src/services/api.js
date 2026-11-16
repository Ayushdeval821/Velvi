import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Attach JWT token to requests
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('velvi_user');
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (e) {
        // ignore
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with clear diagnostics
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'An unexpected error occurred';

    // 1. If backend returned a structured JSON error { success: false, message: "..." }
    if (error.response?.data?.message) {
      message = error.response.data.message;
    }
    // 2. If Vite proxy failed to reach backend on port 5000 (Vite returns 500 with HTML ECONNREFUSED)
    else if (
      (error.response?.status === 500 || error.response?.status === 502 || error.response?.status === 504) &&
      typeof error.response?.data === 'string' &&
      (error.response.data.includes('ECONNREFUSED') || error.response.data.includes('proxy error'))
    ) {
      message =
        'Backend server is not running on port 5000. Please open a terminal in the backend folder and run `npm run dev`.';
    }
    // 3. Direct Network Error
    else if (error.message === 'Network Error') {
      message =
        'Cannot connect to server. Please ensure the backend server is running on port 5000 (`npm run dev` in backend).';
    }
    // 4. Timeout
    else if (error.code === 'ECONNABORTED') {
      message = 'Request timed out. Please check if the backend server is responding.';
    }
    // 5. Fallback message
    else if (error.response?.data && typeof error.response.data === 'string') {
      message = error.response.data;
    } else if (error.message) {
      message = error.message;
    }

    return Promise.reject(new Error(message));
  }
);

export default API;
