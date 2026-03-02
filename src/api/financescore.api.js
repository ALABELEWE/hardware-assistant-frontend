import api from './axios';

export const financeScoreApi = {
  getScore: () => api.get('/finance-score'),
};