import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../api/AuthContext'; // Adjust path as necessary

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand/Logo - Optional, Header already has one */}
        {/* <Link to="/" className="text-xl font-bold text-gray-800">Dashboard</Link> */}

        {/* Conditional Navigation based on User Role */}
        <div className="flex-grow">
          <ul className="flex space-x-4">
            {user && user.role === 'OWNER' && (
              <>
                <li><Link to="/owner/dashboard" className="text-gray-600 hover:text-indigo-700 font-medium">Owner Dashboard</Link></li>
                <li><Link to="/owner/requests" className="text-gray-600 hover:text-indigo-700 font-medium">Requests</Link></li>
                <li><Link to="/owner/audit-logs" className="text-gray-600 hover:text-indigo-700 font-medium">Audit Logs</Link></li>
              </>
            )}
            {user && user.role === 'CONSUMER' && (
              <>
                <li><Link to="/consumer/dashboard" className="text-gray-600 hover:text-indigo-700 font-medium">Consumer Dashboard</Link></li>
                <li><Link to="/consumer/search" className="text-gray-600 hover:text-indigo-700 font-medium">Search Owner</Link></li>
              </>
            )}
          </ul>
        </div>

        {/* Right-aligned items - User Info / Logout */}
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user.email} ({user.role})</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-300"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-indigo-700 font-medium">Login</Link>
            <Link to="/register" className="text-gray-600 hover:text-indigo-700 font-medium">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;