import axiosInstance from './axiosInstance';

// Create a new appointment / pre-registration invite
export const createAppointment = (data) =>
  axiosInstance.post('/appointments', data);

// Get all appointments, optionally filtered: getAllAppointments({ status: 'pending', host: '<id>' })
export const getAllAppointments = (params) =>
  axiosInstance.get('/appointments', { params });

export const getMyAppointments = () =>
  axiosInstance.get('/appointments/my');

export const getAppointmentById = (id) =>
  axiosInstance.get(`/appointments/${id}`);

export const approveAppointment = (id) =>
  axiosInstance.patch(`/appointments/${id}/approve`);

export const rejectAppointment = (id, rejectionReason) =>
  axiosInstance.patch(`/appointments/${id}/reject`, { rejectionReason });

export const cancelAppointment = (id) =>
  axiosInstance.patch(`/appointments/${id}/cancel`);

export const requestAppointment = (data) =>{
  axiosInstance.post('/appointments/request', data);
}