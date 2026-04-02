import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import AlertCard from './AlertCard';

const mockAlerts = [
  {
    id: 1,
    type: 'critical',
    patientNameKhmer: 'លោក ចាន់',
    patientNameEnglish: 'Mr. Chan',
    medication: 'Metformin 500mg (Diabetes)',
    currentTabs: 4,
    requiredTabs: 40,
    daysRemaining: 2,
    estimatedOutDate: 'JULY 15',
    stockPercentage: 10,
    actionType: 'contact'
  },
  {
    id: 2,
    type: 'warning',
    patientNameKhmer: 'អ្នកស្រី ស្រី',
    patientNameEnglish: 'Mrs. Srey',
    medication: 'Amlodipine 5mg (Hypertension)',
    currentTabs: 7,
    requiredTabs: 28,
    daysRemaining: 7,
    estimatedOutDate: 'JULY 20',
    stockPercentage: 25,
    actionType: 'schedule'
  },
  {
    id: 3,
    type: 'warning',
    patientNameKhmer: 'លោក ផល្លា',
    patientNameEnglish: 'Mr. Phalla',
    medication: 'Atorvastatin 20mg (Cholesterol)',
    currentTabs: 9,
    requiredTabs: 30,
    daysRemaining: 9,
    estimatedOutDate: 'JULY 22',
    stockPercentage: 30,
    actionType: 'schedule'
  }
];

export default function LowStockAlerts() {
  const [activeTab, setActiveTab] = useState('all');



  const filteredAlerts = mockAlerts.filter(alert => {
    if( activeTab === 'all') return true;
    return alert.type === activeTab // if false, So the alert will be filtered OUT
  })

  // Count how many are there from each categories(critical, warning)
  const criticalCount = mockAlerts.filter(a => a.type === 'critical').length;
  const warningCount = mockAlerts.filter(a => a.type === 'warning').length;

  return (
    <div className="p-10 max-w-6xl mx-auto">

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-[44px] tracking-tight font-black text-[#1A1E29] dark:text-white mb-1">Low Stock Alerts</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
            {/* need responsive */}
            3 urgent medication refills required for elderly patients
          </p>

        </div>
        <button className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 px-6 py-2.5 rounded-full font-bold shadow-sm hover:shadow transition-all text-sm mb-2">
          <Upload size={20} />
          Export Report
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-200 mb-8">
        <button 
          onClick={() => setActiveTab('all')}
          className={`pb-4 font-bold text-sm border-b-2 transition-all duration-300 ${activeTab === 'all' ? 'text-[#55B9EB] border-[#55B9EB]' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
        >
          All Alerts ({mockAlerts.length})
        </button>
        <button 
          onClick={() => setActiveTab('critical')}
          className={`pb-4 font-bold text-sm border-b-2 transition-all duration-300 ${activeTab === 'critical' ? 'text-red-500 border-red-500' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
        >
          Critical ({criticalCount})
        </button>
        <button 
          onClick={() => setActiveTab('warning')}
          className={`pb-4 font-bold text-sm border-b-2 transition-all duration-300 ${activeTab === 'warning' ? 'text-yellow-500 border-yellow-500' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
        >
          Warning ({warningCount})
        </button>
      </div>

      {/* This is where Cards List will loop through */}
      <div className="flex flex-col gap-2">
        {filteredAlerts.map(alert => (
          <div key={alert.id} className=''>
            <AlertCard key={alert.id} alert={alert} />

          </div>
        ))}
      </div>
    </div>
  );
}
