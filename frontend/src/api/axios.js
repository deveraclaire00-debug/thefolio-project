// frontend/src/api/axios.js
import axios from 'axios';

export const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  (process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL.replace(/\/api\/?$/, '')
    : typeof window !== 'undefined'
    ? window.location.origin
    : 'http://localhost:5000');

const instance = axios.create({
  baseURL: BASE_URL,
});

// This interceptor runs before EVERY request.
// It reads the token from localStorage and adds it to the Authorization header.
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export default instance;

