import axiosInstance from './axiosInstance';

// Scan a QR code to check a visitor in or out
export const scanPass = (data) =>
  axiosInstance.post('/checklogs/scan', data);

// Get all check logs, optionally filtered: getAllCheckLogs({ action: 'in', from: '2026-08-01', to: '2026-08-31' })
export const getAllCheckLogs = (params) =>
  axiosInstance.get('/checklogs', { params });

// Get check-in/out history for a specific pass
export const getLogsByPass = (passId) =>
  axiosInstance.get(`/checklogs/pass/${passId}`);