import React, { useState } from 'react';
// Lucide icons standard hain, ye error nahi denge agar installed hain
import { Check, X, Hourglass, CheckCircle, XCircle, FileText, CalendarDays, Clock } from 'lucide-react';

const Requests = () => {
  const [activeFilter, setActiveFilter] = useState('Pending');

  // Initial Mock Data
  const [requests, setRequests] = useState([
    {
      id: 'REQ-001',
      requester: 'Acme Healthcare',
      requesterDoctor: 'Dr. Sarah Chen',
      status: 'PENDING',
      purpose: 'Medical Research Study on Cardiovascular Health',
      dataTypes: ['Health Records', 'Lab Results'],
      requestedDate: 'Jan 15, 2026',
      expiresDate: 'Jul 15, 2026',
    },
    {
      id: 'REQ-002',
      requester: 'DataCorp Analytics',
      requesterDoctor: 'Analytics Team',
      status: 'PENDING',
      purpose: 'Market Analysis for Consumer Trends',
      dataTypes: ['Demographics', 'Purchase History'],
      requestedDate: 'Jan 14, 2026',
      expiresDate: 'Jan 14, 2027',
    },
    {
      id: 'REQ-003',
      requester: 'FinTech Solutions',
      requesterDoctor: 'Risk Assessment Dept.',
      status: 'PENDING',
      purpose: 'Credit Scoring and Fraud Detection',
      dataTypes: ['Financial Transactions', 'Credit Score'],
      requestedDate: 'Jan 12, 2026',
      expiresDate: 'Feb 12, 2026',
    }
  ]);

  // Handler function with Audit Simulation
  const handleAction = (id, newState) => {
    setRequests(prev => 
      prev.map(req => req.id === id ? { ...req, status: newState } : req)
    );
    console.log(`Audit: Request ${id} set to ${newState} at ${new Date().toISOString()}`);
  };

  const filteredRequests = requests.filter(req => {
    if (activeFilter === 'All') return true;
    return req.status === activeFilter.toUpperCase();
  });

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Access Requests</h1>
        <p className="text-slate-500 mt-1">Review and manage data access permissions with full audit trail.</p>
      </div>

      {/* Custom Tabs (No external library needed) */}
      <div className="flex space-x-8 mb-8 border-b border-slate-200">
        {['Pending', 'Approved', 'Denied', 'All'].map((tab) => (
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
        {filteredRequests.length > 0 ? (
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

              {request.status === 'PENDING' && (
                <div className="flex flex-row md:flex-col gap-3 mt-6 md:mt-0 md:ml-10 w-full md:w-auto">
                  <button
                    onClick={() => handleAction(request.id, 'APPROVED')}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center px-8 py-3 rounded-2xl shadow-lg shadow-indigo-100 transition-all font-bold active:scale-95"
                  >
                    <Check className="w-4 h-4 mr-2" /> Approve
                  </button>
                  <button
                    onClick={() => handleAction(request.id, 'DENIED')}
                    className="flex-1 bg-white border-2 border-slate-100 text-slate-500 hover:bg-slate-50 flex items-center justify-center px-8 py-3 rounded-2xl transition-all font-bold active:scale-95"
                  >
                    <X className="w-4 h-4 mr-2" /> Deny
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-100">
            <Hourglass className="mx-auto h-12 w-12 text-slate-200 mb-4 animate-pulse" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No requests found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;