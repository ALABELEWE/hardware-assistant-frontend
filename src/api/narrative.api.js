import api from './axios';

export const narrativeApi = {
  generate: () => api.post('/narrative/generate'),
};