import axios from 'axios';

// Central axios instance to keep base URL and auth headers in one place
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // allow sending/receiving cookies for auth
});

// Attach Authorization header when a token is available
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
