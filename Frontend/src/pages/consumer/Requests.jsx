import React, { useState, useEffect } from 'react'; // Import useEffect
import { useNavigate } from 'react-router-dom';
import { Clock, Eye, ShieldCheck, Search, Loader2 } from 'lucide-react'; // Import Loader2
import api from '../../api/axios'; // Import api instance
import { useAuth } from '../../api/AuthContext'; // Import useAuth

const ConsumerRequests = () => {
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading } = useAuth(); // Get user and loading state from AuthContext

  const [myRequests, setMyRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/consumer/my-requests');
        setMyRequests(response.data);
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError(err.response?.data?.message || 'Failed to fetch requests.');
      } finally {
        setIsLoading(false);
      }
    };
    if (!authLoading && authUser) { // Only fetch if not loading and user is authenticated
      fetchRequests();
    } else if (!authLoading && !authUser) { // If not loading and no user, stop loading requests
        setIsLoading(false);
    }
  }, [authLoading, authUser]); // Add authLoading and authUser to dependency array

  return (
    <div className="p-2 space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Requests</h1>
        <p className="text-slate-500 font-medium">Track your data access requests and view approved records.</p>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-8">
            <Loader2 className="h-8 w-8 text-indigo-500 mx-auto animate-spin" />
            <p className="text-slate-500 mt-2">Loading requests...</p>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-8 text-red-500">
            <p>{error}</p>
          </div>
        ) : myRequests.length === 0 ? (
          <div className="col-span-full text-center py-8 text-slate-500">
            <p>No access requests found.</p>
          </div>
        ) : (
          myRequests.map((req) => (
            <div key={req.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${req.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  <Clock size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{req.ownerName}</p>
                  <p className="text-xs text-indigo-600 font-bold uppercase">{req.recordType}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                  req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                  req.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700' // For other statuses like 'REVOKED'
                }`}>
                  {req.status}
                </span>
                <button
                  disabled={req.status !== 'APPROVED'}
                  onClick={() => navigate(`/consumer/view-record/${req.recordId}`)} // Use recordId and correct path
                  className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold disabled:opacity-20 transition-all hover:bg-slate-800"
                >
                  <Eye size={14} /> View Data
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConsumerRequests;