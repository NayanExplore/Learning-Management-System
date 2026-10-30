import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Authorization Bearer token for cross-domain requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sf_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: propagate errors with status intact so callers can distinguish 401 vs 5xx
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Attach the HTTP status to the rejection payload so AuthContext can check it
    const status = error.response?.status;
    const payload = error.response?.data || { message: error.message };
    payload.status = status;
    return Promise.reject(payload);
  }
);
