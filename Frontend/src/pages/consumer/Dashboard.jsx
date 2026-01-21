import React, { useState, useEffect } from 'react';
import { Button } from '../../components/common/Button';
import { Search, Send, Clock, ShieldCheck, Eye, Loader2 } from 'lucide-react';
import api from '../../api/axios'; 
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../api/AuthContext'; 

const ConsumerDashboard = () => {
  const { user: authUser, loading: authLoading } = useAuth(); 
  const [searchQuery, setSearchQuery] = useState('');
  const [availableOwners, setAvailableOwners] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loadingOwners, setLoadingOwners] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [errorOwners, setErrorOwners] = useState('');
  const [errorRequests, setErrorRequests] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [ownerRecords, setOwnerRecords] = useState([]);
  const [loadingOwnerRecords, setLoadingOwnerRecords] = useState(false);
  const [errorOwnerRecords, setErrorOwnerRecords] = useState('');
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      setLoadingRequests(true);
      const response = await api.get('/consumer/my-requests');
      setMyRequests(response.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setErrorRequests('Failed to fetch requests.');
    } finally {
      setLoadingRequests(false);
    }
  };

  const fetchOwnerRecords = async (ownerId) => {
    try {
      setLoadingOwnerRecords(true);
      const response = await api.get(`/consumer/owner-records/${ownerId}`);
      setOwnerRecords(response.data);
    } catch (err) {
      console.error('Error fetching owner records:', err);
      setErrorOwnerRecords('Failed to fetch owner records.');
    } finally {
      setLoadingOwnerRecords(false);
    }
  };

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        setLoadingOwners(true);
        const response = await api.get('/consumer/available-owners');
        setAvailableOwners(response.data);
      } catch (err) {
        setErrorOwners('Failed to fetch owners.');
      } finally {
        setLoadingOwners(false);
      }
    };
    if (!authLoading && authUser) {
      fetchOwners();
      fetchRequests();
    }
  }, [authLoading, authUser]);

  const handleOpenRequestModal = async (owner) => {
    if (!authUser) return alert("Please login first!");
    setSelectedOwner(owner);
    await fetchOwnerRecords(owner.id);
    setShowCategoryModal(true);
  };

  const requestAccess = async (ownerId, recordId) => {
    try {
      const response = await api.post('/consents/request', {
        owner_id: ownerId,
        record_id: recordId,
        purpose: "Access requested for verification"
      });
      alert(response.data.message);
      setShowCategoryModal(false);
      fetchRequests(); // Request list refresh karo
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || 'Failed to send request'}`);
    }
  };

  const handleViewRecord = (recordId) => {
    navigate(`/consumer/view-record/${recordId}`);
  };

  const filteredOwners = availableOwners.filter(o => 
    o.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Discover & Request Data</h2>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search owners..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {loadingOwners ? <Loader2 className="animate-spin mx-auto text-indigo-500" /> : (
            filteredOwners.map(owner => (
              <div key={owner.id} className="p-4 border rounded-xl bg-slate-50 flex items-center justify-between group hover:border-indigo-300 transition-all">
                <div>
                  <p className="font-bold text-sm text-slate-800">{owner.name}</p>
                  <p className="text-[10px] text-indigo-600 font-bold uppercase">{owner.category || 'General'}</p>
                </div>
                <Button size="sm" onClick={() => handleOpenRequestModal(owner)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Send size={14} className="mr-1" /> Request
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900"><Clock className="text-indigo-600" /> Your Access Status</h2>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left">Data Owner</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loadingRequests ? (
              <tr><td colSpan="3" className="py-8"><Loader2 className="animate-spin mx-auto text-indigo-500" /></td></tr>
            ) : myRequests.length === 0 ? (
              <tr><td colSpan="3" className="text-center py-8 text-slate-500">No requests found.</td></tr>
            ) : (
              myRequests.map(req => (
                <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{req.owner_name || req.ownerName || 'Unknown Owner'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      req.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                      req.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
                      req.status === 'REVOKED' ? 'bg-red-100 text-red-700' : 
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" disabled={req.status !== 'APPROVED'} onClick={() => handleViewRecord(req.record_id)}>
                      <Eye size={16} className="mr-1" /> View
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Category Selection Modal */}
      {showCategoryModal && selectedOwner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Request Access for {selectedOwner?.name}</h2>
            <p className="text-slate-600 mb-6">Select a category to request access:</p>

            {loadingOwnerRecords ? (
              <div className="py-10 text-center">
                <Loader2 className="animate-spin mx-auto text-indigo-500 h-8 w-8" />
                <p className="text-slate-400 mt-2">Loading categories...</p>
              </div>
            ) : errorOwnerRecords ? (
              <div className="py-10 text-center text-red-500">
                {errorOwnerRecords}
              </div>
            ) : ownerRecords.length === 0 ? (
              <div className="py-10 text-center text-slate-400">
                No data categories available from this owner.
              </div>
            ) : (
              <div className="space-y-4">
                {ownerRecords.map((recordItem) => (
                  <div key={recordItem.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                      <p className="font-bold text-slate-900">{recordItem.record_name}</p>
                      <p className="text-xs text-indigo-600 uppercase">{recordItem.category}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => requestAccess(selectedOwner.id, recordItem.id)}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      Request <Send size={14} className="ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <Button variant="ghost" onClick={() => setShowCategoryModal(false)} className="mt-6 w-full text-slate-500 hover:text-slate-700">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsumerDashboard;