import React, { useState } from 'react';
import { User, Link, Target, CalendarDays, Bell, CheckCircle, Clock, Sun, Sunset, Moon } from 'lucide-react';


export default function NewPrescription() {
  const [patientId, setPatientId] = useState('');
  const [medicationId, setMedicationId] = useState('');

  const [dosage, setDosage] = useState('1'); 
  const [frequency, setFrequency] = useState('Daily');
  const [mealPhase, setMealPhase] = useState('before');
  const [timesOfDay, setTimesOfDay] = useState([]);

  const [startDate, setStartDate] = useState('');
  const [targetStock, setTargetStock] = useState('');
  const [remark, setRemark] = useState('');


  const handleTimeToggle = (time) => {
    setTimesOfDay(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  const medications = [
    { id: 'm1', name: 'Amoxicillin 500mg', purpose: 'Antibitioc' },
    { id: 'm2', name: 'Lisinopril 10mg', purpose: 'Blood pressure support' }
  ];

  // calculate duration (how many day roughly)
  const calculateDuration = () => {
    const stock = parseInt(targetStock) || 0;
    const dose = parseInt(dosage) || 1;
    let multiplier = 1;
    if (frequency === 'Daily') multiplier = 1;
    else if (frequency === 'Twice') multiplier = 2;
    else if (frequency === 'Thrice') multiplier = 3;
    else if (frequency === 'week') multiplier = 1/7;
    else if (frequency === 'Month') multiplier = 1/30;
    
    if (stock === 0 || dose === 0 || multiplier === 0) return 0;
    return Math.floor(stock / (dose * multiplier));
  };

  const durationDays = calculateDuration();

  const handleSave = () => {
    if (!patientId || !medicationId || !targetStock || !startDate) {
      alert('Please fill all required fields before saving.');
      return;
    }

    const selectedMed = medications.find(m => m.id === medicationId);

    const finalFrequency = frequency === 'Daily' ? 'Once a day' : 
                          frequency === 'Twice' ? 'Twice a day' : 
                          frequency === 'Thrice' ? 'Thrice a day' : 
                          frequency === 'week' ? 'Once a week' : 'Once a Month';

    const finalMealPhase = mealPhase === 'before' ? 'Before meal' : 
                           mealPhase === 'after' ? 'After meal' : 'Before sleep';

    const finalTimeOfDay = timesOfDay.length > 0 ? timesOfDay.join(' and ') : '';

    const newPrescription = {
      id: `med-${Date.now()}`,
      name: selectedMed?.name || 'Unknown Medication',
      purpose: selectedMed?.purpose || '', // optional
      dosage: `${dosage} ${dosage === '1' ? 'pill' : 'pills'}`,
      doseRemaining: parseInt(targetStock),
      targetStock: parseInt(targetStock), // initial stock
      frequency: finalFrequency,
      timeOfDay: finalTimeOfDay, // 'Morning and afternoon'
      mealPhase: finalMealPhase, // section included
      category: 'tablet', 

      imageUrl: null,
      remark: remark,
      assignedDate: startDate,
      startedDate: startDate,
      durationDays: durationDays, // function to calculate the length
      endedDate: null,
      patientId: patientId
    };

    const existing = JSON.parse(localStorage.getItem('adminPrescription') || '[]');
    existing.push(newPrescription);
    localStorage.setItem('adminPrescription', JSON.stringify(existing));
    
    alert('Prescription saved successfully to localStorage!');
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">New Prescription</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Add a new medication schedule for a patient.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 dark:border-gray-700">
        
        {/* Patient Information Section */}
        <section className="mb-8">
          <h3 className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 text-[#55B9EB] p-2 rounded-xl">
              <User size={20} />
            </div>
            Patient Information
          </h3>
          <div className="flex flex-col">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">SELECT PATIENT</label>
            <select 
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-800 dark:text-white focus:ring-2 focus:ring-[#55B9EB] focus:border-transparent outline-none transition-all font-medium appearance-none"
            >
              <option value="" disabled>Search and select patient (e.g. Sophy Chen)</option>
              <option value="1">Sophy Chen</option>
              <option value="2">John Doe</option>
            </select>
          </div>
        </section>


        <hr className="border-gray-100 dark:border-gray-700 my-8" />


        {/* Medication & Dosage Section */}
        <section className="mb-8">
          <h3 className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 text-[#55B9EB] p-2 rounded-xl">
              <Link size={20} />
            </div>
            Medication & Dosage
          </h3>
          
          
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-1 flex flex-col">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">MEDICATION NAME</label>
              
              {/* choice selection */}
              <select 
                value={medicationId}
                onChange={(e) => setMedicationId(e.target.value)}
                className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-800 dark:text-white focus:ring-2 focus:ring-[#55B9EB] outline-none transition-all font-medium appearance-none"
              >
                <option value="" disabled>Select medication</option>
                {medications.map(med => (
                  <option key={med.id} value={med.id}>{med.name}</option>
                ))}
              </select>

            </div>
            

            <div className="flex-1 flex flex-col">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">DOSE PER INTAKE</label>
              
              {/* choice: selection */}
              <select 
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-800 dark:text-white focus:ring-2 focus:ring-[#55B9EB] outline-none transition-all font-medium appearance-none"
              >
                <option value="1">1 pill</option>
                <option value="2">2 pills</option>
                <option value="3">3 pills</option>
              </select>

            </div>
          </div>
          

          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-1 flex flex-col">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">FREQUENCY</label>
              
              {/* choice: selection  */}
              <select 
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-800 dark:text-white focus:ring-2 focus:ring-[#55B9EB] outline-none transition-all font-medium appearance-none"
              >
                <option value="Daily">Once a day</option>
                <option value="week">Once a week</option>
                <option value="Month">Once a Month</option>
                <option value="Twice">Twice a Day</option>
                <option value="Thrice">Thrice a Day</option>
              </select>
            </div>
            
            <div className="flex-1 flex flex-col">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">START DATE</label>
              
              {/* Input: date */}
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-800 dark:text-white focus:ring-2 focus:ring-[#55B9EB] outline-none transition-all font-medium" 
                placeholder="mm/dd/yyyy" 
              />
            </div>
          </div>

          <div className="flex flex-col mb-6">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 tracking-wide">TIME OF DAY</label>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {[
                { id: 'morning', label: 'Morning', desc: 'Before 12:00 PM', icon: Sun },
                { id: 'afternoon', label: 'Afternoon', desc: '12:00 PM - 6:00 PM', icon: Sunset },
                { id: 'evening', label: 'Evening/Night', desc: 'After 6:00 PM', icon: Moon }
              ].map((time) => {
                const isSelected = timesOfDay.includes(time.label);
                const Icon = time.icon;
                return (
                  <label 
                    key={time.id}
                    className={`flex-1 flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-[#55B9EB] bg-blue-50/50 dark:bg-blue-900/30 text-[#0f6b9b] dark:text-[#55B9EB]' 
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-blue-200 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={isSelected}
                      onChange={() => handleTimeToggle(time.label)}
                    />
                    <Icon className={`mb-2 ${isSelected ? 'text-[#55B9EB]' : 'text-gray-400 dark:text-gray-500'}`} size={28} />
                    <span className={`font-bold text-center ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{time.label}</span>
                    <span className="text-xs font-medium mt-1 opacity-70 text-center">{time.desc}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className='flex flex-col md:flex-row gap-6 mb-6'>

            <div className='flex-1 flex flex-col'>
              <label className='text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide'>MEAL PHASE</label>

              {/* choice: selection for before or after meal */}
              <select 
                value={mealPhase}
                onChange={(e) => setMealPhase(e.target.value)}
                className='w-full p-3.5 rounded-2xl border-gray-200 dark:border-gray-700 border bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-[#55B9EB] transition-all font-medium '
              >
                <option value="before">Before Meal</option>
                <option value="after">After Meal</option>
                <option value="sleep">Before sleep</option>
              </select>
            </div>
          </div>

          <div className='flex gap-6 mb-6'>
            <div className='flex-1 flex flex-col'>
              <label className='tracking-wide text-sm font-bold mb-2 text-gray-700 dark:text-gray-300'>REMARK / DESCRIPTION</label>
              <textarea 
                name="remark" 
                id="remark" 
                rows={2} 
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="e.g. Put little water before taking."
                className='w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-800 dark:text-white focus:ring-2 focus:ring-[#55B9EB] outline-none transition-all'
              />
            </div>
          </div>

          {/* Total Quantity */}
          <div className="flex flex-col md:flex-row gap-6 mt-8 p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-900/30">
            <div className="flex-1 flex flex-col">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide">TOTAL QUANTITY (UNITS)</label>
              
              {/* input: for quantity */}
              <input 
                type="number" 
                value={targetStock}
                onChange={(e) => setTargetStock(e.target.value)}
                className="w-full p-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-800 dark:text-white focus:ring-2 focus:ring-[#55B9EB] outline-none transition-all font-medium block" 
                placeholder="e.g. 60" 
              />
            
            {/* Estimated supply day */}
            </div>
            <div className="flex-1 flex items-center pt-6">
              <div className="flex items-center gap-3 text-blue-800 dark:text-blue-300 bg-blue-100/50 dark:bg-blue-900/30 px-5 py-3.5 rounded-2xl w-full">
                <CalendarDays className="text-[#55B9EB]" size={24} />
                <span className="font-medium">Estimated supply:</span>
                <strong className="font-black text-lg">{durationDays} days</strong>
              </div>
            </div>
          </div>
        </section>
        

        <hr className="border-gray-100 dark:border-gray-700 my-8" />
        

        <div className="flex items-center justify-end gap-4 mt-8">
          <button className="px-8 py-3.5 rounded-full font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none">
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-8 py-3.5 rounded-full font-bold text-white bg-[#55B9EB] hover:bg-[#4AA8D8] shadow-md hover:shadow-lg transition-all focus:outline-none"
          >
            Save Prescription
          </button>
        </div>
      </div>
    </div>
  );
}
