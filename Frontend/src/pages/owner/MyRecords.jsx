import React, { useState } from 'react';
import { FileText, Plus, Search, Eye, Edit, Trash2, ChevronDown } from 'lucide-react';
import { Button } from '../../components/common/Button';

const MyRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All Categories');

  const recordsData = [
    {
      id: 'REC-001',
      name: 'Personal Health Records',
      category: 'Healthcare',
      created: 'Dec 10, 2023',
      lastAccessed: 'Jan 15, 2024',
      activeConsents: 3,
    },
    {
      id: 'REC-002',
      name: 'Financial History',
      category: 'Finance',
      created: 'Nov 5, 2023',
      lastAccessed: 'Jan 12, 2024',
      activeConsents: 2,
    },
    {
      id: 'REC-003',
      name: 'Employment Records',
      category: 'Employment',
      created: 'Oct 20, 2023',
      lastAccessed: 'Dec 28, 2023',
      activeConsents: 1,
    },
    {
      id: 'REC-004',
      name: 'Education Credentials',
      category: 'Education',
      created: 'Sep 15, 2023',
      lastAccessed: 'Jan 5, 2024',
      activeConsents: 0,
    },
    {
      id: 'REC-005',
      name: 'Insurance Documents',
      category: 'Insurance',
      created: 'Aug 1, 2023',
      lastAccessed: 'Jan 10, 2024',
      activeConsents: 2,
    },
  ];

  const filteredRecords = recordsData.filter(record =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCategory === 'All Categories' || record.category === filterCategory)
  );

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Records</h1>
          <p className="text-gray-600">Manage your personal data records</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-2 px-4 py-2 rounded-lg shadow-md">
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
            {filteredRecords.map((record) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyRecords;