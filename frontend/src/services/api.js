import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
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

// Handle response errors
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

// Auth services
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
};

// Patient services
export const patientService = {
  getProfile: () => api.get('/patients/profile'),
  updateProfile: (data) => api.put('/patients/profile', data),
  getDoctors: () => api.get('/patients/doctors'),
  getAvailableDays: (doctorId) => api.get(`/patients/availability/days?doctorId=${doctorId}`),
  getAvailability: (doctorId, date) => api.get(`/patients/availability?doctorId=${doctorId}&date=${date}`),
  getAppointments: () => api.get('/patients/appointments'),
  bookAppointment: (data) => api.post('/patients/appointments', data),
  getGoals: () => api.get('/patients/goals'),
  getGoalLogs: (goalId) => api.get(`/patients/goals/${goalId}/logs`),
  logGoalProgress: (goalId, data) => api.post(`/patients/goals/${goalId}/log`, data)
};

// Provider services
export const providerService = {
  getPatients: () => api.get('/providers/patients'),
  getPatientDetail: (patientId) => api.get(`/providers/patients/${patientId}`),
  getPatientGoals: (patientId) => api.get(`/providers/patients/${patientId}/goals`),
  setPatientGoal: (patientId, data) => api.post(`/providers/patients/${patientId}/goals`, data),
  getAvailability: () => api.get('/providers/availability'),
  setAvailability: (data) => api.put('/providers/availability', data)
};

// Public services
export const publicService = {
  getHealthInfo: () => api.get('/public/health-info')
};

export default api;
