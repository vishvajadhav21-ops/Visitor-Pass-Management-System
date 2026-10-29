import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Wait until we've checked localStorage for an existing session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-slate-500 text-sm">Loading...</p>
      </div>
    );
  }

  // Not logged in at all → send to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, but role isn't allowed for this page → send to their own dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  // Logged in and authorized → render the actual page
  return children;
};

export default ProtectedRoute;