import axiosInstance from './axiosInstance';

// Dashboard summary stats (totalVisitors, todaysCheckIns, currentlyInBuilding, etc.)
export const getSummary = () =>
  axiosInstance.get('/reports/summary');

// Visits grouped by day, for charts: getVisitsByDay({ from: '2026-08-01', to: '2026-08-31' })
export const getVisitsByDay = (params) =>
  axiosInstance.get('/reports/visits-by-day', { params });

// These return file blobs (CSV/Excel), not JSON — handled differently in the component
export const exportVisitorsCSV = (params) =>
  axiosInstance.get('/reports/export/csv', { params, responseType: 'blob' });

export const exportVisitorsExcel = (params) =>
  axiosInstance.get('/reports/export/excel', { params, responseType: 'blob' });