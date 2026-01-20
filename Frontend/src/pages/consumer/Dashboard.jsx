import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Search, Send, Clock, ShieldCheck, Eye } from 'lucide-react';

const ConsumerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // 1. Mock Data: Platform par available Data Owners jise Consumer search karega
  const availableOwners = [
    { id: 'O-001', name: 'Vijay Deenanath', category: 'Health', records: 'Personal Health Records' },
    { id: 'O-002', name: 'Ravi Kumar', category: 'Finance', records: 'Financial History' },
    { id: 'O-003', name: 'Anita Sharma', category: 'Education', records: 'Academic Credentials' },
  ];

  // 2. Consumer ki apni Request History
  const [myRequests, setMyRequests] = useState([
    { id: 'REQ-101', owner: 'John Smith', type: 'Health', status: 'APPROVED', date: '2026-01-19' },
    { id: 'REQ-102', owner: 'Ravi Kumar', type: 'Finance', status: 'PENDING', date: '2026-01-20' },
  ]);

  const handleRequest = (ownerName) => {
    alert(`Request for access sent to ${ownerName}. It will now appear in their 'Access Requests' tab.`);
    // Real logic: Yahan backend API hit hogi jo Owner ke dashboard mein request add karegi
  };

  const filteredOwners = availableOwners.filter(o => 
    o.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      {/* Search Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Discover & Request Data</h2>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search owners or data categories (e.g. Health)..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredOwners.map(owner => (
            <div key={owner.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50 flex items-center justify-between hover:border-indigo-300 transition-all group">
              <div>
                <p className="font-bold text-slate-800 text-sm">{owner.name}</p>
                <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">{owner.category}</p>
              </div>
              <Button 
                size="sm" 
                onClick={() => handleRequest(owner.name)}
                className="rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Send size={14} className="mr-1" /> Request
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Access History Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="text-indigo-600" /> Your Access Status
          </h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Data Owner</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {myRequests.map(req => (
              <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{req.owner}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{req.type}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    req.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    disabled={req.status !== 'APPROVED'}
                    className="text-indigo-600 disabled:opacity-30"
                  >
                    <Eye size={16} className="mr-1" /> View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConsumerDashboard;