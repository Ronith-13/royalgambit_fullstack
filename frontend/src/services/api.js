import axios from 'axios';

const API_BASE_URL = 'https://royalgambit-fullstack.onrender.com/api';

console.log('API_BASE_URL:', API_BASE_URL);
console.log('Environment variables:', import.meta.env);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (username, email, password) => {
    console.log('Making register request to:', `${API_BASE_URL}/auth/register`);
    return api.post('/auth/register', { username, email, password });
  },
  
  login: (email, password) => {
    console.log('Making login request to:', `${API_BASE_URL}/auth/login`);
    return api.post('/auth/login', { email, password });
  }
};

// User API
export const userAPI = {
  getCurrentUser: () => 
    api.get('/users/me'),
  
  updateStats: (result, points) => 
    api.put('/users/me/stats', { result, points })
};

// News API
export const newsAPI = {
  getNews: () => 
    api.get('/news')
};

export default api;
