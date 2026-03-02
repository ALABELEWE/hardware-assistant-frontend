import api from './axios';

export const dataReadinessApi = {
  check: () => api.get('/data-readiness'),
};