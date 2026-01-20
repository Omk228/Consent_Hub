import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../api/AuthContext';
import { Search, Bell } from 'lucide-react';

const Header = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getTitle = () => {
    const path = location.pathname;
    // Define your route-to-title mapping here
    if (path.startsWith('/owner/dashboard')) return 'Dashboard';
    if (path.startsWith('/owner/record')) return 'My Records';
    if (path.startsWith('/owner/requests')) return 'Access Requests';
    if (path.startsWith('/owner/audit-logs')) return 'Audit Logs';
    if (path.startsWith('/owner/consent-history')) return 'Consent History';
    // Add more routes as needed
    return 'Dashboard'; // Default title
  };

  return (
    <header className="bg-gray-100 shadow-md px-8 py-4 sticky top-0 z-50">
      <div className="flex justify-between items-center w-full">
        {/* Dynamic Title */}
        <h1 className="text-2xl font-bold text-gray-800">{getTitle()}</h1>

        {/* Search and Notifications */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button className="relative p-2 text-gray-500 hover:text-gray-700">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">3</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
