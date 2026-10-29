import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

import IssuePassPage from '../pages/frontdesk/IssuePassPage';

import RegisterVisitorPage from '../pages/frontdesk/RegisterVisitorPage';
import AppointmentsPage from '../pages/admin/AppointmentsPage';

import FrontdeskAppointmentsPage from '../pages/frontdesk/AppointmentsPage';

import AdminDashboard from '../pages/admin/AdminDashboard';
import ReportsPage from '../pages/admin/ReportsPage';
import ManageUsersPage from '../pages/admin/ManageUsersPage';

import FrontdeskDashboard from '../pages/frontdesk/FrontdeskDashboard';
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';
import MyAppointmentsPage from '../pages/employee/MyAppointmentsPage';
import VisitorDashboard from '../pages/visitor/VisitorDashboard';
// import PassViewPage from '../pages/visitor/PassViewPage';
// import NotFoundPage from '../pages/NotFoundPage';

import ScanPage from '../pages/frontdesk/ScanPage';

import VisitorsPage from '../pages/admin/VisitorsPage';
import PassesPage from '../pages/admin/PassesPage';



const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

     <Route path="/frontdesk/scan" element={
  <ProtectedRoute allowedRoles={['frontdesk', 'admin']}>
    <ScanPage />
  </ProtectedRoute>
} />

<Route path="/admin/scan" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <ScanPage />
  </ProtectedRoute>
} />

      <Route path="/admin/reports" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <ReportsPage />
        </ProtectedRoute>
      } />

      <Route path="/admin/staff" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <ManageUsersPage />
        </ProtectedRoute>
      } />

      <Route path="/frontdesk/issue-pass" element={
        <ProtectedRoute allowedRoles={['frontdesk', 'admin']}>
          <IssuePassPage />
        </ProtectedRoute>
      } />

      <Route path="/admin/appointments" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AppointmentsPage />
        </ProtectedRoute>
      } />

      <Route path="/admin/visitors" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <VisitorsPage />
  </ProtectedRoute>
} />

<Route path="/admin/passes" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <PassesPage />
  </ProtectedRoute>
} />

      <Route path="/frontdesk/appointments" element={
  <ProtectedRoute allowedRoles={['frontdesk', 'admin']}>
    <FrontdeskAppointmentsPage />
  </ProtectedRoute>
} />

      <Route path="/frontdesk/register-visitor" element={
        <ProtectedRoute allowedRoles={['frontdesk', 'admin']}>
          <RegisterVisitorPage />
        </ProtectedRoute>
      } />

      <Route path="/frontdesk/dashboard" element={
        <ProtectedRoute allowedRoles={['frontdesk']}>
          <FrontdeskDashboard />
        </ProtectedRoute>
      } />

      <Route path="/employee/dashboard" element={
        <ProtectedRoute allowedRoles={['employee']}>
          <EmployeeDashboard />
        </ProtectedRoute>
      } />

      <Route path="/employee/appointments" element={
        <ProtectedRoute allowedRoles={['employee']}>
          <MyAppointmentsPage />
        </ProtectedRoute>
      } />

      <Route path="/visitor/dashboard" element={
        <ProtectedRoute allowedRoles={['visitor']}>
          <VisitorDashboard />
        </ProtectedRoute>
      } />

      {/*
      <Route path="/pass/:qrToken" element={<PassViewPage />} />
      */}

      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
};

export default AppRoutes;