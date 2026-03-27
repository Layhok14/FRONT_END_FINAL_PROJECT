import { NavLink } from "react-router-dom";
import { Bell, Settings, User } from "lucide-react";
import Logo from "../assets/thnam.svg";

export default function Navbar() {
  const navClass = ({ isActive }) =>
    `pb-1 text-lg ${
      isActive
        ? "text-[#39ACE7] border-b-2 border-[#39ACE7]"
        : "text-gray-500 hover:text-[#39ACE7]"
    }`;

  return (
    <div className="bg-white border-b px-8 py-3 flex justify-between items-center">
      
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="bg-[#5AB8E7]/10 h-12 w-12 rounded-4xl flex justify-center items-center gap-2">
          <img src={Logo} className="w-7 h-7" />
        </div>
        <span className="font-bold text-black text-2xl">Thnam</span>
      </div>

      {/* Nav */}
      <span className="flex gap-8">
        <NavLink to="/" className={navClass}>Home</NavLink>
        <NavLink to="/medications" className={navClass}>Medications</NavLink>
        <NavLink to="/history" className={navClass}>History</NavLink>
        <NavLink to="/caregivers" className={navClass}>Caregivers</NavLink>
      </span>

      {/* Icons */}
      <div className="flex gap-4">
        <NavLink to="/" className={navClass}>
          <Bell size={18} />
        </NavLink>
        <NavLink to="/" className={navClass}>
          <Settings size={18} />
        </NavLink>
        <NavLink to="/" className={navClass}>
          <User size={18} />
        </NavLink>
      </div>
    </div>
  );
}