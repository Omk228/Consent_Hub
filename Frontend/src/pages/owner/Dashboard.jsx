import React, { useState, useEffect } from 'react';
import api from '../../api/axios'; 
import { useAuth } from '../../api/AuthContext'; 
import { Button } from '../../components/common/Button';
import { FileText, CheckCircle, XCircle, Hourglass, ShieldCheck, Clock, Loader2 } from 'lucide-react';

const OwnerDashboard = () => {
  const { user: authUser, loading: authLoading } = useAuth();
  const [requests, setRequests] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [errorRequests, setErrorRequests] = useState('');
  const [errorActivities, setErrorActivities] = useState('');

  const fetchRequests = async () => {
    try {
      setLoadingRequests(true);
      const response = await api.get('/consents/owner-requests'); // Adjust endpoint as per backend
      setRequests(response.data);
    } catch (err) {
      console.error('Error fetching owner requests:', err);
      setErrorRequests('Failed to fetch pending requests.');
    } finally {
      setLoadingRequests(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      setLoadingActivities(true);
      const response = await api.get('/owner/audit-logs'); // New endpoint for audit logs
      setActivityLogs(response.data);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setErrorActivities('Failed to fetch audit logs.');
    } finally {
      setLoadingActivities(false);
    }
  };

  // 3. Functional Requirement: Handle Approve/Reject with Timestamps
  const handleAction = async (requestId, action) => {
    try {
      const response = await api.post('/consents/respond', { 
        requestId,
        status: action 
      });
      alert(response.data.message);
      fetchRequests();
      fetchAuditLogs();
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || 'Failed to update request'}`);
    }
  };

  useEffect(() => {
    if (!authLoading && authUser) {
      fetchRequests();
      fetchAuditLogs();
    }
  }, [authLoading, authUser]);

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
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back, {authUser.name}</h2>
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
                {loadingRequests ? (
                  <tr><td colSpan="3" className="py-10 text-center"><Loader2 className="animate-spin mx-auto text-indigo-500" /></td></tr>
                ) : errorRequests ? (
                  <tr><td colSpan="3" className="py-10 text-center text-red-500">{errorRequests}</td></tr>
                ) : requests.length === 0 ? (
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
            {loadingActivities ? (
              <li className="text-center py-4"><Loader2 className="animate-spin mx-auto text-indigo-500" /></li>
            ) : errorActivities ? (
              <li className="text-center py-4 text-red-500">{errorActivities}</li>
            ) : activityLogs.length === 0 ? (
              <li className="text-center py-4 text-slate-400">No recent activity.</li>
            ) : (
              activityLogs.map((activity) => (
                <li key={activity.id} className="flex items-start space-x-3 group">
                  <div className="mt-1 p-1 bg-slate-50 rounded-full group-hover:scale-110 transition-transform">
                    {activityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{activity.description}</p>
                    <p className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">{activity.time}</p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;