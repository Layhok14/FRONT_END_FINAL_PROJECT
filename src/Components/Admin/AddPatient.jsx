import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, ShieldAlert, Phone, MapPin, Activity } from 'lucide-react';

export default function AddPatient() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    allergies: '',
    conditions: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert('Patient information saved successfully!');
    // Redirect or clear form here
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Add New Patient</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Register a new patient into the system.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 dark:border-gray-700">
        
        {/* Personal Information */}
        <section className="mb-8">
          <h3 className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 text-[#55B9EB] p-2 rounded-xl">
              <User size={20} />
            </div>
            Personal Information
          </h3>
          
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-1 flex flex-col">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">FIRST NAME</label>
              <input 
                type="text" 
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="e.g. Sophy"
                className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-800 dark:text-white focus:ring-2 focus:ring-[#55B9EB] focus:border-transparent outline-none transition-all font-medium"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">LAST NAME</label>
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="e.g. Chen"
                className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-800 dark:text-white focus:ring-2 focus:ring-[#55B9EB] focus:border-transparent outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-1 flex flex-col">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">DATE OF BIRTH</label>
              <input 
                type="date" 
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-800 dark:text-white focus:ring-2 focus:ring-[#55B9EB] outline-none transition-all font-medium" 
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">GENDER</label>
              <select 
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-800 dark:text-white focus:ring-2 focus:ring-[#55B9EB] outline-none transition-all font-medium appearance-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </section>

        <hr className="border-gray-100 dark:border-gray-700 my-8" />

        {/* Contact Information */}
        <section className="mb-8">
          <h3 className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 text-[#55B9EB] p-2 rounded-xl">
              <Phone size={20} />
            </div>
            Contact Information
          </h3>
          
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-1 flex flex-col">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">PHONE NUMBER</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+855 XX XXX XXX"
                className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-800 dark:text-white focus:ring-2 focus:ring-[#55B9EB] outline-none transition-all font-medium"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">EMAIL (OPTIONAL)</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="patient@example.com"
                className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-800 dark:text-white focus:ring-2 focus:ring-[#55B9EB] outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex flex-col mb-6">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">RESIDENTIAL ADDRESS</label>
            <div className="relative">
              <div className="absolute top-3.5 left-4 text-gray-400">
                <MapPin size={20} />
              </div>
              <textarea 
                name="address"
                rows={2}
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter full address"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-800 dark:text-white focus:ring-2 focus:ring-[#55B9EB] outline-none transition-all font-medium"
              />
            </div>
          </div>
        </section>

        <hr className="border-gray-100 dark:border-gray-700 my-8" />

        {/* Medical History */}
        <section className="mb-8">
          <h3 className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white mb-6">
            <div className="bg-red-50 dark:bg-red-900/30 text-red-500 p-2 rounded-xl">
              <Activity size={20} />
            </div>
            Medical Details & Emergency
          </h3>
          
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-1 flex flex-col">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">EMERGENCY CONTACT NAME</label>
              <input 
                type="text" 
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
                placeholder="Relative or friend's name"
                className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-800 dark:text-white focus:ring-2 focus:ring-[#55B9EB] outline-none transition-all font-medium"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">EMERGENCY CONTACT PHONE</label>
              <input 
                type="tel" 
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
                placeholder="+855 XX XXX XXX"
                className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-800 dark:text-white focus:ring-2 focus:ring-[#55B9EB] outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex flex-col gap-6 mb-6">
            <div className="flex flex-col">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">
                KNOWN ALLERGIES <ShieldAlert size={16} className="text-orange-500" />
              </label>
              <input 
                type="text" 
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="e.g. Penicillin, Peanuts (or 'None')"
                className="w-full p-3.5 bg-white dark:bg-gray-800 border-2 border-orange-100 dark:border-orange-900/30 focus:border-orange-400 dark:focus:border-orange-600 rounded-2xl text-gray-800 dark:text-white outline-none transition-all font-medium"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">PRE-EXISTING CONDITIONS</label>
              <textarea 
                name="conditions"
                rows={2}
                value={formData.conditions}
                onChange={handleChange}
                placeholder="e.g. Hypertension, Type 2 Diabetes"
                className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-800 dark:text-white focus:ring-2 focus:ring-[#55B9EB] outline-none transition-all font-medium"
              />
            </div>
          </div>
        </section>

        <hr className="border-gray-100 dark:border-gray-700 my-8" />

        <div className="flex items-center justify-end gap-4 mt-8">
          <Link to="/admin/patients" className="px-8 py-3.5 rounded-full font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none">
            Cancel
          </Link>
          <button 
            onClick={handleSave}
            className="px-8 py-3.5 rounded-full font-bold text-white bg-[#55B9EB] hover:bg-[#4AA8D8] shadow-md hover:shadow-lg transition-all focus:outline-none"
          >
            Save Patient
          </button>
        </div>
      </div>
    </div>
  );
}
