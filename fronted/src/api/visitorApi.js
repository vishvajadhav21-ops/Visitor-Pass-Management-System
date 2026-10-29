import axiosInstance from './axiosInstance';

// Register a new visitor — must send FormData since it includes a photo file
export const registerVisitor = (formData) =>
  axiosInstance.post('/visitors', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Get all visitors, optionally filtered: getAllVisitors({ search: 'john', host: '<id>' })
export const getAllVisitors = (params) =>
  axiosInstance.get('/visitors', { params });

export const getVisitorById = (id) =>
  axiosInstance.get(`/visitors/${id}`);

// Update visitor — also FormData if a new photo is being uploaded
export const updateVisitor = (id, formData) =>
  axiosInstance.put(`/visitors/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteVisitor = (id) =>
  axiosInstance.delete(`/visitors/${id}`);