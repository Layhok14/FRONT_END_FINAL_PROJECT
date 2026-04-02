import React from 'react';
import { useNavigate } from 'react-router-dom';

const PillIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.81 12.81 0 0 0 .62 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.62A2 2 0 0 1 22 16.92z"/></svg>
);

const ChevronIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

const DoctorProfile = () => {
  const navigate = useNavigate();
  const doctor = {
    name: "Dr. Sophea Sary",
    id: "TN-00142",
    workplace: "Preah Vihear Pharmacy",
    avatar: "https://via.placeholder.com/150", 
  };

  return (
    <div className="font-sans text-[#1a1c1e] dark:text-gray-100 min-h-full">

      <div className="max-w-md mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
            <div className="flex w-24 h-24 rounded-full border-2 text-3xl font-bold items-center justify-center bg-green-600  text-white border-slate-100 shadow-sm">
                DS
            </div>
            <h1 className="text-[26px] font-extrabold mt-4 tracking-tight dark:text-white">{doctor.name}</h1>
            <div className="mt-1 px-4 py-0.5 bg-[#eef9fd] dark:bg-blue-900/30 rounded-full">
                <span className="text-[#5bc0de] dark:text-[#55B9EB] text-[13px] font-bold">ID: {doctor.id}</span>
            </div>
        </div>

        {/* Info Section */}
        <div className="space-y-3">
          <h2 className="text-[17px] font-bold mb-4 dark:text-gray-200">Professional Information</h2>
          
          {/* Workplace section */}
          <div className="flex items-center p-4 bg-white dark:bg-gray-800 border border-[#f1f3f5] dark:border-gray-700 rounded-[22px] hover:bg-slate-50 dark:hover:bg-gray-750 transition-colors">
            <div className="p-[14px] bg-[#eef9fd] dark:bg-blue-900/30 rounded-2xl mr-4 text-[#5bc0de] dark:text-[#55B9EB]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[15px] dark:text-white">Workplace</h3>
              <p className="text-[13px] text-slate-400 dark:text-gray-400">{doctor.workplace}</p>
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="flex items-center p-4 bg-white dark:bg-gray-800 border border-[#f1f3f5] dark:border-gray-700 rounded-[22px] hover:bg-slate-50 dark:hover:bg-gray-750 transition-colors">
            <div className="p-[14px] bg-[#fff1f2] dark:bg-red-900/20 rounded-2xl mr-4 text-[#f87171] dark:text-red-400">
              <PhoneIcon />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[15px] dark:text-white">Contact Info</h3>
              <p className="text-[13px] text-slate-400 dark:text-gray-400">+855 12 345 678</p>
            </div>
          </div>
          
          {/* Email Info Card */}
           <div className="flex items-center p-4 bg-white dark:bg-gray-800 border border-[#f1f3f5] dark:border-gray-700 rounded-[22px] hover:bg-slate-50 dark:hover:bg-gray-750 transition-colors">
            <div className="p-[14px] bg-[#f0fdf4] dark:bg-green-900/20 rounded-2xl mr-4 text-[#4ade80] dark:text-green-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[15px] dark:text-white">Email Address</h3>
              <p className="text-[13px] text-slate-400 dark:text-gray-400">sary.sophea@thnam.com</p>
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <button 
          onClick={() => navigate('/login')}
          className="w-full bg-[#f84c6c] text-white font-bold py-[18px] rounded-[20px] mt-10 shadow-md active:scale-95 transition-transform"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default DoctorProfile;