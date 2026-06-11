import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.endsWith('/api')) {
  baseURL = `${import.meta.env.VITE_API_URL}/api`;
}

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
