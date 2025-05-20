import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:800/api',
  withCredentials: true
});

// Función para obtener el token de manera segura
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  // Verifica que el token tenga el formato correcto
  if (token && token.startsWith('Bearer ')) {
    return token;
  }
  if (token) {
    return `Bearer ${token}`;
  }
  return null;
};

// Interceptor para añadir el token
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = token;
  } else {
    console.warn('No se encontró token JWT');
  }
  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redirige al login
    }
    return Promise.reject(error);
  }
);

export default api;