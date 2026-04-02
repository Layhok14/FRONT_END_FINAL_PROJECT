import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminPatients = () => {
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('thnam_patients');
    if (saved) return JSON.parse(saved);

    return [
      { name: 'Sok Mean', id: 'TH-0012', age: 72, dose: '08:00 AM Today', status: 'On Track', statusColor: 'bg-emerald-500' },
      { name: 'Keo Veasna', id: 'TH-0024', age: 68, dose: 'Missed (07:00 AM)', status: 'Late dose', statusColor: 'bg-amber-500' },
      { name: 'Chan Phalla', id: 'TH-0041', age: 81, dose: '09:15 AM Today', status: 'On Track', statusColor: 'bg-emerald-500' },
      { name: 'Nhek Vann', id: 'TH-0056', age: 75, dose: 'Missed Today', status: 'Alert', statusColor: 'bg-rose-500' },
      { name: 'Thida Chhay', id: 'TH-0062', age: 64, dose: '10:00 AM Today', status: 'On Track', statusColor: 'bg-emerald-500' },
      { name: 'Oum Sony', id: 'TH-0078', age: 59, dose: '11:00 AM Today', status: 'On Track', statusColor: 'bg-emerald-500' },
      { name: 'Vannak Kiri', id: 'TH-0089', age: 70, dose: '07:30 AM Today', status: 'On Track', statusColor: 'bg-emerald-500' },
      { name: 'Srey Leak', id: 'TH-0092', age: 62, dose: 'Missed Today', status: 'Alert', statusColor: 'bg-rose-500' },
      { name: 'Mony Roth', id: 'TH-0105', age: 85, dose: '08:45 AM Today', status: 'On Track', statusColor: 'bg-emerald-500' },
      { name: 'Bun Thoeun', id: 'TH-0112', age: 77, dose: '09:00 AM Today', status: 'On Track', statusColor: 'bg-emerald-500' },
      { name: 'Chitra Long', id: 'TH-0128', age: 69, dose: 'Late (10:00 AM)', status: 'Late dose', statusColor: 'bg-amber-500' },
      { name: 'Dara Sam', id: 'TH-0134', age: 55, dose: '12:00 PM Today', status: 'On Track', statusColor: 'bg-emerald-500' },
      { name: 'Heng Ly', id: 'TH-0145', age: 80, dose: '07:00 AM Today', status: 'On Track', statusColor: 'bg-emerald-500' },
      { name: 'Sophal Na', id: 'TH-0156', age: 66, dose: 'Missed Today', status: 'Alert', statusColor: 'bg-rose-500' },
      { name: 'Rithy Pen', id: 'TH-0167', age: 73, dose: '08:15 AM Today', status: 'On Track', statusColor: 'bg-emerald-500' },
      { name: 'Sopheak Vy', id: 'TH-0178', age: 61, dose: '09:30 AM Today', status: 'On Track', statusColor: 'bg-emerald-500' },
      { name: 'Borey Chet', id: 'TH-0189', age: 74, dose: '10:30 AM Today', status: 'On Track', statusColor: 'bg-emerald-500' },
      { name: 'Phanith Keo', id: 'TH-0201', age: 65, dose: '08:30 AM Today', status: 'On Track', statusColor: 'bg-emerald-500' },
      { name: 'Vichea Sam', id: 'TH-0212', age: 70, dose: 'Missed (09:00 AM)', status: 'Late dose', statusColor: 'bg-amber-500' },
      { name: 'Srey Mao', id: 'TH-0223', age: 82, dose: '07:45 AM Today', status: 'On Track', statusColor: 'bg-emerald-500' },
      { name: 'Rith Sothy', id: 'TH-0234', age: 58, dose: 'Missed Today', status: 'Alert', statusColor: 'bg-rose-500' },
      { name: 'Tola Mean', id: 'TH-0245', age: 67, dose: '11:15 AM Today', status: 'On Track', statusColor: 'bg-emerald-500' },
      { name: 'Sokun Chhay', id: 'TH-0256', age: 78, dose: '09:45 AM Today', status: 'On Track', statusColor: 'bg-emerald-500' },
      { name: 'Piseth Long', id: 'TH-0267', age: 63, dose: '10:00 AM Today', status: 'On Track', statusColor: 'bg-emerald-500' }
    ];
  });

  useEffect(() => {localStorage.setItem('thnam_patients', JSON.stringify(patients));}, [patients]);
  const filteredPatients = patients.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase()));
  const displayedPatients = showAll ? filteredPatients : filteredPatients.slice(0, 4);

  const stats = [
    { label: 'ADHERENCE RATE', value: '86%', change: '↑2.4%', subtext: 'Above benchmark for this month', color: 'text-emerald-500', icon: '🔄' },
    { label: 'ACTIVE PATIENTS', value: '24', change: '+1', subtext: 'Currently managed on the platform', color: 'text-emerald-500', icon: '👥' },
    { label: 'MISSED DOSES TODAY', value: '3', change: '0%', subtext: 'Action required for follow-up', color: 'text-rose-500', icon: '⚠️' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 duration-500 p-4 md:p-8">
      {/* Header and Search Input */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
           <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Dashboard Overview</h1>
           <p className="text-slate-400 dark:text-gray-400 font-medium">Monitor patient adherence and statistics</p>
        </div>
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Search patients by name or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5bc0de] focus:border-transparent text-[14px] font-medium transition-all"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
      </div>

      {/* --- STATS SECTION --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-7 rounded-[28px] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-bold text-slate-400 tracking-widest">{stat.label}</span>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-lg grayscale opacity-50">
                {stat.icon}
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">{stat.value}</span>
              <span className={`text-[13px] font-bold ${stat.color}`}>{stat.change}</span>
            </div>
            <p className="text-[12px] text-slate-400 mt-2 font-medium">{stat.subtext}</p>
          </div>
        ))}
      </div>

      {/* --- RECENT PATIENTS SECTION --- */}
      <div className="bg-white dark:bg-gray-800 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        {/* Table Header Area */}
        <div className="p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-50 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Recent Patients</h2>
            <p className="text-sm text-slate-400 dark:text-gray-400 font-medium">Managing patient adherence and prescriptions</p>
          </div>
          <Link to="/admin/patients/add" className="bg-[#5bc0de] hover:bg-[#4ab0ce] text-white px-7 py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-[#5bc0de] focus:ring-offset-2">
            <span className="text-xl leading-none">+</span> Add Patient
          </Link>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="text-[11px] font-bold text-slate-400 dark:text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800/50">
                <th className="px-6 md:px-8 py-5">Patient Name</th>
                <th className="px-4 py-5">Age</th>
                <th className="px-4 py-5">Last Dose</th>
                <th className="px-4 py-5">Status</th>
                <th className="px-6 md:px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {displayedPatients.map((patient, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-gray-750 transition-colors group">
                  <td className="px-6 md:px-8 py-6 flex items-center gap-4">
                    <div className="w-11 h-11 shrink-0 rounded-full bg-[#eef9fd] flex items-center justify-center text-[#5bc0de] font-bold text-xs ring-4 ring-white shadow-sm">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-white text-[15px] group-hover:text-[#5bc0de] transition-colors">{patient.name}</div>
                      <div className="text-[11px] text-slate-400 dark:text-gray-400 font-bold tracking-tight">ID: {patient.id}</div>
                    </div>
                  </td>
                  <td className="px-4 py-6 text-slate-600 dark:text-gray-300 font-bold text-[15px]">{patient.age}</td>
                  <td className="px-4 py-6 text-slate-500 dark:text-gray-400 font-medium text-[14px]">{patient.dose}</td>
                  <td className="px-4 py-6">
                    <div className="flex items-center gap-2.5 inline-flex bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-700 shadow-sm">
                      <div className={`w-2.5 h-2.5 rounded-full ${patient.statusColor}`}></div>
                      <span className="text-[13px] font-bold text-slate-700 dark:text-gray-200 whitespace-nowrap">{patient.status}</span>
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-6 text-right">
                    <Link 
                      to="/admin/prescriptions"
                      state={{ patientId: patient.id }}
                      className="text-[#5bc0de] bg-[#eef9fd] hover:bg-[#d8eff8] px-4 py-2 rounded-xl font-bold text-[13px] transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#5bc0de] focus:ring-offset-2 inline-flex items-center gap-1.5"
                    >
                      Prescribe
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredPatients.length === 0 && (
             <div className="p-12 text-center text-slate-500 dark:text-gray-400 font-medium bg-slate-50/50 dark:bg-gray-800/50">
               No patients found matching "{searchTerm}"
             </div>
          )}

          <div className="p-6 text-center border-t border-gray-50 dark:border-gray-700 bg-slate-50/30 dark:bg-gray-800/30">
            <button 
              onClick={() => setShowAll(!showAll)} 
              className="text-slate-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 px-6 py-2.5 rounded-full text-[13px] font-bold hover:text-[#5bc0de] dark:hover:text-[#5bc0de] hover:border-[#5bc0de] dark:hover:border-[#5bc0de] hover:shadow-md transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#5bc0de] focus:ring-offset-2"
            >
              {showAll ? "Show less" : `View all ${filteredPatients.length} patients`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPatients;
