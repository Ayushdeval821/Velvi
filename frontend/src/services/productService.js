import API from './api.js';

export const getProducts = (params = {}) => API.get('/products', { params });
export const getFeaturedProducts = (limit = 4) => API.get('/products/featured', { params: { limit } });
export const getProductByIdOrSlug = (idOrSlug) => API.get(`/products/${idOrSlug}`);
