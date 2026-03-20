import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icons } from '../assets/icons';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const menuItems = [
        { name: 'Dashboard', icon: Icons.DashboardIcon, path: '/' },
        { name: 'Patients', icon: Icons.PatientsIcon, path: '/patients' },
        { name: 'Prescriptions', icon: Icons.PrescriptionsIcon, path: '/prescriptions' },
        { name: 'Inventory', icon: Icons.InventoryIcon, path: '/inventory' }
    ];


  return (
    <aside className={`fixed left-0 top-0 h-screen bg-white border-r-2 border-gray-200 p-4 flex flex-col transition-all duration-500 ${isOpen ? 'w-64' : 'w-[82px]'}`}>
        <div onClick={() => setIsOpen(!isOpen)} className='mb-14 h-12 flex cursor-pointer items-start gap-3 pt-1'>
            <div className='flex w-12 h-12 min-w-[48px] items-center justify-center rounded-full bg-[#5dccffe3] text-white text-xl shadow-md'>
                <img src={Icons.LOGO} alt="Thnam Logo" className='w-7 h-7 brightness-0 invert'/>
            </div>

            {isOpen && (
                <div className='whitespace-nowrap overflow-hidden transition-all duration-500'>
                    <h2 className='text-lg font-bold text-slate-700 leading-tight'>Thnam</h2>
                    <span className='text-[14px] text-slate-500 font-normal'>Pharmacy Management</span>
                </div>
            )}
        </div>

        <nav className='flex-1 space-y-2'>
            {menuItems.map((item) => (
                <NavLink key={item.name} to={item.path} className={`flex items-center gap-4 rounded-full px-3 py-3 cursor-pointer transition-all ${item.active ? 'bg-[#07a2eacf] text-white shadow-md font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
                    <img src={item.icon} alt={item.name} className={`w-6 h-6 min-w-[24px] transition-all ${item.active ? 'brightness-0 invert' : 'opacity-70'}`} />

                    <span className='text-[15px] whitespace-nowrap transition-opacity duration-300 overflow-hidden'>
                        {item.name}
                    </span>
                </NavLink>
            ))}
        </nav>

        <div className='flex flex-col px-1 pb-4 gap-8'>
            <div className='flex gap-4 w-full pt-4 border-t-2 border-gray-200 items-center px-2'>
                <img src={Icons.Setting} alt='Setting' className='w-6 h-6 min-w-[24px] transition-all'/>
                <span className={`text-[15px] text-slate-700 whitespace-nowrap transition-all duration-500 overflow-hidden ${isOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>Setting</span>
            </div>

            <NavLink to="/profile" className={({ isActive }) => `flex items-center pb-4 transition-all cursor-pointer ${isOpen ? 'px-1 gap-3' : 'justify-center px-0'} ${isActive ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
>
                <div className='flex w-11 h-11 min-w-[44px] items-center justify-center rounded-full bg-green-600 text-white text-sm font-bold border-2 border-white shadow-sm'>
                    DS
                </div>
                <div className={`transition-all duration-500 overflow-hidden ${isOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>
                    <div className='text-sm font-bold text-slate-800 whitespace-nowrap'>Dr. Sophea Sary</div>
                    <div className="text-[11px] text-slate-400 font-medium whitespace-nowrap">Senior Pharmacist</div>
                </div>
            </NavLink>
        </div>
    </aside>
  )
}

export default Sidebar
