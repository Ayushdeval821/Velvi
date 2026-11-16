import API from './api.js';

export const getDashboardStats = () => API.get('/admin/dashboard');

// Products
export const adminGetProducts = (params = {}) => API.get('/admin/products', { params });
export const adminCreateProduct = (data) => API.post('/admin/products', data);
export const adminUpdateProduct = (id, data) => API.put(`/admin/products/${id}`, data);
export const adminDeleteProduct = (id) => API.delete(`/admin/products/${id}`);

// Categories
export const adminGetCategories = () => API.get('/admin/categories');
export const adminCreateCategory = (data) => API.post('/admin/categories', data);
export const adminUpdateCategory = (id, data) => API.put(`/admin/categories/${id}`, data);
export const adminDeleteCategory = (id) => API.delete(`/admin/categories/${id}`);

// Orders
export const adminGetOrders = (params = {}) => API.get('/admin/orders', { params });
export const adminUpdateOrder = (id, data) => API.put(`/admin/orders/${id}`, data);

// Customers
export const adminGetCustomers = (params = {}) => API.get('/admin/customers', { params });
export const adminGetCustomerDetails = (id) => API.get(`/admin/customers/${id}`);

// Enquiries
export const adminGetEnquiries = (params = {}) => API.get('/admin/enquiries', { params });
export const adminUpdateEnquiry = (id, data) => API.put(`/admin/enquiries/${id}`, data);
