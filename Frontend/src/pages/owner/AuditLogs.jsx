import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Download, Shield, Search, Filter, ChevronDown, CalendarDays, Clock, Globe } from 'lucide-react';

const AuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('All Actions');

  // Requirement: Immutable Audit Trail Mock Data
  const allLogs = [
    { id: 1, timestamp: '2024-01-15 14:32:15', actionType: 'Data Accessed', entity: 'MedResearch Lab', dataType: 'Health Records', description: 'Data accessed for research study #RS-2024-001', user: 'System', ipAddress: '192.168.1.100' },
    { id: 2, timestamp: '2024-01-15 10:15:42', actionType: 'Access Granted', entity: 'TrustedOrg Inc.', dataType: 'Demographics', description: 'Access consent granted for 12 months', user: 'John Smith (You)', ipAddress: '10.0.0.50' },
    { id: 3, timestamp: '2024-01-14 16:45:00', actionType: 'Access Revoked', entity: 'OldPartner Corp', dataType: 'Financial Data', description: 'Access consent revoked by data owner', user: 'John Smith (You)', ipAddress: '10.0.0.50' },
    { id: 4, timestamp: '2024-01-14 09:00:00', actionType: 'Data Accessed', entity: 'Government Agency', dataType: 'Public Records', description: 'Annual compliance check', user: 'System', ipAddress: '203.0.113.45' },
    { id: 5, timestamp: '2024-01-13 18:00:00', actionType: 'Consent Created', entity: 'NewPartner LLC', dataType: 'Contact Info', description: 'New consent granted for marketing', user: 'John Smith (You)', ipAddress: '10.0.0.50' },
    { id: 6, timestamp: '2024-01-13 11:30:00', actionType: 'Data Accessed', entity: 'Internal Audit Team', dataType: 'All Data', description: 'Internal security review', user: 'System', ipAddress: '172.16.0.1' },
    { id: 7, timestamp: '2024-01-12 14:00:00', actionType: 'Access Denied', entity: 'Suspicious IP', dataType: 'N/A', description: 'Attempted unauthorized access', user: 'System', ipAddress: '198.51.100.20' },
  ];

  const filteredLogs = allLogs.filter(log =>
    (log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterAction === 'All Actions' || log.actionType === filterAction)
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
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-6 flex items-start gap-4">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                        <Clock size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">{log.timestamp}</p>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;