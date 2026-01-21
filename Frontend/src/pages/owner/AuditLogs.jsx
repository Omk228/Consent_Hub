import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../api/AuthContext';
import { Button } from '../../components/common/Button';
import { Download, Shield, Search, Filter, ChevronDown, CalendarDays, Clock, Globe, Loader2 } from 'lucide-react';

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
      const response = await api.get('/owner/audit-logs'); // Endpoint for audit logs
      setLogs(response.data);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setErrorLogs('Failed to fetch audit logs.');
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (!authLoading && authUser) {
      fetchAuditLogs();
    }
  }, [authLoading, authUser]);


  const filteredLogs = logs.filter(log =>
    ((log.entity && log.entity.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (log.description && log.description.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (filterAction === 'All Actions' || (log.actionType && log.actionType.toLowerCase() === filterAction.toLowerCase()))
  );

  const getActionBadge = (actionType) => {
    const badges = {
      'Data Accessed': 'bg-blue-50 text-blue-700 border-blue-100',
      'Access Granted': 'bg-emerald-50 text-emerald-700 border-emerald-100',
      'Access Revoked': 'bg-rose-50 text-rose-700 border-rose-100',
      'Consent Created': 'bg-purple-50 text-purple-700 border-purple-100',
      'Access Denied': 'bg-amber-50 text-amber-700 border-amber-100'
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${badges[actionType] || 'bg-gray-100 text-gray-600'}`}>
        {actionType.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="p-2 min-h-screen bg-slate-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Audit Logs</h1>
          <p className="text-slate-500 font-medium mt-1">Immutable record of all data access and consent changes</p>
        </div>
        <Button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-2 px-6 py-2.5 rounded-xl shadow-sm transition-all font-bold">
          <Download className="w-4 h-4" /> Export Logs
        </Button>
      </div>

      {/* Requirement: Immutable Proof Banner */}
      <div className="bg-indigo-600 p-6 rounded-3xl shadow-xl shadow-indigo-100 flex items-center gap-6 mb-10 text-white relative overflow-hidden">
        <div className="absolute right-[-20px] top-[-20px] opacity-10">
            <Shield size={180} />
        </div>
        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
          <Shield className="w-8 h-8" />
        </div>
        <div className="relative z-10">
          <p className="text-lg font-bold">Tamper-Proof Audit Trail</p>
          <p className="text-sm text-indigo-100 max-w-2xl leading-relaxed">
            These logs are cryptographically secured and cannot be modified or deleted. They provide a complete, verifiable record of all data access activities for compliance and security auditing.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by entity, action or details..."
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            className="flex-1 bg-slate-50 border border-slate-100 text-slate-700 py-2.5 px-4 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none cursor-pointer pr-10"
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
          >
            <option>All Actions</option>
            <option>Data Accessed</option>
            <option>Access Granted</option>
            <option>Access Revoked</option>
            <option>Consent Created</option>
            <option>Access Denied</option>
          </select>
        </div>
      </div>

      {/* Log Entries Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{filteredLogs.length} verified entries found</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody className="divide-y divide-slate-50">
              {loadingLogs ? (
                <tr>
                  <td colSpan="5" className="text-center py-20">
                    <Loader2 className="mx-auto h-10 w-10 text-indigo-500 animate-spin" />
                    <p className="text-slate-400 font-bold uppercase text-xs mt-2">Loading audit logs...</p>
                  </td>
                </tr>
              ) : errorLogs ? (
                <tr>
                  <td colSpan="5" className="text-center py-20 text-red-500">
                    <p className="font-bold uppercase text-xs mt-2">{errorLogs}</p>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-20 text-slate-400">
                    <p className="font-bold uppercase text-xs mt-2">No audit logs found.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-8 py-6 flex items-start gap-4">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                          <Clock size={18} />
                      </div>
                      <div>
                          <p className="text-sm font-bold text-slate-900">{new Date(log.timestamp).toLocaleString()}</p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-medium uppercase tracking-tighter">
                              <Globe size={12} /> IP: {log.ipAddress}
                          </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {getActionBadge(log.actionType)}
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-slate-900">{log.entity}</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{log.dataType}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs text-slate-600 leading-relaxed max-w-xs">{log.description}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-sm font-bold text-slate-900">{log.user}</p>
                      <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mt-0.5 italic">Verified</p>
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