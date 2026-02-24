import api from './axios';

export const analysisApi = {
  generate: (sendSms = false) => api.post(`/analysis/generate?sendSms=${sendSms}`),
  getHistory: (page = 0, size = 10) => api.get(`/analysis/history?page=${page}&size=${size}`),
};