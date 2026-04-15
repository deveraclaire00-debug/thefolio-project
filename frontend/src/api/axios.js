import axios from 'axios';

// API instance (for routes like /api/posts)
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// ✅ ADD THIS (for images)
export const BASE_URL =
  process.env.REACT_APP_API_URL?.replace('/api', '') ||
  'http://localhost:5000';

// Token interceptor
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;