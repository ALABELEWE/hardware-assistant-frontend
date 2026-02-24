import api from './axios';

export const merchantApi = {
  getProfile: () => api.get('/merchant/profile'),
  saveProfile: (data) => api.post('/merchant/profile', data),
};