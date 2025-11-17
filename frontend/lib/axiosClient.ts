import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

const axiosClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

axiosClient.interceptors.request.use((config) => {
  try {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('notes_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (e) {
  }
  return config;
}, (error) => Promise.reject(error));

axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('notes_token');
          localStorage.removeItem('notes_user');
          window.location.href = '/login';
        }
      } catch (e) {}
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
