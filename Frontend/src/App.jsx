import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './api/AuthContext'; 
import AppRoutes from './routes';
import Layout from './components/layout/Layout';

const AppContent = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-indigo-500 font-bold">
        Securing Environment...
      </div>
    );
  }

  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  // REDIRECT LOGIC: Login user ko login/register page pe nahi rehne dena
  if (user && isAuthPage) {
    const target = user.role === 'OWNER' ? '/owner/dashboard' : '/consumer/dashboard';
    return <Navigate to={target} replace />;
  }

  // PRIVATE VIEW: Logged in users ke liye Layout ke saath routes
  if (user && !isAuthPage && location.pathname !== '/') {
    return (
      <Layout>
        <AppRoutes />
      </Layout>
    );
  }

  // PUBLIC VIEW: Register, Login, aur Landing page ke liye
  return <AppRoutes />;
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;