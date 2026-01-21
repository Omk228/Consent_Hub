import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../api/AuthContext';
import { FileText, Plus, Search, Eye, Edit, Trash2, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '../../components/common/Button';

const MyRecords = () => {
  const { user: authUser, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [errorRecords, setErrorRecords] = useState('');
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [newRecordName, setNewRecordName] = useState('');
  const [newRecordCategory, setNewRecordCategory] = useState('');
  const [newRecordContent, setNewRecordContent] = useState('');

  const fetchRecords = async () => {
    try {
      setLoadingRecords(true);
      const response = await api.get('/owner/my-records'); // Adjust endpoint as per backend
      setRecords(response.data);
    } catch (err) {
      console.error('Error fetching records:', err);
      setErrorRecords('Failed to fetch records.');
    } finally {
      setLoadingRecords(false);
    }
  };

  const filteredRecords = records.filter(record =>
    (record.name && record.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterCategory === 'All Categories' || (record.category && record.category.toLowerCase() === filterCategory.toLowerCase()))
  );

  useEffect(() => {
    if (!authLoading && authUser) {
      fetchRecords();
    }
  }, [authLoading, authUser]);

  const handleAddRecordClick = () => {
    setShowAddRecordModal(true);
  };

  const submitNewRecord = async () => {
    try {
      const response = await api.post('/owner/records', {
        record_name: newRecordName,
        category: newRecordCategory,
        content: newRecordContent,
        status: 'active', // Default status for a new record
      });
      alert(response.data.message);
      setShowAddRecordModal(false);
      setNewRecordName('');
      setNewRecordCategory('');
      setNewRecordContent('');
      fetchRecords(); // Refresh the records list
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || 'Failed to add record'}`);
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Records</h1>
          <p className="text-gray-600">Manage your personal data records</p>
        </div>
        <Button onClick={handleAddRecordClick} className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-2 px-4 py-2 rounded-lg shadow-md">
          <Plus className="w-5 h-5" />
          <span>Add Record</span>
        </Button>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search records..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <select
            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option>All Categories</option>
            <option>Healthcare</option>
            <option>Finance</option>
            <option>Employment</option>
            <option>Education</option>
            <option>Insurance</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Record Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Accessed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Consents</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(
              loadingRecords ? (
                <tr><td colSpan="7" className="py-10 text-center"><Loader2 className="animate-spin mx-auto text-indigo-500" /></td></tr>
              ) : errorRecords ? (
                <tr><td colSpan="7" className="py-10 text-center text-red-500">{errorRecords}</td></tr>
              ) : filteredRecords.length === 0 ? (
                <tr><td colSpan="7" className="py-10 text-center text-gray-400">No records found.</td></tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-indigo-500" />
                      <span>{record.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {record.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{record.created}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{record.lastAccessed}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{record.activeConsents}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-400 hover:text-gray-600 mx-1"><Eye className="w-5 h-5" /></button>
                      <button className="text-gray-400 hover:text-gray-600 mx-1"><Edit className="w-5 h-5" /></button>
                      <button className="text-red-600 hover:text-red-800 mx-1"><Trash2 className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>
      {showAddRecordModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Record</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="recordName" className="block text-sm font-medium text-gray-700">Record Name</label>
                <input
                  type="text"
                  id="recordName"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={newRecordName}
                  onChange={(e) => setNewRecordName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="recordCategory" className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  id="recordCategory"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={newRecordCategory}
                  onChange={(e) => setNewRecordCategory(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="recordContent" className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  id="recordContent"
                  rows="4"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={newRecordContent}
                  onChange={(e) => setNewRecordContent(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="ghost"
                onClick={() => setShowAddRecordModal(false)}
                className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={submitNewRecord}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
              >
                Add Record
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRecords;