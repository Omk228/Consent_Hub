import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Eye, ShieldCheck, Search } from 'lucide-react';

const ConsumerRequests = () => {
  const navigate = useNavigate();

  // Mock data: Real app mein ye state ya API se aayega
  const [myRequests] = useState([
    { id: 'REQ-001', ownerName: "Vijay Deenanath", status: "APPROVED", type: "Health Records", date: "Jan 20, 2026" },
    { id: 'REQ-002', ownerName: "Ravi Kumar", status: "PENDING", type: "Financial Data", date: "Jan 19, 2026" },
  ]);

  return (
    <div className="p-2 space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Requests</h1>
        <p className="text-slate-500 font-medium">Track your data access requests and view approved records.</p>
      </div>

      <div className="grid gap-4">
        {myRequests.map((req) => (
          <div key={req.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${req.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                <Clock size={24} />
              </div>
              <div>
                <p className="font-bold text-slate-900">{req.ownerName}</p>
                <p className="text-xs text-indigo-600 font-bold uppercase">{req.type}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {req.status}
              </span>
              <button 
                disabled={req.status !== 'APPROVED'}
                onClick={() => navigate(`/consumer/view/${req.id}`)}
                className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold disabled:opacity-20 transition-all hover:bg-slate-800"
              >
                <Eye size={14} /> View Data
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsumerRequests;