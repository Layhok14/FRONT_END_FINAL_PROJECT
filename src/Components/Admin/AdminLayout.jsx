import React, { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import NewPrescription from './NewPrescription';
import LowStockAlerts from './Inventory/LowStockAlerts';
import AdminSettings from './AdminSettings';
import Patients from './AdminPatients';
import AddPatient from './AddPatient';
import Profile from './Profile';
import { Menu, Bell } from 'lucide-react';

export default function AdminHome() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-colors">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 overflow-y-auto flex flex-col relative w-full">
        {/* Global Top Navigation */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10 sticky top-0 mt-0">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 mr-3 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 focus:outline-none"
            >
              <Menu size={24} />
            </button>
            <h1 className="md:hidden font-bold text-lg text-gray-800 dark:text-white">Thnam Admin</h1>
          </div>

          <div className="flex items-center ml-auto">
            <button className="p-2.5 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors relative focus:outline-none">
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#55B9EB] rounded-full border border-white dark:border-gray-800"></span>
              <Bell size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 relative">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/prescriptions" element={<NewPrescription />} />
            <Route path="inventory" element={<LowStockAlerts />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="patients" element={<Patients />} />
            <Route path="patients/add" element={<AddPatient />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
