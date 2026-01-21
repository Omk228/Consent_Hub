import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../api/AuthContext';
import { Button } from '../../components/common/Button';
import { CheckCircle, XCircle, History, Search, Building, Loader2, Ban, Clock } from 'lucide-react';
import clsx from 'clsx';

const ConsentHistory = () => {
  const { user: authUser, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [consents, setConsents] = useState([]);
  const [loadingConsents, setLoadingConsents] = useState(true);
  const [errorConsents, setErrorConsents] = useState('');

  const fetchConsentHistory = async () => {
    try {
      setLoadingConsents(true);
      // Consumer ke liye unki saari requests fetch karna
      const response = await api.get('/consumer/my-requests'); 
      setConsents(response.data);
    } catch (err) {
      console.error('Error fetching history:', err);
      setErrorConsents('Failed to fetch consent history.');
    } finally {
      setLoadingConsents(false);
    }
  };

  useEffect(() => {
    if (!authLoading && authUser) {
      fetchConsentHistory();
    }
  }, [authLoading, authUser]);

  const handleRevoke = async (id) => {
    if (!window.confirm("Are you sure you want to revoke this access?")) return;
    try {
      await api.put('/consents/update-status', { 
        consentId: id, 
        status: 'REVOKED',
        ownerId: authUser.id 
      });
      alert("Access Revoked Successfully! 🚫");
      fetchConsentHistory(); 
    } catch (error) {
      alert("Failed to revoke consent.");
    }
  };

  // FIXED: Filtering logic uses backend keys (ownerName/status)
  const filteredConsents = consents.filter(consent => {
    const orgName = consent.ownerName || consent.owner_name || "";
    const matchesSearch = orgName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All Status' || 
      (consent.status && consent.status.toUpperCase() === filterStatus.toUpperCase());
    return matchesSearch && matchesStatus;
  });

  // Summary counts based on Backend Status
  const activeCount = consents.filter(c => c.status === 'APPROVED').length;
  const revokedCount = consents.filter(c => c.status === 'REVOKED' || c.status === 'REJECTED').length;
  const pendingCount = consents.filter(c => c.status === 'PENDING').length;

  const getStatusBadge = (status) => {
    const s = status?.toUpperCase();
    const styles = {
      APPROVED: "bg-green-100 text-green-800",
      REVOKED: "bg-red-100 text-red-800",
      REJECTED: "bg-red-100 text-red-800",
      PENDING: "bg-yellow-100 text-yellow-800",
    };
    return (
      <span className={clsx("px-2 inline-flex text-[10px] font-bold rounded-full uppercase tracking-tighter", styles[s] || "bg-gray-100 text-gray-800")}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-4 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Consent Management</h1>
        <p className="text-slate-500 font-medium">Track and control your data access permissions.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
            { label: 'Approved', count: activeCount, icon: CheckCircle, color: 'text-green-500' },
            { label: 'Pending', count: pendingCount, icon: Clock, color: 'text-yellow-500' },
            { label: 'Revoked/Rejected', count: revokedCount, icon: XCircle, color: 'text-red-500' }
        ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex items-center gap-4">
                <item.icon className={clsx("w-8 h-8", item.color)} />
                <div>
                    <p className="text-2xl font-black text-slate-900">{item.count}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                </div>
            </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by organization..."
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
            className="bg-slate-50 border-none text-slate-700 py-2.5 px-4 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer w-full md:w-auto"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
        >
            <option>All Status</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="REVOKED">Revoked</option>
        </select>
      </div>

      {/* Consent List */}
      <div className="space-y-4">
        {loadingConsents ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100"><Loader2 className="mx-auto h-10 w-10 text-indigo-500 animate-spin" /></div>
        ) : filteredConsents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
            <History className="mx-auto h-12 w-12 text-slate-200 mb-2" />
            <p className="text-slate-400 font-bold uppercase text-xs">No records found</p>
          </div>
        ) : (
          filteredConsents.map((consent) => (
            <div key={consent.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-500"><Building size={24} /></div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                    {consent.ownerName || consent.owner_name}
                    {getStatusBadge(consent.status)}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-tight">Purpose: {consent.purpose}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-8 text-xs font-bold text-slate-400 uppercase border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-8">
                <div className="text-center">
                  <p className="text-slate-300 mb-1">Requested On</p>
                  <p className="text-slate-900">{new Date(consent.created_at).toLocaleDateString()}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevoke(consent.id)}
                    disabled={consent.status !== 'APPROVED'}
                    className="rounded-xl border-rose-100 text-rose-600 hover:bg-rose-50 font-bold px-4"
                  >
                    <Ban className="w-4 h-4 mr-1" /> Revoke
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConsentHistory;