import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 3000,
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

let cachedBackendStatus = null;
let lastCheckTime = 0;

export const isBackendAvailable = async () => {
  const now = Date.now();
  // Cache result for 10 seconds to eliminate repeated 2-second page loading freezes
  if (cachedBackendStatus !== null && now - lastCheckTime < 10000) {
    return cachedBackendStatus;
  }

  try {
    const res = await axios.get('http://localhost:8000/', { timeout: 400 });
    cachedBackendStatus = res.data && res.data.status === 'online';
  } catch (e) {
    cachedBackendStatus = false;
  }
  lastCheckTime = Date.now();
  return cachedBackendStatus;
};
