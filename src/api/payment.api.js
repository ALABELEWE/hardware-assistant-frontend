import api from './axios';

export const paymentApi = {
  initialize: (plan) => api.post('/payment/initialize', { plan }),
  verify: (reference) => api.get(`/payment/verify/${reference}`),
};