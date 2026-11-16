import API from './api.js';

export const register = (userData) => API.post('/auth/register', userData);
export const login = (credentials) => API.post('/auth/login', credentials);
export const getProfile = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const addAddress = (address) => API.post('/auth/address', address);
export const deleteAddress = (addressId) => API.delete(`/auth/address/${addressId}`);
