import API from './api.js';

export const sendEnquiry = (enquiryData) => API.post('/enquiries', enquiryData);
