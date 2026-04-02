import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PillIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#5bc0de" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
    <path d="m8.5 8.5 7 7"/>
  </svg>
);

const AdminIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3"/>
    <path d="M12 8v4M12 16h.01"/>
  </svg>
);

const PatientIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const EyeIcon = ({ open }) => open ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/patient');
      }
    }, 900);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#dff0f7] via-[#eaf6fb] to-[#f0f8fc] px-4 font-sans">
      <div className="w-full max-w-md">

        {/* Logo & Branding */}
        <div className="flex flex-col items-center mb-8 gap-1">
          <div className="mb-2">
            <PillIcon />
          </div>
          <h1 className="text-[42px] font-black text-[#1a2e3b] tracking-tight leading-none">Thnam</h1>
          <div className="w-10 h-[3px] bg-[#e8b84b] rounded-full mt-1 mb-2" />
          {/* Khmer subtitle */}
          <span className="text-[15px] text-slate-400 font-medium tracking-wide">ថ្នាំ</span>
          <p className="text-[14px] text-slate-400 mt-1 italic">"Right dose. Right time. No worry."</p>
        </div>

        {/* Role Selector */}
        <div className="mb-6">
          <p className="text-[17px] font-bold text-[#1a2e3b] mb-3">I am a...</p>
          <div className="grid grid-cols-2 gap-3">
            {/* Admin Card */}
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`relative flex flex-col items-center gap-2 p-5 rounded-4xl border-2 transition-all duration-200 cursor-pointer
                ${role === 'admin'
                  ? 'border-[#5bc0de] bg-white shadow-md shadow-[#5bc0de22]'
                  : 'border-transparent bg-white/70 hover:bg-white hover:border-slate-200'
                }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all
                ${role === 'admin' ? 'bg-[#5bc0de] text-white' : 'bg-[#eaf6fb] text-[#5bc0de]'}`}>
                <AdminIcon />
              </div>
              <span className="font-bold text-[14px] text-[#1a2e3b]">Pharmacy Admin</span>
              <span className="text-[12px] text-slate-400">Hospital access</span>
              {role === 'admin' && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-[#5bc0de] mt-1">
                  <CheckIcon /> SELECTED
                </span>
              )}
            </button>

            {/* Patient Card */}
            <button
              type="button"
              onClick={() => setRole('patient')}
              className={`relative flex flex-col items-center gap-2 p-5 rounded-4xl border-2 transition-all duration-200 cursor-pointer
                ${role === 'patient'
                  ? 'border-[#5bc0de] bg-white shadow-md shadow-[#5bc0de22]'
                  : 'border-transparent bg-white/70 hover:bg-white hover:border-slate-200'
                }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all
                ${role === 'patient' ? 'bg-[#5bc0de] text-white' : 'bg-[#eaf6fb] text-[#5bc0de]'}`}>
                <PatientIcon />
              </div>
              <span className="font-bold text-[14px] text-[#1a2e3b]">Patient</span>
              <span className="text-[12px] text-slate-400">Personal management</span>
              {role === 'patient' && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-[#5bc0de] mt-1">
                  <CheckIcon /> SELECTED
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-[13px] font-semibold text-[#1a2e3b] mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-[14px] text-slate-700 placeholder-slate-300 outline-none focus:ring-2 focus:ring-[#5bc0de] focus:border-transparent transition"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[13px] font-semibold text-[#1a2e3b]">Password</label>
              <button type="button" className="text-[13px] text-[#5bc0de] font-semibold hover:underline">
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-[14px] text-slate-700 placeholder-slate-300 outline-none focus:ring-2 focus:ring-[#5bc0de] focus:border-transparent transition pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-[13px] text-rose-500 font-medium text-center">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#5bc0de] hover:bg-[#4ab0ce] disabled:opacity-70 text-white font-bold text-[16px] rounded-2xl shadow-md shadow-[#5bc0de33] transition-all active:scale-[0.98] mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-[13px] text-slate-400 mt-6">
          Don't have an account?{' '}
          <button className="text-[#5bc0de] font-semibold hover:underline">
            Contact your pharmacy.
          </button>
        </p>

      </div>
    </div>
  );
};

export default Login;
