import React from 'react';
import { BrowserRouter as Router, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './api/AuthContext'; 
import AppRoutes from './routes';
import Layout from './components/layout/Layout';

const AppContent = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const authPaths = ['/login', '/register', '/']; 
  const isAuthPage = authPaths.includes(location.pathname);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-indigo-500 font-bold">
        Securing Environment...
      </div>
    );
  }

  // FIXED REDIRECTION: Agar user login hai aur login/register page par hai, toh dashboard bhej do
  if (user && isAuthPage && location.pathname !== '/') {
    const targetDashboard = user.role === 'OWNER' ? '/owner/dashboard' : '/consumer/dashboard';
    return <Navigate to={targetDashboard} replace />;
  }

  // Dashboard View with Layout
  if (user && !isAuthPage) {
    return (
      <Layout>
        <AppRoutes />
      </Layout>
    );
  }

  // Public View (Login, Register, Landing)
  return <AppRoutes />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;