import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardList, Package, Settings, Pill, X } from 'lucide-react';
import '../../index.css';

export default function AdminSidebar({ isOpen, onClose }) {
  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-6 py-3 mx-4 my-1 rounded-2xl transition-all duration-200 ${
      isActive
        ? 'bg-[#55B9EB] text-white shadow-md font-medium'
        : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 font-medium'
    }`;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 
        flex flex-col h-full shadow-lg md:shadow-none
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header / Logo */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6">
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-[#55B9EB] text-white p-2 rounded-full shadow-sm">
              <Pill size={20} className="-rotate-45" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-[#1F2937] dark:text-white text-lg leading-tight tracking-tight">Thnam Admin</h3>
              <span className="text-xs text-gray-400 font-medium">Pharmacy Management</span>
            </div>
          </div>
          
          {/* Close button for mobile */}
          <button 
            onClick={onClose}
            className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col gap-1 mt-4">
          <NavLink to="/admin" end className={navItemClass} onClick={onClose}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/patients" className={navItemClass} onClick={onClose}>
            <Users size={20} />
            <span>Patients</span>
          </NavLink>
          <NavLink to="/admin/prescriptions" className={navItemClass} onClick={onClose}>
            <ClipboardList size={20} />
            <span>Prescriptions</span>
          </NavLink>
          <NavLink to="/admin/inventory" className={navItemClass} onClick={onClose}>
            <Package size={20} />
            <span>Inventory</span>
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="mb-6 flex flex-col gap-2">
          <NavLink to="/admin/settings" className={navItemClass} onClick={onClose}>
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
          
          {/* User Profile */}
          <NavLink to="/admin/profile" onClick={onClose} className="mx-6 mt-4 flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl p-2 -ml-2">
            <div className="w-10 h-10 rounded-full bg-[#1A4F6A] text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
              Dr
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-sm text-gray-800 dark:text-gray-200 truncate">Dr. Sophea Sary</span>
              <span className="text-xs text-gray-400 truncate tracking-tight">Senior Pharmacist</span>
            </div>
          </NavLink>
        </div>
      </aside>
    </>
  );
}
