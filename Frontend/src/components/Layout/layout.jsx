import { useAuth } from '../../api/AuthContext';
import Sidebar from './SideBar';
import Header from './Header';
import Footer from './Footer';
import { useState } from 'react';

const Layout = ({ children }) => {
  const { user } = useAuth();
  // Sidebar ki state yahan handle hogi taaki layout adjust ho sake
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      
      {/* Sidebar ko state pass ki hai toggle control ke liye */}
      {user && (
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
        />
      )}

      {/* Main Area: Jab Sidebar open hoga toh pl-64, band hoga toh pl-20 padding-left legi */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
        user ? (isSidebarOpen ? 'pl-64' : 'pl-20') : 'pl-0'
      }`}>
        
        <Header />

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto min-h-full flex flex-col">
            
            {/* Page Content */}
            <div className="flex-1">
              {children}
            </div>

            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;