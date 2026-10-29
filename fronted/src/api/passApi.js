import axiosInstance from './axiosInstance';

// Issue a new pass (walk-in or after appointment approval)
export const issuePass = (data) =>
  axiosInstance.post('/passes', data);

// Get all passes, optionally filtered: getAllPasses({ status: 'active' })
export const getAllPasses = (params) =>
  axiosInstance.get('/passes', { params });

export const getPassById = (id) =>
  axiosInstance.get(`/passes/${id}`);

// Public — no auth needed, used on the visitor-facing pass view page
export const getPassByToken = (qrToken) =>
  axiosInstance.get(`/passes/token/${qrToken}`);

export const revokePass = (id) =>
  axiosInstance.patch(`/passes/${id}/revoke`);