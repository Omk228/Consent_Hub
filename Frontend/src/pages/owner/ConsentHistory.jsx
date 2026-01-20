import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { CheckCircle, XCircle, History, Search, ChevronDown, Repeat2, Ban, Building } from 'lucide-react';
import clsx from 'clsx';

const ConsentHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');

  // Requirement: State management for real-time Revoke/Extend
  const [consentData, setConsentData] = useState([
    { id: 'CONSENT-001', organization: 'MedResearch Lab', status: 'Active', dataTypes: 'Health Records', grantedDate: 'Jan 10, 2024', expiresDate: 'Jan 10, 2025', accesses: 5 },
    { id: 'CONSENT-002', organization: 'TrustedOrg Inc.', status: 'Active', dataTypes: 'Demographics, Contact Info', grantedDate: 'Dec 5, 2023', expiresDate: 'Dec 5, 2024', accesses: 12 },
    { id: 'CONSENT-003', organization: 'Healthcare Partners', status: 'Active', dataTypes: 'Health Records, Insurance', grantedDate: 'Nov 20, 2023', expiresDate: 'Nov 20, 2024', accesses: 8 },
    { id: 'CONSENT-004', organization: 'Data Insights Corp', status: 'Revoked', dataTypes: 'Marketing Preferences', grantedDate: 'Oct 1, 2023', expiresDate: 'Oct 1, 2024', accesses: 3 },
    { id: 'CONSENT-005', organization: 'FinSecure Bank', status: 'Expired', dataTypes: 'Financial Data', grantedDate: 'Aug 15, 2023', expiresDate: 'Jan 15, 2024', accesses: 7 },
  ]);

  const handleExtend = (id) => {
    // Logic: Current expiry year ko +1 karna
    setConsentData(prev => prev.map(c => 
      c.id === id ? { ...c, expiresDate: c.expiresDate.replace('2024', '2025').replace('2025', '2026') } : c
    ));
    alert(`Consent for ${id} extended successfully.`);
  };

  const handleRevoke = (id) => {
    // Logic: Status change to Revoked and log audit
    setConsentData(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'Revoked' } : c
    ));
    alert(`Consent for ${id} has been revoked.`);
  };

  const filteredConsents = consentData.filter(consent =>
    consent.organization.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'All Status' || consent.status === filterStatus)
  );

  const activeConsentsCount = consentData.filter(c => c.status === 'Active').length;
  const revokedConsentsCount = consentData.filter(c => c.status === 'Revoked').length;
  const expiredConsentsCount = consentData.filter(c => c.status === 'Expired').length;

  const getStatusBadge = (status) => {
    const styles = {
      Active: "bg-green-100 text-green-800",
      Revoked: "bg-red-100 text-red-800",
      Expired: "bg-gray-100 text-gray-800"
    };
    return <span className={clsx("px-2 inline-flex text-xs leading-5 font-bold rounded-full uppercase tracking-tighter", styles[status])}>{status}</span>;
  };

  return (
    <div className="p-2">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Consent History</h1>
        <p className="text-slate-500 font-medium">Manage and audit your historical data consent grants</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
            { label: 'Active Consents', count: activeConsentsCount, icon: CheckCircle, color: 'text-green-500' },
            { label: 'Revoked', count: revokedConsentsCount, icon: XCircle, color: 'text-red-500' },
            { label: 'Expired', count: expiredConsentsCount, icon: History, color: 'text-slate-400' }
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
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-100">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search organizations..."
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm font-medium"
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
            <option>Active</option>
            <option>Revoked</option>
            <option>Expired</option>
        </select>
      </div>

      {/* History Cards */}
      <div className="space-y-4">
        {filteredConsents.map((consent) => (
          <div key={consent.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-500 font-bold">
                  <Building size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                  {consent.organization}
                  {getStatusBadge(consent.status)}
                </h3>
                <p className="text-xs font-semibold text-indigo-500 uppercase tracking-tight">{consent.dataTypes}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-8 text-xs font-bold text-slate-400 uppercase tracking-tighter border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-8">
              <div className="text-center">
                <p className="text-slate-300 mb-1">Granted</p>
                <p className="text-slate-900">{consent.grantedDate}</p>
              </div>
              <div className="text-center">
                <p className="text-slate-300 mb-1">Expires</p>
                <p className="text-slate-900">{consent.expiresDate}</p>
              </div>
              <div className="text-center">
                <p className="text-slate-300 mb-1">Accesses</p>
                <p className="text-indigo-600 font-black text-sm">{consent.accesses}</p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExtend(consent.id)}
                  disabled={consent.status !== 'Active'}
                  className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 font-bold px-4"
                >
                  <Repeat2 className="w-4 h-4 mr-1" /> Extend
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRevoke(consent.id)}
                  disabled={consent.status !== 'Active'}
                  className="rounded-xl border-rose-100 text-rose-600 hover:bg-rose-50 font-bold px-4"
                >
                  <Ban className="w-4 h-4 mr-1" /> Revoke
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsentHistory;