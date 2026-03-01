import api from './axios';

export const dataApi = {
  // Products
  getProducts:   (includeInactive = false) =>
    api.get(`/data/products?includeInactive=${includeInactive}`),
  createProduct: (data)       => api.post('/data/products', data),
  updateProduct: (id, data)   => api.put(`/data/products/${id}`, data),
  deleteProduct: (id)         => api.delete(`/data/products/${id}`),

  // Sales
  getSales:   (page = 0, size = 20) =>
    api.get(`/data/sales?page=${page}&size=${size}`),
  recordSale: (data)  => api.post('/data/sales', data),
  deleteSale: (id)    => api.delete(`/data/sales/${id}`),

  // Expenses
  getExpenses:    (page = 0, size = 20) =>
    api.get(`/data/expenses?page=${page}&size=${size}`),
  recordExpense:  (data) => api.post('/data/expenses', data),
  deleteExpense:  (id)   => api.delete(`/data/expenses/${id}`),

  // Inventory
  getInventory:        (page = 0, size = 20) =>
    api.get(`/data/inventory?page=${page}&size=${size}`),
  getCurrentInventory: ()     => api.get('/data/inventory/current'),
  recordInventory:     (data) => api.post('/data/inventory', data),
  deleteInventory:     (id)   => api.delete(`/data/inventory/${id}`),
};