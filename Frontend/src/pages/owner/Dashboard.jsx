import React, { useState, useEffect } from 'react';
import api from '../../api/axios'; 
import { useAuth } from '../../api/AuthContext'; 
import { Button } from '../../components/common/Button';
import { FileText, CheckCircle, XCircle, Hourglass, ShieldCheck, Clock, Loader2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // navigate fix karne ke liye

const OwnerDashboard = () => {
  const { user: authUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [errorRequests, setErrorRequests] = useState('');
  const [errorActivities, setErrorActivities] = useState('');
  const [allRequests, setAllRequests] = useState([]);
  const [loadingAllRequests, setLoadingAllRequests] = useState(true);
  const [errorAllRequests, setErrorAllRequests] = useState('');
  const [actionLoading, setActionLoading] = useState(null); // Button loader ke liye

  const fetchRequests = async () => {
    try {
      setLoadingRequests(true);
      const response = await api.get('/owner/pending'); 
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
      const response = await api.get('/owner/audit-logs'); 
      setActivityLogs(response.data);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setErrorActivities('Failed to fetch audit logs.');
    } finally {
      setLoadingActivities(false);
    }
  };

  const fetchAllRequestsCount = async () => {
    try {
      setLoadingAllRequests(true);
      const response = await api.get('/owner/all-requests');
      setAllRequests(response.data);
    } catch (err) {
      console.error('Error fetching all requests:', err);
      setErrorAllRequests('Failed to fetch all requests.');
    } finally {
      setLoadingAllRequests(false);
    }
  };

  const handleAction = async (requestId, action) => {
    try {
      setActionLoading(requestId);
      const response = await api.put('/owner/update-status', { 
        requestId,
        status: action 
      });
      
      // UI update bina refresh ke
      setRequests(prev => prev.filter(r => r.id !== requestId));
      fetchAuditLogs(); // Logs refresh karna zaroori hai action ke baad
      
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || 'Failed to update request'}`);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    if (!authLoading && authUser) {
      fetchRequests();
      fetchAuditLogs();
      fetchAllRequestsCount();
    }
  }, [authLoading, authUser]);

  const approvedRequestsCount = allRequests.filter(req => req.status === 'APPROVED').length;
  const rejectedOrRevokedRequestsCount = allRequests.filter(req => req.status === 'REJECTED' || req.status === 'REVOKED').length;

  const activityIcon = (type) => {
    const lowerType = type?.toLowerCase() || '';
    if (lowerType.includes('approved')) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (lowerType.includes('rejected')) return <XCircle className="h-4 w-4 text-red-500" />;
    if (lowerType.includes('revoked')) return <ShieldCheck className="h-4 w-4 text-gray-500" />;
    return <Clock className="h-4 w-4 text-indigo-400" />;
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back, {authUser?.name}</h2>
        <p className="text-slate-500 font-medium">Manage your data consents and track access history.</p>
      </div>

      {/* NEW: Summary Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-yellow-50 rounded-2xl">
            <Clock className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{requests.length}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Requests</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-green-50 rounded-2xl">
            <ShieldCheck className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{approvedRequestsCount}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Approved Requests</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-indigo-50 rounded-2xl">
            <Users className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{rejectedOrRevokedRequestsCount}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rejected/Revoked</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Access Requests Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Hourglass className="h-5 w-5 text-indigo-500" /> Incoming Requests
            </h3>
            <Button 
              onClick={() => navigate('/owner/requests')}
              variant="ghost"
              size="sm"
              className="text-indigo-600 hover:bg-indigo-50"
            >
              View All
            </Button>
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
                        <p className="text-xs text-slate-500">
                          {Array.isArray(request.dataTypes) ? request.dataTypes.join(', ') : 'No data specified'}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{request.purpose}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button 
                          onClick={() => handleAction(request.id, 'APPROVED')}
                          disabled={actionLoading === request.id}
                          variant="outline" 
                          size="sm" 
                          className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                        >
                          {actionLoading === request.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve"}
                        </Button>
                        <Button 
                          onClick={() => handleAction(request.id, 'REJECTED')}
                          disabled={actionLoading === request.id}
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
            <Clock className="h-5 w-5 text-indigo-500" /> Activity Log
          </h3>
          <ul className="space-y-6">
            {loadingActivities ? (
              <li className="text-center py-4"><Loader2 className="animate-spin mx-auto text-indigo-500" /></li>
            ) : errorActivities ? (
              <li className="text-center py-4 text-red-500">{errorActivities}</li>
            ) : activityLogs.length === 0 ? (
              <li className="text-center py-4 text-slate-400">No recent activity.</li>
            ) : (
              activityLogs.slice(0, 6).map((activity) => ( // Top 6 logs dikhayenge dashboard pe
                <li key={activity.id} className="flex items-start space-x-3 group">
                  <div className="mt-1 p-1 bg-slate-50 rounded-full group-hover:scale-110 transition-transform">
                    {activityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{activity.description}</p>
                    <p className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                      {new Date(activity.time).toLocaleString()}
                    </p>
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