import axiosInstance from './axiosInstance';

// Get all users, optionally filtered by role: getAllUsers('frontdesk')
export const getAllUsers = (role) =>
  axiosInstance.get('/users', { params: role ? { role } : {} });

export const getUserById = (id) =>
  axiosInstance.get(`/users/${id}`);

// Admin creates a staff account (frontdesk/employee/admin)
export const createUser = (data) =>
  axiosInstance.post('/users', data);

export const updateUser = (id, data) =>
  axiosInstance.put(`/users/${id}`, data);

export const deleteUser = (id) =>
  axiosInstance.delete(`/users/${id}`);

export const getHostsList = () =>
  axiosInstance.get('/users/hosts');