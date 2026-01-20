import { Navigate } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';

const RoleGuard = ({ children, allowedRole }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (user.role !== allowedRole) return <Navigate to="/unauthorized" />;

  return children;
};

export default RoleGuard;