import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to unwrap data and handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error.response?.data || { message: error.message });
  }
);
