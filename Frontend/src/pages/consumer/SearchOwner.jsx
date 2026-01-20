import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Search, Send, User, ShieldCheck, Globe, Loader2 } from 'lucide-react';

const SearchOwner = () => {
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [foundOwner, setFoundOwner] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Simulation: API call delay
    setTimeout(() => {
      // Mock data matching your project theme
      setFoundOwner({ 
        id: 'owner_123', 
        name: 'Vijay Deenanath', 
        email: email,
        category: 'Health & Finance',
        location: 'Mumbai, India'
      });
      setIsSearching(false);
    }, 800);
  };

  const sendRequest = () => {
    alert(`Success: Access request for '${foundOwner.name}' has been logged and sent.`);
    // Assignment Requirement: Logged action simulation
    console.log(`Action: Request Sent | Target: ${foundOwner.email} | Timestamp: ${new Date().toISOString()}`);
  };

  return (
    <div className="p-2 space-y-8 animate-in fade-in duration-500">
      {/* Search Header */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Search className="text-indigo-600" /> Find Data Owner
          </h2>
          <p className="text-slate-500 font-medium">Search for users by their verified work email to request data access.</p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="email"
              placeholder="Enter owner's verified email (e.g. owner@test.com)..."
              className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition-all font-medium text-slate-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button 
            type="submit" 
            disabled={isSearching}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-xl font-bold shadow-lg shadow-indigo-100 flex items-center justify-center min-w-[140px]"
          >
            {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Search className="h-4 w-4 mr-2" /> Search</>}
          </Button>
        </form>
      </div>

      {/* Result Card */}
      {foundOwner ? (
        <div className="bg-white p-8 rounded-3xl border-2 border-indigo-50 shadow-md flex flex-col md:flex-row justify-between items-center gap-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100">
              <User size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900">{foundOwner.name}</h3>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">Verified Owner</span>
              </div>
              <p className="text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                <Globe size={14} className="text-slate-300" /> {foundOwner.email}
              </p>
              <div className="flex gap-2 mt-3">
                {foundOwner.category.split('&').map(cat => (
                  <span key={cat} className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md uppercase">
                    {cat.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8 flex flex-col items-center gap-3">
             <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                <ShieldCheck size={14} className="text-indigo-400" /> Secure Protocol
             </div>
             <Button 
                variant="primary" 
                onClick={sendRequest}
                className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-200 transition-all active:scale-95"
              >
                <Send className="h-4 w-4 mr-2" /> Request Access
              </Button>
          </div>
        </div>
      ) : (
        !isSearching && (
            <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <div className="bg-white h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <ShieldCheck className="text-slate-300" size={32} />
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Enter an email to find an authorized data owner</p>
            </div>
        )
      )}
    </div>
  );
};

export default SearchOwner;