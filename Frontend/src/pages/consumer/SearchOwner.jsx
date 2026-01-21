import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Search, Send, User, ShieldCheck, Globe, Loader2, Database } from 'lucide-react';
import api from '../../api/axios';

const SearchOwner = () => {
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [foundOwner, setFoundOwner] = useState(null);
  const [ownerRecords, setOwnerRecords] = useState([]); // New: Owner ke records ke liye
  const [selectedRecord, setSelectedRecord] = useState(null); // New: Selected record tracking
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false); // New: Request sending state

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setError('');
    setFoundOwner(null);
    setOwnerRecords([]);
    setSelectedRecord(null);

    try {
      // 1. Owner search karo
      const response = await api.get('/consumer/search', { params: { email } });
      setFoundOwner(response.data);

      // 2. Search success hone par usi Owner ke Records le aao
      const recordsRes = await api.get(`/consumer/owner-records/${response.data.id}`);
      setOwnerRecords(recordsRes.data);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.message || 'No owner found with this email.');
    } finally {
      setIsSearching(false);
    }
  };

  const sendRequest = async () => {
    if (!selectedRecord) {
      alert("Please select a record first!");
      return;
    }

    setIsSending(true);
    try {
      const response = await api.post('/consumer/request-access', {
        ownerId: foundOwner.id,
        recordId: selectedRecord
      });
      alert(`Success: ${response.data.message}`);
      // Success ke baad reset ya feedback logic
      setFoundOwner(null);
      setEmail('');
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send request.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-2 space-y-6 animate-in fade-in duration-500">
      {/* Search Header (Sahi hai, chheda nahi) */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Search className="text-indigo-600" /> Find Data Owner
          </h2>
          <p className="text-slate-500 font-medium">Search for users by their verified work email.</p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <input
            type="email"
            placeholder="owner@test.com..."
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" disabled={isSearching} className="bg-indigo-600 text-white px-8 rounded-xl font-bold min-w-[140px]">
            {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : "Search"}
          </Button>
        </form>
      </div>

      {/* Result Section (Updated to include Records) */}
      {foundOwner && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
          {/* Owner Profile Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <User size={28} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">{foundOwner.name}</h3>
                <p className="text-slate-500 text-sm font-medium">{foundOwner.email}</p>
              </div>
            </div>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase">Verified Owner</span>
          </div>

          {/* Records Selection Section (New) */}
          <div className="bg-white p-8 rounded-3xl border-2 border-indigo-50 shadow-md">
            <div className="mb-6">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Database size={16} /> Select Record to Access
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {ownerRecords.length > 0 ? (
                ownerRecords.map((record) => (
                  <div
                    key={record.id}
                    onClick={() => setSelectedRecord(record.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedRecord === record.id
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-inner'
                        : 'border-slate-100 hover:border-indigo-200 bg-slate-50/30'
                    }`}
                  >
                    <p className="font-bold text-slate-900">{record.record_name}</p>
                    <p className="text-xs text-slate-500 font-medium">{record.category}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-sm italic">No records available for this owner.</p>
              )}
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-100 pt-6">
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <ShieldCheck size={14} className="text-indigo-400" /> Secure Protocol Active
              </div>
              <Button
                onClick={sendRequest}
                disabled={!selectedRecord || isSending}
                className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-200 transition-all"
              >
                {isSending ? <Loader2 className="animate-spin" /> : <><Send className="h-4 w-4 mr-2" /> Request Access</>}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State / Error Handling */}
      {!foundOwner && !isSearching && (
        <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className={`${error ? 'text-red-500' : 'text-slate-400'} font-bold uppercase tracking-widest text-sm`}>
            {error || 'Enter an email to find an authorized data owner'}
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchOwner;