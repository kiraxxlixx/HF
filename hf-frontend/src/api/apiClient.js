// hf-frontend/src/api/apiClient.js

import axios from 'axios';

const API_BASE_URL = 'https://api.happyfactory.mx/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor para inyectar el JWT en todas las peticiones protegidas.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor para manejar respuestas 401/403 (Token expirado o rol incorrecto).
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error("Token expirado o acceso denegado. Forzando logout.");
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      // NOTA: En la App real, esto forzaría un logout via el AuthContext
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default apiClient;