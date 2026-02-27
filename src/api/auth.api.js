import api from './axios';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (email) =>
    api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) =>
    api.post('/auth/reset-password', { token, password }),
  verifyEmail:         (token) =>
  api.post('/auth/verify-email', { token }),

  resendVerification:  (email) =>
    api.post('/auth/resend-verification', { email }),
};