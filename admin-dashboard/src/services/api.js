import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api', // Backend API URL
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}` // Include JWT token in request headers
  }
});

// API to fetch subscription plans
export const fetchPlans = async () => {
  return await api.get('/plans');
};

// API to create a new subscription plan
export const createPlan = async (data) => {
  return await api.post('/plans', data);
};

// API to update an existing subscription plan
export const updatePlan = async (id, data) => {
  return await api.put(`/plans/${id}`, data);
};

// API to delete a subscription plan
export const deletePlan = async (id) => {
  return await api.delete(`/plans/${id}`);
};

export default api;
