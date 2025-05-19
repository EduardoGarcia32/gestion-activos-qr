import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:800/api', // Asegúrate que coincida con tu puerto del backend
    withCredentials: true
});

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;