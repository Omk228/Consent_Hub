import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../api/AuthContext';
import { Button } from '../../components/common/Button';
import { Download, Shield, Search, Globe, Clock, Loader2 } from 'lucide-react';

const AuditLogs = () => {
  const { user: authUser, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('All Actions');
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [errorLogs, setErrorLogs] = useState('');

  const fetchAuditLogs = async () => {
    try {
      setLoadingLogs(true);
      setErrorLogs('');
      // Backend route hit kar rahe hain
      const response = await api.get('/owner/audit-logs');
      // Ensure logs is an array
      setLogs(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setErrorLogs('Failed to fetch audit logs from server.');
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (!authLoading && authUser) {
      fetchAuditLogs();
    }
  }, [authLoading, authUser]);

  // Filtering logic to handle actionType matching
  const filteredLogs = logs.filter(log => {
    const description = log.description?.toLowerCase() || '';
    const actionType = log.actionType?.toLowerCase() || '';
    const term = searchTerm.toLowerCase();

    const matchesSearch = description.includes(term) || actionType.includes(term);
    const matchesFilter = filterAction === 'All Actions' || log.actionType === filterAction;

    return matchesSearch && matchesFilter;
  });

  const getActionBadge = (actionType) => {
    // Backend se aane wali strings: CONSENT_APPROVED, CONSENT_REJECTED
    const badges = {
      'CONSENT_APPROVED': 'bg-emerald-50 text-emerald-700 border-emerald-100',
      'CONSENT_REJECTED': 'bg-rose-50 text-rose-700 border-rose-100',
      'CONSENT_REVOKED': 'bg-amber-50 text-amber-700 border-amber-100',
    };
    
    const label = actionType?.replace('CONSENT_', '') || 'ACTION';
    
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${badges[actionType] || 'bg-gray-100 text-gray-600'}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="p-4 min-h-screen bg-slate-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Audit Logs</h1>
          <p className="text-slate-500 font-medium mt-1">Immutable record of all data access activities</p>
        </div>
        <Button className="bg-white border border-slate-200 text-slate-700 flex items-center gap-2 px-6 py-2.5 rounded-xl shadow-sm font-bold transition-all hover:bg-slate-50">
          <Download className="w-4 h-4" /> Export Logs
        </Button>
      </div>

      <div className="bg-indigo-600 p-6 rounded-3xl shadow-xl flex items-center gap-6 mb-10 text-white relative overflow-hidden">
        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
          <Shield className="w-8 h-8" />
        </div>
        <div className="relative z-10">
          <p className="text-lg font-bold">Tamper-Proof Audit Trail</p>
          <p className="text-sm text-indigo-100 max-w-2xl leading-relaxed">
            These logs are cryptographically secured and verified for compliance.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search action or details..."
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm focus:ring-2 focus:ring-indigo-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="bg-slate-50 border border-slate-100 text-slate-700 py-2.5 px-4 rounded-xl text-sm font-bold outline-none cursor-pointer"
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
        >
          <option value="All Actions">All Actions</option>
          <option value="CONSENT_APPROVED">Approved</option>
          <option value="CONSENT_REJECTED">Rejected</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Event Time</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Action</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Description</th>
                <th className="px-8 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Initiator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loadingLogs ? (
                <tr><td className="text-center py-20" colSpan="4"><Loader2 className="mx-auto h-10 w-10 text-indigo-500 animate-spin" /></td></tr>
              ) : errorLogs ? (
                <tr><td className="text-center py-10 text-red-500 font-bold" colSpan="4">{errorLogs}</td></tr>
              ) : filteredLogs.length === 0 ? (
                <tr><td className="text-center py-20 text-slate-400 font-bold uppercase text-xs" colSpan="4">No logs found.</td></tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-6 flex items-start gap-4">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-400 group-hover:text-indigo-500 transition-colors">
                        <Clock size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-medium uppercase tracking-tighter">
                          <Globe size={12} /> IP: {log.ipAddress || '127.0.0.1'}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">{getActionBadge(log.actionType)}</td>
                    <td className="px-8 py-6 text-xs text-slate-600 leading-relaxed max-w-xs">
                        {log.description}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-sm font-bold text-slate-900">{log.user || 'Verified Owner'}</p>
                      <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mt-0.5 italic">Authorized</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;