import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-8">Medical Tracker</h1>
      <div className="flex gap-4">
        <Link to="/admin" className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">Admin Dashboard</Link>
        
      </div>
    </div>
  );
}
