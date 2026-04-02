import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserPlus, FileText, CalendarDays, CheckCircle, AlertTriangle, ArrowDown, X, Phone, MapPin } from 'lucide-react';

export default function AdminPatients() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4);

  const patients = [
    {
      id: "P-10024",
      name: "Sok Hem",
      status: "AT RISK",
      statusColor: "text-red-500 bg-red-50 dark:bg-red-500/10",
      borderLeftColor: "border-l-red-500",
      medications: 3,
      infoIcon: CalendarDays,
      infoText: "Missed 2 doses",
      infoColor: "text-red-500",
      imageUrl: "https://i.pravatar.cc/150?u=sokhem",
      age: 68,
      gender: "Male",
      contact: "+855 12 345 678",
      address: "Boeung Keng Kang, Phnom Penh",
      conditions: "Hypertension, Occasional irregular heartbeat"
    },
    {
      id: "P-10025",
      name: "Chan Mony",
      status: "STABLE",
      statusColor: "text-green-600 bg-green-50 dark:bg-green-500/10",
      borderLeftColor: "border-l-green-500",
      medications: 5,
      infoIcon: CheckCircle,
      infoText: "Adherence: 98%",
      infoColor: "text-green-600",
      imageUrl: "https://i.pravatar.cc/150?u=chanmony",
      age: 72,
      gender: "Female",
      contact: "+855 98 765 432",
      address: "Toul Tom Poung, Phnom Penh",
      conditions: "Type 2 Diabetes, High Cholesterol"
    },
    {
      id: "P-10026",
      name: "Keo Sarath",
      status: "MISSED",
      statusColor: "text-red-400 bg-red-50 dark:bg-red-500/10",
      borderLeftColor: "border-l-red-500",
      medications: 2,
      infoIcon: AlertTriangle,
      infoText: "Refill overdue",
      infoColor: "text-red-500",
      imageUrl: "https://i.pravatar.cc/150?u=keosarath",
      age: 65,
      gender: "Male",
      contact: "+855 11 222 333",
      address: "Sen Sok, Phnom Penh",
      conditions: "Arthritis"
    },
    {
      id: "P-10027",
      name: "Vannak Devi",
      status: "AT RISK",
      statusColor: "text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10",
      borderLeftColor: "border-l-yellow-500",
      medications: 4,
      infoIcon: AlertTriangle,
      infoText: "Low stock alert",
      infoColor: "text-yellow-600",
      imageUrl: "https://i.pravatar.cc/150?u=vannakdevi",
      age: 61,
      gender: "Female",
      contact: "+855 88 999 000",
      address: "Chroy Changvar, Phnom Penh",
      conditions: "Osteoporosis, Asthma"
    },
    {
      id: "P-10028",
      name: "Chhaya Rith",
      status: "STABLE",
      statusColor: "text-green-600 bg-green-50 dark:bg-green-500/10",
      borderLeftColor: "border-l-green-500",
      medications: 2,
      infoIcon: CheckCircle,
      infoText: "Adherence: 100%",
      infoColor: "text-green-600",
      imageUrl: "https://i.pravatar.cc/150?u=chhayarith",
      age: 70,
      gender: "Male",
      contact: "+855 12 111 222",
      address: "Daun Penh, Phnom Penh",
      conditions: "Mild Hypertension"
    }
  ];

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      // Category Tab Filter
      if (activeTab === 'Missed' && p.status !== 'MISSED') return false;
      if (activeTab === 'At Risk' && p.status !== 'AT RISK') return false;
      if (activeTab === 'Stable' && p.status !== 'STABLE') return false;

      // Search Query Filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchId = p.id.toLowerCase().includes(query);
        const matchCondition = p.infoText.toLowerCase().includes(query) || (p.conditions && p.conditions.toLowerCase().includes(query));
        
        if (!matchName && !matchId && !matchCondition) return false;
      }
      return true;
    });
  }, [activeTab, searchQuery]);

  // Tab counts
  const getTabLabel = (tabName) => {
    if (tabName === 'All') return `All (${patients.length})`;
    if (tabName === 'Missed') return `Missed (${patients.filter(p => p.status === 'MISSED').length})`;
    if (tabName === 'At Risk') return `At Risk (${patients.filter(p => p.status === 'AT RISK').length})`;
    if (tabName === 'Stable') return `Stable (${patients.filter(p => p.status === 'STABLE').length})`;
    return tabName;
  };

  const tabs = ['All', 'Missed', 'At Risk', 'Stable'];
  const visiblePatientsList = filteredPatients.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPatients.length;

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col relative">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#1F2937] dark:text-white mb-2 tracking-tight">Patients</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis">Manage and monitor elderly patient medication adherence.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8 max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={20} className="text-gray-400" />
        </div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search patients by name, ID, or condition..." 
          className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 dark:bg-gray-800/50 border-none rounded-2xl text-gray-800 dark:text-white focus:ring-2 focus:ring-[#55B9EB] outline-none transition-all font-medium placeholder:text-gray-400"
        />
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex flex-wrap gap-3">
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setVisibleCount(4); // Reset pagination on tab change
              }}
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm border border-transparent
                ${activeTab === tab 
                  ? 'bg-[#55B9EB] text-white shadow-[#55B9EB]/20 border border-[#4AA8D8]' 
                  : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-100 dark:border-gray-700'
                }`}
            >
              {getTabLabel(tab)}
            </button>
          ))}
        </div>
        
        <Link 
          to="/admin/patients/add"
          className="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm text-white bg-[#55B9EB] hover:bg-[#4AA8D8] shadow-md hover:shadow-lg transition-all"
        >
          <UserPlus size={18} />
          Add Patient
        </Link>
      </div>

      {/* Patient Grid */}
      {visiblePatientsList.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {visiblePatientsList.map(patient => (
            <div 
              key={patient.id} 
              className={`bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 ${patient.borderLeftColor} border-l-4 overflow-hidden relative group hover:shadow-md transition-all`}
            >
              <div className="flex gap-4">
                <img src={patient.imageUrl} alt={patient.name} className="w-20 h-20 rounded-2xl object-cover shrink-0 bg-gray-100" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">{patient.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">ID: {patient.id}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${patient.statusColor}`}>
                      {patient.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-sm font-medium">
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                      <FileText size={16} className="text-gray-400" />
                      {patient.medications} Medications
                    </div>
                    <div className={`flex items-center gap-1.5 ${patient.infoColor}`}>
                      <patient.infoIcon size={16} />
                      {patient.infoText}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setSelectedPatient(patient)}
                  className="flex-1 py-2.5 rounded-full font-bold text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors focus:outline-none"
                >
                  View Profile
                </button>
                <Link 
                  to="/admin/prescriptions"
                  state={{ patientId: patient.id }}
                  className="flex-1 flex justify-center items-center py-2.5 rounded-full font-bold text-sm text-white bg-[#55B9EB] hover:bg-[#4AA8D8] shadow-sm transition-colors"
                >
                  Prescribe
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <FileText size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">No patients found</h3>
          <p className="text-sm">Try modifying your search or filters.</p>
        </div>
      )}

      {/* Show More Pagination */}
      {hasMore && (
        <div className="flex justify-center mt-auto pb-4">
          <button 
            onClick={() => setVisibleCount(prev => prev + 4)}
            className="flex items-center gap-2 text-[#55B9EB] hover:text-[#4AA8D8] font-bold transition-colors group focus:outline-none"
          >
            Show more patients
            <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Patient Profile Modal Popup */}
      {selectedPatient && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedPatient(null)}
          ></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
            {/* Header portion with close button */}
            <div className={`h-24 ${selectedPatient.status === 'MISSED' || selectedPatient.status === 'AT RISK' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} relative`}>
              <button 
                onClick={() => setSelectedPatient(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 text-gray-700 dark:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Body */}
            <div className="px-6 pb-6 relative">
              <img 
                src={selectedPatient.imageUrl} 
                alt={selectedPatient.name} 
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-gray-800 shadow-sm -mt-12 mb-4 bg-gray-100" 
              />
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">{selectedPatient.name}</h2>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">ID: {selectedPatient.id}</p>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-black tracking-wider uppercase ${selectedPatient.statusColor}`}>
                  {selectedPatient.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1">AGE</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedPatient.age} years</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1">GENDER</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedPatient.gender}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-0.5">CONTACT</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedPatient.contact}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-0.5">ADDRESS</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedPatient.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText size={18} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-0.5">CONDITIONS</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedPatient.conditions}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex gap-3">
                <Link 
                  to="/admin/prescriptions"
                  state={{ patientId: selectedPatient.id }}
                  className="w-full text-center py-3.5 rounded-full font-bold text-white bg-[#55B9EB] hover:bg-[#4AA8D8] shadow-md hover:shadow-lg transition-all"
                >
                  Create New Prescription
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
