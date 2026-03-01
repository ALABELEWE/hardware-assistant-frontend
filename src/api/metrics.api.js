import api from './axios';

export const metricsApi = {
  getMetrics: () => api.get('/metrics'),
};