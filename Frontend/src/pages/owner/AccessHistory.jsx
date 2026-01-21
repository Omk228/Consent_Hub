import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../api/AuthContext';
// Lucide icons standard hain, ye error nahi denge agar installed hain
import { Check, X, Hourglass, CheckCircle, XCircle, FileText, CalendarDays, Clock, Loader2 } from 'lucide-react';

const AccessHistory = () => {
  const { user: authUser, loading: authLoading } = useAuth();
  const [activeFilter, setActiveFilter] = useState('Pending');
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [errorRequests, setErrorRequests] = useState('');

  const fetchRequests = async () => {
    try {
      setLoadingRequests(true);
      const response = await api.get('/owner/all-requests'); // Naya endpoint
      setRequests(response.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setErrorRequests('Failed to fetch requests.');
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (!authLoading && authUser) {
      fetchRequests();
    }
  }, [authLoading, authUser]);

  const filteredRequests = requests.filter(req => {
    if (activeFilter === 'All') return true;
    return req.status === activeFilter.toUpperCase();
  });

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Access History</h1>
        <p className="text-slate-500 mt-1">View your complete history of data access requests and their statuses.</p>
      </div>

      {/* Custom Tabs (No external library needed) */}
      <div className="flex space-x-8 mb-8 border-b border-slate-200">
        {['Pending', 'Approved', 'Rejected', 'Revoked', 'All'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeFilter === tab ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Request Cards Grid */}
      <div className="grid grid-cols-1 gap-6">
        {loadingRequests ? (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-100">
            <Loader2 className="mx-auto h-12 w-12 text-indigo-500 mb-4 animate-spin" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Loading requests...</p>
          </div>
        ) : errorRequests ? (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-red-100">
            <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <p className="text-red-500 font-bold uppercase tracking-widest text-sm">{errorRequests}</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-100">
            <Hourglass className="mx-auto h-12 w-12 text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No requests found in this category</p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition-shadow duration-300">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-300 tracking-widest uppercase">{request.id}</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                    request.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 
                    request.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {request.status}
                  </span>
                </div>
                
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{request.requester}</h2>
                  <p className="text-sm text-indigo-500 font-semibold">{request.requesterDoctor}</p>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Purpose of Data Access</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{request.purpose}</p>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                  <span className="flex items-center gap-2"><FileText size={14} /> {request.dataTypes.join(', ')}</span>
                  <span className="flex items-center gap-2"><CalendarDays size={14} /> Requested: {request.requestedDate}</span>
                  <span className="flex items-center gap-2"><Clock size={14} /> Expires: {request.expiresDate}</span>
                </div>
              </div>
            </div>
          )) // Close map
        )} // Close ternary
      </div>
    </div>
  );
};

export default AccessHistory;