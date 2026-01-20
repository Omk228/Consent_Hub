import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { FileText, CheckCircle, XCircle, Hourglass, ShieldCheck, Clock } from 'lucide-react';

const OwnerDashboard = () => {
  // 1. Requirement: Data Owner state management for requests
  const [requests, setRequests] = useState([
    { id: 'REQ-001', requester: 'Acme Healthcare', purpose: 'Medical Research', dataType: 'Health Records', date: 'Jan 15, 2026', status: 'pending' },
    { id: 'REQ-002', requester: 'DataCorp Analytics', purpose: 'Market Analysis', dataType: 'Demographics', date: 'Jan 14, 2026', status: 'pending' },
    { id: 'REQ-003', requester: 'FinTech Solutions', purpose: 'Credit Scoring', dataType: 'Financial Data', date: 'Jan 12, 2026', status: 'pending' },
  ]);

  // 2. Requirement: Immutable Audit Logs state
  const [activityLogs, setActivityLogs] = useState([
    { id: 1, type: 'granted', description: 'MedResearch Lab', time: '2 hours ago' },
    { id: 2, type: 'revoked', description: 'OldPartner Corp', time: '1 day ago' },
  ]);

  // 3. Functional Requirement: Handle Approve/Reject with Timestamps
  const handleAction = (requestId, action) => {
    const timestamp = new Date().toLocaleTimeString();
    const targetReq = requests.find(r => r.id === requestId);

    // Update Request Status
    setRequests(prev => prev.filter(req => req.id !== requestId));

    // Create New Audit Log Entry
    const newEntry = {
      id: Date.now(),
      type: action === 'APPROVED' ? 'granted' : 'revoked',
      description: `${action}: ${targetReq.requester}`,
      time: `Just now (${timestamp})`
    };

    setActivityLogs([newEntry, ...activityLogs]);
  };

  const activityIcon = (type) => {
    switch (type) {
      case 'granted': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'revoked': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'denied': return <ShieldCheck className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back, John</h2>
        <p className="text-slate-500">Manage your data consents and track access history.</p>
      </div>

      {/* Pending Access Requests Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Hourglass className="h-5 w-5 text-indigo-500" /> Pending Access Requests
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Requester</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Purpose</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.length === 0 ? (
                  <tr><td colSpan="3" className="py-10 text-center text-slate-400">No pending requests</td></tr>
                ) : (
                  requests.map((request) => (
                    <tr key={request.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">{request.requester}</p>
                        <p className="text-xs text-slate-500">{request.dataType}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{request.purpose}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button 
                          onClick={() => handleAction(request.id, 'APPROVED')}
                          variant="outline" 
                          size="sm" 
                          className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                        >
                          Approve
                        </Button>
                        <Button 
                          onClick={() => handleAction(request.id, 'REJECTED')}
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Log (Audit Trail) */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-500" /> Audit Trail
          </h3>
          <ul className="space-y-6">
            {activityLogs.map((activity) => (
              <li key={activity.id} className="flex items-start space-x-3 group">
                <div className="mt-1 p-1 bg-slate-50 rounded-full group-hover:scale-110 transition-transform">
                  {activityIcon(activity.type)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{activity.description}</p>
                  <p className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">{activity.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;