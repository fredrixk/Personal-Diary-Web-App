import axios from 'axios';

// Use environment variable or detect if we're in production
const getApiUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  // In production, use relative URL (same domain)
  if (process.env.NODE_ENV === 'production') {
    return '/api';
  }
  // Development default
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;

