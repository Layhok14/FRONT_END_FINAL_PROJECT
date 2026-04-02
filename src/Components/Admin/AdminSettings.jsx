import React, { useState, useEffect } from 'react';
import { Moon, Sun, Bell, Globe } from 'lucide-react';

export default function AdminSettings() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);

  // Check initial theme from localStorage or document class
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark') || 
                   localStorage.getItem('theme') === 'dark';
    if (isDark) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto dark:text-gray-100">
      
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Manage your pharmacy preferences and application behavior.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 dark:border-gray-700">
        
        {/* Appearance Settings */}
        <section className="mb-10">
          <h3 className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 text-[#55B9EB] p-2 rounded-xl">
              <Sun size={20} />
            </div>
            Appearance
          </h3>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${isDarkMode ? 'bg-indigo-900/50 text-indigo-400' : 'bg-orange-100 text-orange-500'}`}>
                {isDarkMode ? <Moon size={24} /> : <Sun size={24} />}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 dark:text-white">Dark Mode</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 text-balance">Switch between light and dark themes</span>
              </div>
            </div>
            
            {/* Toggle Switch */}
            <button 
              onClick={toggleDarkMode}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${isDarkMode ? 'bg-[#55B9EB]' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
              <div 
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} 
              />
            </button>
          </div>
        </section>

        <hr className="border-gray-100 dark:border-gray-700 my-8" />

        {/* Notification Settings */}
        <section className="mb-10">
          <h3 className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 text-[#55B9EB] p-2 rounded-xl">
              <Bell size={20} />
            </div>
            Notifications
          </h3>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 dark:text-white">Email Notifications</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Receive daily summary emails about stock alerts</span>
            </div>
            <button 
              onClick={() => setEmailNotifs(!emailNotifs)}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${emailNotifs ? 'bg-[#55B9EB]' : 'bg-gray-300 dark:bg-gray-600'}`}
            >
              <div 
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${emailNotifs ? 'translate-x-6' : 'translate-x-0'}`} 
              />
            </button>
          </div>
        </section>

        <hr className="border-gray-100 dark:border-gray-700 my-8" />
        
        {/* Localization */}
        <section className="mb-8">
          <h3 className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 text-[#55B9EB] p-2 rounded-xl">
              <Globe size={20} />
            </div>
            Localization
          </h3>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">SYSTEM LANGUAGE</label>
              <select className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-[#55B9EB] transition-all font-medium appearance-none">
                <option value="en">English (US)</option>
                <option value="kh">Khmer</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
