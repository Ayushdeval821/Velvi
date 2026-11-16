import API from './api.js';

export const getRazorpayKey = () => API.get('/payments/key');
export const createRazorpayOrder = (orderId) => API.post('/payments/create-order', { orderId });
export const verifyPayment = (paymentData) => API.post('/payments/verify', paymentData);
