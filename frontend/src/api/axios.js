// frontend/src/api/axios.js
import axios from 'axios';

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  (process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL.replace(/\/api\/?$/, '')
    : null) ||
  'http://localhost:5000';

const instance = axios.create({
  // Uses REACT_APP_API_URL from .env or .env.production
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// This interceptor runs before EVERY request.
// It reads the token from localStorage and adds it to the Authorization header.
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export const getUploadURL = (imagePath) => {
  if (!imagePath) return '';
  const filename = imagePath.replace(/^\/?uploads?\//i, '');
  return `${BACKEND_URL}/uploads/${filename}`;
};

export default instance;

