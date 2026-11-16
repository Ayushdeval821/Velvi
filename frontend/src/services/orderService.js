import API from './api.js';

export const createOrder = (orderData) => API.post('/orders', orderData);
export const getMyOrders = (params = {}) => API.get('/orders/my', { params });
export const getOrderById = (id) => API.get(`/orders/${id}`);
