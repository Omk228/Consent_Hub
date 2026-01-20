import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import RoleGuard from './auth/RoleGuard'; 
import { useAuth } from './api/AuthContext'; 

// Pages Imports
import Login from "./pages/auth/Login"; 
import Register from "./pages/auth/Register";
import OwnerDashboard from "./pages/owner/Dashboard";
import PendingRequests from './pages/owner/Requests';
import AuditLogs from './pages/owner/AuditLogs';
import MyRecords from './pages/owner/MyRecords';
import ConsentHistory from './pages/owner/ConsentHistory';
import ConsumerDashboard from './pages/consumer/Dashboard';
import SearchOwner from './pages/consumer/SearchOwner';

// MISSING IMPORTS ADDED HERE
import ConsumerRequests from './pages/consumer/Requests'; 
import ViewRecord from './pages/consumer/ViewRecord'; 

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Data Owner Routes */}
      <Route path="/owner/*" element={
        <ProtectedRoute>
          <RoleGuard allowedRole="OWNER">
            <Routes>
              <Route path="dashboard" element={<OwnerDashboard />} />
              <Route path="requests" element={<PendingRequests />} />
              <Route path="audit-logs" element={<AuditLogs />} />
              <Route path="record" element={<MyRecords />} />
              <Route path="consent-history" element={<ConsentHistory />} />
            </Routes>
          </RoleGuard>
        </ProtectedRoute>
      } />

      {/* Data Consumer Routes */}
      <Route path="/consumer/*" element={
        <ProtectedRoute>
          <RoleGuard allowedRole="CONSUMER">
            <Routes>
              <Route path="dashboard" element={<ConsumerDashboard />} />
              <Route path="search" element={<SearchOwner />} />
              <Route path="requests" element={<ConsumerRequests />} /> {/* Added this path */}
              <Route path="view/:id" element={<ViewRecord />} />
            </Routes>
          </RoleGuard>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;