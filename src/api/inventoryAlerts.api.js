import api from './axios';

export const inventoryAlertsApi = {
  getAlerts: () => api.get('/inventory-alerts'),
};