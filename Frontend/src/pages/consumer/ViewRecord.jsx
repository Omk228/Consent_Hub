import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, ArrowLeft, User, FileText, Calendar, Lock } from 'lucide-react';
import { Button } from '../../components/common/Button';

const ViewRecord = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data: Real app mein ye API se aayega based on ID
  const record = {
    id: id,
    ownerName: "Vijay Deenanath Chauhan",
    status: "APPROVED", // Simulation: Agar ye PENDING ya REVOKED hai toh data hide ho jayega
    data: {
      fullName: "Vijay Deenanath Chauhan",
      age: 36,
      location: "Mandwa",
      occupation: "Business",
      healthStatus: "Active",
      lastCheckup: "2025-12-15"
    }
  };

  if (record.status !== 'APPROVED') {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-12 bg-white rounded-3xl border-2 border-dashed border-rose-200 text-center shadow-xl shadow-rose-50">
        <ShieldAlert className="h-16 w-16 text-rose-500 mx-auto mb-6" />
        <h3 className="text-2xl font-black text-slate-900 mb-2">Access Restricted</h3>
        <p className="text-slate-500 mb-8 font-medium">
          You do not have an active consent agreement to view this sensitive record. 
          The data owner has either not approved or revoked your access.
        </p>
        <Button onClick={() => navigate('/consumer/requests')} className="bg-slate-900 text-white px-8 rounded-2xl">
          Back to Requests
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* Security Header */}
      <div className="bg-[#0f172a] p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-[-20px] top-[-20px] opacity-10">
          <Lock size={150} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
              <ShieldCheck className="h-8 w-8 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Secure Record Viewer</h2>
              <p className="text-slate-400 text-sm">Verified access granted by {record.ownerName}</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-black uppercase tracking-widest text-emerald-400">
            Consent Validated
          </div>
        </div>
      </div>

      {/* Record Data Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <FileText size={18} className="text-indigo-500" /> Personal Profile
          </h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">UID: {record.id}</span>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { label: 'Full Name', value: record.data.fullName, icon: User },
            { label: 'Age', value: record.data.age, icon: Calendar },
            { label: 'Location', value: record.data.location, icon: FileText },
            { label: 'Occupation', value: record.data.occupation, icon: FileText },
            { label: 'Health Status', value: record.data.healthStatus, icon: ShieldCheck },
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <item.icon size={12} /> {item.label}
              </p>
              <p className="text-lg font-bold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Audit Footnote */}
        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100">
          <p className="text-[11px] text-slate-500 font-medium italic">
            Note: This access event has been cryptographically logged in the Audit Trail for {record.ownerName}. 
            Current viewing timestamp: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewRecord;