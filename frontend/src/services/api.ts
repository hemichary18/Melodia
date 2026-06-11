import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.endsWith('/api')) {
  baseURL = `${import.meta.env.VITE_API_URL}/api`;
}

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  try {
    const storageData = localStorage.getItem('auth-storage');
    if (storageData) {
      const { state } = JSON.parse(storageData);
      if (state?.user?.token) {
        config.headers.Authorization = `Bearer ${state.user.token}`;
      }
    }
  } catch (error) {
    console.error('Failed to parse auth token from local storage', error);
  }
  return config;
});

export default api;
