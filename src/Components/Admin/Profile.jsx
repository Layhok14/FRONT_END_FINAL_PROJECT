import React from 'react';
import { Routes, Route } from 'react-router-dom';

const PillIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
);

const BellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.81 12.81 0 0 0 .62 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.62A2 2 0 0 1 22 16.92z"/></svg>
);

const ChevronIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

const DoctorProfile = () => {
  const doctor = {
    name: "Dr. Sophea Sary",
    id: "TN-00142",
    workplace: "Preah Vihear Pharmacy",
    avatar: "https://via.placeholder.com/150", 
  };

  return (
    <div className="font-sans text-[#1a1c1e]">
      
      <nav className="flex justify-end items-center px-8 border-b border-gray-100 space-x-8 text-sm font-medium text-slate-500">
        <button className="relative p-2 text-slate-400 hover:text-sky-500 transition-colors">
          <BellIcon />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
      </nav>

      <div className="max-w-md mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
            {/* <div className='flex w-11 h-11 min-w-[44px] text-sm font-bold border-2 border-white shadow-sm'>
                DS
            </div> */}
            <div className="flex w-24 h-24 rounded-full border-2 text-3xl font-bold items-center justify-center bg-green-600  text-white border-slate-100 shadow-sm">
                DS
            </div>
            <h1 className="text-[26px] font-extrabold mt-4 tracking-tight">{doctor.name}</h1>
            <div className="mt-1 px-4 py-0.5 bg-[#eef9fd] rounded-full">
                <span className="text-[#5bc0de] text-[13px] font-bold">ID: {doctor.id}</span>
            </div>
        </div>

        {/* Menu Section */}
        <div className="space-y-3">
          <h2 className="text-[17px] font-bold mb-4">Health & Care</h2>
          
          {/* My Medicines Card */}
          <div className="flex items-center p-4 bg-white border border-[#f1f3f5] rounded-[22px] cursor-pointer hover:bg-slate-50">
            <div className="p-[14px] bg-[#eef9fd] rounded-2xl mr-4 text-[#5bc0de]">
              <PillIcon />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[15px]">My Medicines</h3>
              <p className="text-[13px] text-slate-400">View and manage prescriptions</p>
            </div>
            <div className="text-slate-300"><ChevronIcon /></div>
          </div>

          {/* Emergency Contact Card */}
          <div className="flex items-center p-4 bg-white border border-[#f1f3f5] rounded-[22px] cursor-pointer hover:bg-slate-50">
            <div className="p-[14px] bg-[#fff1f2] rounded-2xl mr-4 text-[#f87171]">
              <PhoneIcon />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[15px]">Emergency Contact</h3>
              <p className="text-[13px] text-slate-400">Sophea Sary • 012 345 678</p>
            </div>
            <div className="text-slate-300"><ChevronIcon /></div>
          </div>
        </div>

        {/* Sign Out Button */}
        <button className="w-full bg-[#f84c6c] text-white font-bold py-[18px] rounded-[20px] mt-10 shadow-md active:scale-95 transition-transform">
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default DoctorProfile;