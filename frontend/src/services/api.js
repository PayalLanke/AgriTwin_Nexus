import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to automatically attach JWT token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agritwin_jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const isBackendAvailable = async () => {
  try {
    const res = await axios.get('http://localhost:8000/', { timeout: 1500 });
    return res.data && res.data.status === 'online';
  } catch (e) {
    return false;
  }
};
