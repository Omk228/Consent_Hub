import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Users, History, FileText, Search, ShieldCheck, Settings, User, LogOut, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../api/AuthContext';
import clsx from 'clsx';
import { useState } from 'react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const [currentRole, setCurrentRole] = useState(user?.role || 'OWNER');

  const ownerLinks = [
    { name: 'Dashboard', path: '/owner/dashboard', icon: LayoutDashboard },
    { name: 'My Records', path: '/owner/record', icon: FileText },
    { name: 'Access Requests', path: '/owner/requests', icon: Users },
    { name: 'Consent History', path: '/owner/consent-history', icon: History },
    { name: 'Audit Logs', path: '/owner/audit-logs', icon: ShieldCheck },
  ];

  const consumerLinks = [
    { name: 'Dashboard', path: '/consumer/dashboard', icon: LayoutDashboard },
    { name: 'Search Records', path: '/consumer/search', icon: Search },
    { name: 'My Requests', path: '/consumer/requests', icon: Users },
  ];

  const links = currentRole === 'OWNER' ? ownerLinks : consumerLinks;

  return (
    <aside className={clsx(
      "fixed top-0 left-0 h-screen flex flex-col bg-[#1a1c29] text-white transition-all duration-300 ease-in-out z-50 shadow-2xl",
      isOpen ? "w-64" : "w-20"
    )}>
      
      {/* Header Section */}
      <div className="flex items-center justify-between p-6 shrink-0">
        <h1 className={clsx("text-xl font-bold text-indigo-400 tracking-tight", { "hidden": !isOpen })}>
          ConsentHub
        </h1>
        <button onClick={() => setIsOpen(!isOpen)} className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors">
          <ChevronLeft className={clsx("h-5 w-5 transform transition-transform duration-300", { "rotate-180": !isOpen })} />
        </button>
      </div>

      {/* Role Toggle Section */}
      {user && isOpen && (
        <div className="px-4 pb-4 shrink-0">
          <div className="flex rounded-xl bg-gray-800/50 p-1 text-[10px] font-bold uppercase tracking-wider">
            <button
              onClick={() => setCurrentRole('OWNER')}
              className={clsx("flex-1 text-center py-2 rounded-lg transition-all", currentRole === 'OWNER' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300')}
            >
              Data Owner
            </button>
            <button
              onClick={() => setCurrentRole('CONSUMER')}
              className={clsx("flex-1 text-center py-2 rounded-lg transition-all", currentRole === 'CONSUMER' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300')}
            >
              Consumer
            </button>
          </div>
        </div>
      )}

      {/* Navigation Links Area */}
      <nav className="flex-1 mt-2 px-3 space-y-1 overflow-y-auto scrollbar-hide">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group',
                isActive 
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                { "justify-center": !isOpen }
              )
            }
          >
            <link.icon className={clsx("h-5 w-5 shrink-0 transition-transform group-hover:scale-110", { "mr-3": isOpen })} />
            <span className={clsx("truncate", { "hidden": !isOpen })}>{link.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info Section */}
      <div className="mt-auto shrink-0 bg-[#161824]">
        {user && isOpen && (
          <div className="px-4 py-4 border-t border-gray-800/50">
            <div className="flex items-center space-x-3 mb-4 p-2 rounded-xl bg-gray-800/30">
              <div className="h-9 w-9 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                <User size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center py-2.5 px-3 text-xs font-bold rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        )}

        <div className="px-4 py-3 border-t border-gray-800/50">
          <Link to="/settings" className={clsx(
            "w-full flex items-center py-2 text-xs font-bold rounded-xl text-gray-500 hover:text-white transition-colors",
            { "justify-center": !isOpen, "px-3": isOpen }
          )}>
            <Settings className="h-4 w-4 shrink-0" />
            <span className={clsx("ml-3", { "hidden": !isOpen })}>Settings</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;