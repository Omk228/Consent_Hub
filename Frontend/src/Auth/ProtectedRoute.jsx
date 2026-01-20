import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../api/AuthContext'; // Path sync kiya

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  // Requirement: Authentication [cite: 17]
  if (!user) {
    // Redirect to login if not authenticated [cite: 18]
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;