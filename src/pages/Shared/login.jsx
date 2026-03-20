import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // For now, bypass authentication and go straight to patient home
    navigate('/patient');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
      <h1>Thnam Medical Tracker</h1>
      <p style={{ marginBottom: '2rem' }}>Please log in to your account</p>
      
      <button 
        onClick={handleLogin}
        style={{ padding: '10px 20px', fontSize: '1rem', cursor: 'pointer', background: '#aa3bff', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        Login as Patient
      </button>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '15px' }}>
        <button onClick={() => navigate('/admin')} style={{ padding: '5px 10px', cursor: 'pointer' }}>Admin Dashboard</button>
        <button onClick={() => navigate('/register')} style={{ padding: '5px 10px', cursor: 'pointer' }}>Register</button>
      </div>
    </div>
  );
}
