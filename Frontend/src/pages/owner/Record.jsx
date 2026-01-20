import React from 'react';

const Record = () => {
  // Requirement: View own data record (simple JSON/text) 
  const myData = {
    id: "USER-001",
    profile: "Vijay Deenanath Chauhan",
    data: "This is my private encrypted data record.",
    lastUpdated: "2026-01-20"
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
      <h2 className="text-xl font-bold mb-4">My Data Record </h2>
      <pre className="bg-slate-50 p-4 rounded border font-mono text-sm">
        {JSON.stringify(myData, null, 2)}
      </pre>
    </div>
  );
};

export default Record;